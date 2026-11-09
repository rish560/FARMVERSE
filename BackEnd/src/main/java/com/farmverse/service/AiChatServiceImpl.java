package com.farmverse.service;

import com.farmverse.dto.ChatRequestDTO;
import com.farmverse.dto.ChatResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class AiChatServiceImpl implements AiChatService {

        private static final Logger log = LoggerFactory.getLogger(AiChatServiceImpl.class);

        // Explicit timeouts -- an AI provider hiccup must never hang the request
        // thread indefinitely (plain "new RestTemplate()" has no timeout at all).
        private final RestTemplate restTemplate = new RestTemplateBuilder()
                        .setConnectTimeout(Duration.ofSeconds(5))
                        .setReadTimeout(Duration.ofSeconds(20))
                        .build();

        private final ObjectMapper mapper = new ObjectMapper();

        @Value("${groq.api.url}")
        private String apiUrl;

        @Value("${groq.api.key}")
        private String apiKey;

        @Value("${groq.model}")
        private String model;

        private static final String SYSTEM_PROMPT = """
                        You are FarmVerse AI, a friendly and knowledgeable farming assistant built into the
                        FarmVerse precision agriculture platform for Indian farmers and farm managers.
                        Rules:
                        - Give short, practical, actionable advice (max 4-5 sentences).
                        - Focus on: crop care, pest/disease identification, soil health, irrigation, and
                          weather-based actions.
                        - If the issue sounds serious (major crop loss risk, unknown disease, large-scale
                          infestation), advise contacting the local agricultural extension office.
                        - Never recommend specific banned or restricted pesticides.
                        - Use simple, farmer-friendly language, avoid jargon.
                        - If a crop or location is provided, tailor the advice to it.
                        - Keep a warm, encouraging tone -- you are a trusted advisor, not a search engine.
                        - IMPORTANT: Always reply using the SAME script/style the farmer used, not just the
                          same language. Specifically:
                          * If they write in Devanagari Hindi, reply in Devanagari Hindi.
                          * If they write Hindi using English/Latin letters -- romanized Hindi, e.g. "mere
                            tamatar kharab ho rahe hai" -- reply in that SAME romanized Hindi (Hinglish)
                            style, using Latin letters. Do NOT switch to Devanagari script in this case.
                          * If they mix Hindi and English words together, reply in a similarly natural
                            mixed Hinglish style.
                          * If they write in Tamil, Telugu, Marathi, or another Indian language script,
                            reply in that same script.
                          * If they write in plain English, reply in English.
                          In short: match the farmer's actual script and style, never upgrade or change
                          the script on them.
                        """;

        @Override
        public ChatResponseDTO getAdvice(ChatRequestDTO request) {
                String userContext = """
                                Crop: %s
                                Location: %s
                                Preferred language: %s
                                Question: %s
                                """.formatted(
                                orDefault(request.getCrop(), "not specified"),
                                orDefault(request.getLocation(), "not specified"),
                                orDefault(request.getLanguage(), "English"),
                                request.getQuestion());

                Map<String, Object> body = Map.of(
                                "model", model,
                                "messages", List.of(
                                                Map.of("role", "system", "content", SYSTEM_PROMPT),
                                                Map.of("role", "user", "content", userContext)),
                                "max_tokens", 300,
                                "temperature", 0.4);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(apiKey);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

                try {
                        String rawResponse = restTemplate.postForObject(apiUrl, entity, String.class);
                        JsonNode root = mapper.readTree(rawResponse);
                        String answer = root.path("choices").get(0)
                                        .path("message").path("content").asText().trim();

                        return ChatResponseDTO.builder()
                                        .answer(answer)
                                        .timestamp(Instant.now().toString())
                                        .build();

                } catch (HttpClientErrorException | HttpServerErrorException e) {
                        // These carry the actual status code + response body from Groq (e.g.
                        // 401 invalid key, 400 decommissioned/unknown model, 429 rate limit)
                        // -- log it so a config problem doesn't masquerade as a vague
                        // "temporarily unavailable" for days, the way the mandi price
                        // filters silently failing did before we added similar logging there.
                        log.error("Groq API call failed: status={} model='{}' responseBody={}",
                                        e.getStatusCode(), model, e.getResponseBodyAsString());
                        throw new RuntimeException("FarmVerse AI is temporarily unavailable. Please try again.", e);
                } catch (RestClientException e) {
                        log.error("Groq API call failed (network/timeout): model='{}'", model, e);
                        throw new RuntimeException("FarmVerse AI is temporarily unavailable. Please try again.", e);
                } catch (Exception e) {
                        log.error("Failed to process Groq AI response: model='{}'", model, e);
                        throw new RuntimeException("Failed to process AI response: " + e.getMessage(), e);
                }
        }

        private String orDefault(String val, String fallback) {
                return (val == null || val.isBlank()) ? fallback : val;
        }
}