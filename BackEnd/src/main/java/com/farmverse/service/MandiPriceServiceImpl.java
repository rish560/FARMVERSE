package com.farmverse.service;

import com.farmverse.dto.MandiPriceResponseDTO;
import com.farmverse.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MandiPriceServiceImpl implements MandiPriceService {

    private static final Logger log = LoggerFactory.getLogger(MandiPriceServiceImpl.class);
    private static final String NOT_CONFIGURED_PLACEHOLDER = "PASTE_YOUR_DATA_GOV_IN_KEY_HERE";
    private static final int PAGE_SIZE = 100; // records per request to the government API
    private static final int MAX_PAGES = 10; // hard cap (1000 records) -- comfortably covers every mandi for a single
                                             // state+commodity while keeping worst-case latency bounded
    private static final long TIME_BUDGET_MS = 20_000; // stay well under the frontend's 30s request timeout

    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${mandi.api.key}")
    private String apiKey;

    @Value("${mandi.api.url}")
    private String apiUrl;

    @Override
    public List<MandiPriceResponseDTO> getPrices(String state, String commodity, String district) {
        if (apiKey == null || apiKey.isBlank() || NOT_CONFIGURED_PLACEHOLDER.equals(apiKey)) {
            throw new ResourceNotFoundException(
                    "Mandi price lookup is not configured yet. A data.gov.in API key is required -- see application.properties.");
        }
        if (commodity == null || commodity.isBlank()) {
            throw new IllegalArgumentException("Commodity (crop name) is required.");
        }
        if (state == null || state.isBlank()) {
            throw new IllegalArgumentException("State is required.");
        }
        if (district == null || district.isBlank()) {
            throw new IllegalArgumentException("District is required.");
        }
        log.info(
                "Mandi price lookup starting: commodity='{}' state='{}' district='{}' apiKeyPrefix='{}' apiKeyLength={}",
                commodity, state, district,
                apiKey.length() > 8 ? apiKey.substring(0, 8) + "..." : "(short key)", apiKey.length());

        String stateForQuery = toTitleCase(state);
        String districtForQuery = toTitleCase(district);

        try {
            // The government API's filters are not strictly enforced -- it can
            // return records that don't actually match the requested state or
            // district (e.g. asking for Himachal Pradesh silently returning a
            // Tripura record). So keep only records that genuinely match both,
            // and de-duplicate by market so each real mandi appears once
            // (a market can have multiple records for different varieties).
            Map<String, MandiPriceResponseDTO> byMarket = new LinkedHashMap<>();

            int offset = 0;
            int total = Integer.MAX_VALUE; // unknown until first response
            int pagesFetched = 0;
            long startTime = System.currentTimeMillis();

            // Page through the full result set (the API caps each response at
            // PAGE_SIZE records) instead of stopping after the first page, so
            // every real mandi reporting this commodity in this state is
            // returned -- not just the first ~100 raw records. Bounded by both
            // a page count and a wall-clock budget so a slow upstream can't
            // hang the request past the frontend's own timeout -- we return
            // whatever we've collected so far instead of failing outright.
            while (offset < total && pagesFetched < MAX_PAGES
                    && (System.currentTimeMillis() - startTime) < TIME_BUDGET_MS) {
                UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                        .queryParam("api-key", apiKey)
                        .queryParam("format", "json")
                        .queryParam("limit", PAGE_SIZE)
                        .queryParam("offset", offset)
                        .queryParam("filters[commodity]", commodity)
                        .queryParam("filters[state]", stateForQuery)
                        .queryParam("filters[district]", districtForQuery);

                // IMPORTANT: build().encode() is required here. Without it, values
                // containing spaces (most Indian state names -- "Himachal Pradesh",
                // "Tamil Nadu", etc.) and the literal "[" "]" in "filters[state]" go
                // out un-percent-encoded. The government API then silently fails to
                // apply the filter instead of erroring, and returns the entire
                // day's unfiltered nationwide dataset (tens of thousands of
                // records) -- which is why "no data found" was showing even for
                // crops/districts that genuinely have live data: we were scanning
                // an unfiltered firehose a page at a time and rarely reaching a
                // matching row within our page cap.
                URI requestUri = builder.build().encode().toUri();
                if (pagesFetched == 0) {
                    log.info("Mandi API request URL (key masked): {}",
                            requestUri.toString().replace(apiKey, "***"));
                }

                String rawResponse = restTemplate.getForObject(requestUri, String.class);
                JsonNode root = mapper.readTree(rawResponse);

                if (pagesFetched == 0) {
                    total = root.path("total").asInt(0);
                    // Some responses omit "total" -- fall back to "count" or just
                    // this page's size so we still return what we got instead of looping forever.
                    if (total <= 0)
                        total = root.path("count").asInt(0);
                    log.info(
                            "Mandi API first-page response: reported total={} count={} recordsFieldIsArray={} rawSnippet={}",
                            root.path("total").asText("(missing)"), root.path("count").asText("(missing)"),
                            root.path("records").isArray(),
                            rawResponse.length() > 500 ? rawResponse.substring(0, 500) + "..." : rawResponse);
                }

                JsonNode records = root.path("records");
                int recordsInPage = 0;
                if (records.isArray()) {
                    for (JsonNode candidate : records) {
                        recordsInPage++;
                        String candidateState = candidate.path("state").asText("");
                        if (!normalize(candidateState).equals(normalize(state)))
                            continue;

                        String candidateDistrict = candidate.path("district").asText("");
                        if (!normalize(candidateDistrict).equals(normalize(district)))
                            continue;

                        String market = candidate.path("market").asText("");
                        if (market.isBlank() || byMarket.containsKey(market))
                            continue;

                        byMarket.put(market, MandiPriceResponseDTO.builder()
                                .state(candidateState)
                                .district(candidate.path("district").asText(""))
                                .market(market)
                                .commodity(candidate.path("commodity").asText(commodity))
                                .variety(candidate.path("variety").asText(""))
                                .arrivalDate(candidate.path("arrival_date").asText(""))
                                .minPrice(parsePrice(candidate.path("min_price")))
                                .maxPrice(parsePrice(candidate.path("max_price")))
                                .modalPrice(parsePrice(candidate.path("modal_price")))
                                .build());
                    }
                }

                pagesFetched++;
                offset += PAGE_SIZE;
                log.info("Mandi API page {} processed: recordsInPage={} keptSoFar={}", pagesFetched, recordsInPage,
                        byMarket.size());

                // If a page came back with fewer records than we asked for (or
                // none at all), that's the last page regardless of what "total" said.
                if (recordsInPage < PAGE_SIZE)
                    break;
            }

            List<MandiPriceResponseDTO> results = new ArrayList<>(byMarket.values());

            if (results.isEmpty()) {
                throw new ResourceNotFoundException(
                        "No mandi price data found for \"" + commodity + "\" in " + district + ", " + state
                                + ". Double-check the district spelling matches its official name exactly (e.g. \"Muzaffarpur\", not \"Muzaffapur\") -- a misspelled district returns no results here, not an error. If the spelling is right, try a nearby district, or check back later since not every district reports every commodity daily.");
            }

            return results;

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (RestClientException e) {
            throw new RuntimeException("Mandi price service is temporarily unavailable.", e);
        } catch (Exception e) {
            throw new RuntimeException("Could not fetch mandi price for \"" + commodity + "\".", e);
        }
    }

    private String normalize(String s) {
        return s == null ? "" : s.trim().toLowerCase().replaceAll("\\s+", " ");
    }

    // The government API's state/district fields are indexed as exact-match
    // "keyword" fields server-side -- a case mismatch (e.g. "kangra" typed
    // when the dataset stores "Kangra") makes the upstream filter reject
    // everything before we ever see a record, regardless of how forgiving
    // our own post-filter matching is. Title-case free-text input before
    // sending it as a filter so casing typos don't silently return zero
    // results.
    private String toTitleCase(String s) {
        if (s == null || s.isBlank())
            return s;
        StringBuilder result = new StringBuilder();
        for (String word : s.trim().toLowerCase().split("\\s+")) {
            if (word.isEmpty())
                continue;
            if (result.length() > 0)
                result.append(' ');
            result.append(Character.toUpperCase(word.charAt(0))).append(word.substring(1));
        }
        return result.toString();
    }

    // Government dataset prices are published as text (e.g. "2500.00") and are
    // in Rs per quintal (100 kg), not per kg -- caller converts as needed.
    private double parsePrice(JsonNode node) {
        try {
            return Double.parseDouble(node.asText("0").trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}