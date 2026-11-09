package com.farmverse.service;

import com.farmverse.dto.WeatherResponseDTO;
import com.farmverse.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;

@Service
public class WeatherServiceImpl implements WeatherService {

    // Explicit timeouts -- a slow/dead external API must never be able to hang
    // a backend request thread indefinitely (plain "new RestTemplate()" has none).
    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(8))
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${weatherapi.api.key}")
    private String apiKey;

    @Value("${weatherapi.forecast.url}")
    private String forecastUrl;

    @Override
    public WeatherResponseDTO getWeather(String location) {
        if (location == null || location.isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }

        try {
            // WeatherAPI.com's free plan caps forecast at 3 days -- requesting more
            // than the plan allows can make the whole call fail, which would break
            // the already-working current/tomorrow badge too. days=3 is the safe max.
            String url = UriComponentsBuilder.fromHttpUrl(forecastUrl)
                    .queryParam("key", apiKey)
                    .queryParam("q", location)
                    .queryParam("days", 3)
                    .queryParam("aqi", "no")
                    .queryParam("alerts", "no")
                    .toUriString();

            String rawResponse = restTemplate.getForObject(url, String.class);
            JsonNode root = mapper.readTree(rawResponse);

            // WeatherAPI does fuzzy text matching -- "hello" or a typo can still
            // return SOME place. Surface exactly what it matched so the UI never
            // silently shows weather for the wrong place without saying so.
            JsonNode locationNode = root.path("location");
            String matchedName = locationNode.path("name").asText("");
            String matchedRegion = locationNode.path("region").asText("");
            String matchedCountry = locationNode.path("country").asText("");
            String resolvedLocation = java.util.stream.Stream.of(matchedName, matchedRegion, matchedCountry)
                    .filter(s -> s != null && !s.isBlank())
                    .collect(java.util.stream.Collectors.joining(", "));

            // WeatherAPI fuzzy-matches almost any text to SOME place (e.g. "hello"
            // silently returning a real city's weather). Reject matches that don't
            // actually resemble what was typed, instead of showing misleading data.
            if (!looksLikeARealMatch(location, matchedName)) {
                throw new ResourceNotFoundException(
                        "No matching location found for \"" + location + "\". Please check the spelling or enter a valid city/town name.");
            }

            JsonNode current = root.path("current");
            double currentTemp = current.path("temp_c").asDouble();
            int humidity = current.path("humidity").asInt();
            String currentConditionText = current.path("condition").path("text").asText("Clear");

            JsonNode forecastDays = root.path("forecast").path("forecastday");
            // index 0 = today, index 1 = tomorrow
            JsonNode tomorrow = forecastDays.size() > 1 ? forecastDays.get(1) : forecastDays.get(0);
            JsonNode tomorrowDay = tomorrow.path("day");

            double tomorrowHigh = tomorrowDay.path("maxtemp_c").asDouble();
            double tomorrowLow = tomorrowDay.path("mintemp_c").asDouble();
            int tomorrowRainChance = tomorrowDay.path("daily_chance_of_rain").asInt();
            String tomorrowConditionText = tomorrowDay.path("condition").path("text").asText("Clear");

            java.util.List<WeatherResponseDTO.DailyForecast> dailyForecast = new java.util.ArrayList<>();
            java.time.LocalDate today = java.time.LocalDate.now();
            for (JsonNode dayNode : forecastDays) {
                String dateStr = dayNode.path("date").asText("");
                JsonNode day = dayNode.path("day");
                String label;
                try {
                    java.time.LocalDate d = java.time.LocalDate.parse(dateStr);
                    if (d.isEqual(today)) label = "Today";
                    else if (d.isEqual(today.plusDays(1))) label = "Tomorrow";
                    else label = d.getDayOfWeek().getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.ENGLISH);
                } catch (Exception ex) {
                    label = dateStr;
                }
                String dayCondition = day.path("condition").path("text").asText("Clear");
                dailyForecast.add(WeatherResponseDTO.DailyForecast.builder()
                        .date(dateStr)
                        .dayLabel(label)
                        .high(round1(day.path("maxtemp_c").asDouble()))
                        .low(round1(day.path("mintemp_c").asDouble()))
                        .rainChance(day.path("daily_chance_of_rain").asInt())
                        .condition(dayCondition)
                        .icon(iconFor(dayCondition))
                        .build());
            }

            return WeatherResponseDTO.builder()
                    .location(location)
                    .resolvedLocation(resolvedLocation)
                    .currentTemp(round1(currentTemp))
                    .currentCondition(currentConditionText)
                    .currentIcon(iconFor(currentConditionText))
                    .currentHumidity(humidity)
                    .tomorrowHigh(round1(tomorrowHigh))
                    .tomorrowLow(round1(tomorrowLow))
                    .tomorrowRainChance(tomorrowRainChance)
                    .tomorrowCondition(tomorrowConditionText)
                    .tomorrowIcon(iconFor(tomorrowConditionText))
                    .dailyForecast(dailyForecast)
                    .build();

        } catch (ResourceNotFoundException e) {
            throw e; // preserve the clean 404 -- don't let the generic catch below turn it into a 500
        } catch (RestClientException e) {
            throw new RuntimeException("Weather service is temporarily unavailable.", e);
        } catch (Exception e) {
            throw new RuntimeException("Could not fetch weather for \"" + location + "\". Check the location name.", e);
        }
    }

    // Rejects fuzzy matches that don't actually resemble the typed location
    // (e.g. WeatherAPI silently matching "hello" to some unrelated real city).
    // Heuristic: normalize both strings (letters/digits only, lowercase) and
    // require the typed text and the matched city name to share a real overlap.
    // Rejects anything that isn't the actual real place typed. "hello" and the
    // real town "Hell" are only one letter apart, so any similarity-based check
    // (contains, edit-distance, etc.) can be fooled by that kind of coincidence.
    // The only way to guarantee "only registered places" is to require an EXACT
    // match (after normalizing case/punctuation/spacing) between what was typed
    // and what WeatherAPI resolved it to -- no fuzzy tolerance, no typo leniency.
    private boolean looksLikeARealMatch(String typed, String matchedName) {
        String typedNorm = normalize(typed);
        String matchedNorm = normalize(matchedName);
        if (typedNorm.isEmpty() || matchedNorm.isEmpty()) return false;
        return typedNorm.equals(matchedNorm);
    }

    private String normalize(String s) {
        return s == null ? "" : s.toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    // WeatherAPI.com gives free-text conditions like "Partly cloudy", "Patchy rain
    // possible",
    // "Moderate rain", "Thundery outbreaks possible" -- so we match by keyword, not
    // exact code.
    private String iconFor(String conditionText) {
        if (conditionText == null)
            return "\u26C5"; // ⛅
        String c = conditionText.toLowerCase();
        if (c.contains("thunder"))
            return "\u26C8\uFE0F"; // ⛈️
        if (c.contains("snow") || c.contains("sleet") || c.contains("ice") || c.contains("blizzard"))
            return "\u2744\uFE0F"; // ❄️
        if (c.contains("rain") || c.contains("drizzle") || c.contains("shower"))
            return "\uD83C\uDF27\uFE0F"; // 🌧️
        if (c.contains("mist") || c.contains("fog") || c.contains("haze"))
            return "\uD83C\uDF2B\uFE0F"; // 🌫️
        if (c.contains("overcast") || c.contains("cloud"))
            return "\u26C5"; // ⛅
        if (c.contains("clear") || c.contains("sunny"))
            return "\u2600\uFE0F"; // ☀️
        return "\u26C5";
    }

    private double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }
}