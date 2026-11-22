package com.airwise.service;

import com.airwise.dto.LocationDtos.CitySearchResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {

    @Value("${airwise.air-quality.geocoding-url:https://geocoding-api.open-meteo.com/v1/search}")
    private String geocodingApiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    private static final List<CitySearchResult> DEFAULT_CITIES = List.of(
            CitySearchResult.builder().id(1L).name("New Delhi").country("India").admin1("Delhi").latitude(28.6139).longitude(77.2090).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(2L).name("Mumbai").country("India").admin1("Maharashtra").latitude(19.0760).longitude(72.8777).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(3L).name("Beijing").country("China").admin1("Beijing").latitude(39.9042).longitude(116.4074).timezone("Asia/Shanghai").build(),
            CitySearchResult.builder().id(4L).name("London").country("United Kingdom").admin1("England").latitude(51.5074).longitude(-0.1278).timezone("Europe/London").build(),
            CitySearchResult.builder().id(5L).name("New York").country("United States").admin1("New York").latitude(40.7128).longitude(-74.0060).timezone("America/New_York").build(),
            CitySearchResult.builder().id(6L).name("Tokyo").country("Japan").admin1("Tokyo").latitude(35.6762).longitude(139.6503).timezone("Asia/Tokyo").build(),
            CitySearchResult.builder().id(7L).name("Paris").country("France").admin1("Île-de-France").latitude(48.8566).longitude(2.3522).timezone("Europe/Paris").build(),
            CitySearchResult.builder().id(8L).name("Los Angeles").country("United States").admin1("California").latitude(34.0522).longitude(-118.2437).timezone("America/Los_Angeles").build(),
            CitySearchResult.builder().id(9L).name("Lahore").country("Pakistan").admin1("Punjab").latitude(31.5204).longitude(74.3587).timezone("Asia/Karachi").build(),
            CitySearchResult.builder().id(10L).name("Bangkok").country("Thailand").admin1("Bangkok").latitude(13.7563).longitude(100.5018).timezone("Asia/Bangkok").build()
    );

    public List<CitySearchResult> searchLocations(String query) {
        if (query == null || query.trim().length() < 2) {
            return DEFAULT_CITIES;
        }

        try {
            String encoded = URLEncoder.encode(query.trim(), StandardCharsets.UTF_8);
            String url = geocodingApiUrl + "?name=" + encoded + "&count=10&language=en&format=json";

            String json = restTemplate.getForObject(url, String.class);
            if (json != null && !json.isBlank()) {
                JsonNode root = objectMapper.readTree(json);
                JsonNode results = root.path("results");
                if (results.isArray() && !results.isEmpty()) {
                    List<CitySearchResult> list = new ArrayList<>();
                    for (JsonNode node : results) {
                        list.add(CitySearchResult.builder()
                                .id(node.path("id").asLong())
                                .name(node.path("name").asText())
                                .country(node.path("country").asText())
                                .admin1(node.path("admin1").asText())
                                .latitude(node.path("latitude").asDouble())
                                .longitude(node.path("longitude").asDouble())
                                .timezone(node.path("timezone").asText())
                                .build());
                    }
                    return list;
                }
            }
        } catch (Exception ex) {
            log.warn("Geocoding API search error for '{}': {}", query, ex.getMessage());
        }

        // Fallback filter over default list
        String q = query.toLowerCase();
        List<CitySearchResult> filtered = DEFAULT_CITIES.stream()
                .filter(c -> c.getName().toLowerCase().contains(q) || c.getCountry().toLowerCase().contains(q))
                .toList();
        return filtered.isEmpty() ? DEFAULT_CITIES : filtered;
    }

    public List<CitySearchResult> getPopularCities() {
        return DEFAULT_CITIES;
    }
}
