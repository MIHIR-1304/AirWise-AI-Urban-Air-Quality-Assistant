package com.airwise.service;

import com.airwise.dto.LocationDtos.CitySearchResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
            CitySearchResult.builder().id(1269300L).name("Jamshedpur").country("India").admin1("Jharkhand").latitude(22.8046).longitude(86.2029).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1258526L).name("Ranchi").country("India").admin1("Jharkhand").latitude(23.3441).longitude(85.3096).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1275339L).name("Kolkata").country("India").admin1("West Bengal").latitude(22.5726).longitude(88.3639).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1261481L).name("New Delhi").country("India").admin1("Delhi").latitude(28.6139).longitude(77.2090).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1275339L).name("Mumbai").country("India").admin1("Maharashtra").latitude(19.0760).longitude(72.8777).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1277333L).name("Bengaluru").country("India").admin1("Karnataka").latitude(12.9716).longitude(77.5946).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1269843L).name("Hyderabad").country("India").admin1("Telangana").latitude(17.3850).longitude(78.4867).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1264527L).name("Chennai").country("India").admin1("Tamil Nadu").latitude(13.0827).longitude(80.2707).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1259229L).name("Pune").country("India").admin1("Maharashtra").latitude(18.5204).longitude(73.8567).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1279233L).name("Ahmedabad").country("India").admin1("Gujarat").latitude(23.0225).longitude(72.5714).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1260086L).name("Patna").country("India").admin1("Bihar").latitude(25.5941).longitude(85.1376).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(1264733L).name("Lucknow").country("India").admin1("Uttar Pradesh").latitude(26.8467).longitude(80.9462).timezone("Asia/Kolkata").build(),
            CitySearchResult.builder().id(2643743L).name("London").country("United Kingdom").admin1("England").latitude(51.5074).longitude(-0.1278).timezone("Europe/London").build(),
            CitySearchResult.builder().id(5128581L).name("New York").country("United States").admin1("New York").latitude(40.7128).longitude(-74.0060).timezone("America/New_York").build(),
            CitySearchResult.builder().id(1850147L).name("Tokyo").country("Japan").admin1("Tokyo").latitude(35.6762).longitude(139.6503).timezone("Asia/Tokyo").build(),
            CitySearchResult.builder().id(1816670L).name("Beijing").country("China").admin1("Beijing").latitude(39.9042).longitude(116.4074).timezone("Asia/Shanghai").build(),
            CitySearchResult.builder().id(2988507L).name("Paris").country("France").admin1("Île-de-France").latitude(48.8566).longitude(2.3522).timezone("Europe/Paris").build(),
            CitySearchResult.builder().id(1172451L).name("Lahore").country("Pakistan").admin1("Punjab").latitude(31.5204).longitude(74.3587).timezone("Asia/Karachi").build(),
            CitySearchResult.builder().id(1609350L).name("Bangkok").country("Thailand").admin1("Bangkok").latitude(13.7563).longitude(100.5018).timezone("Asia/Bangkok").build(),
            CitySearchResult.builder().id(5368361L).name("Los Angeles").country("United States").admin1("California").latitude(34.0522).longitude(-118.2437).timezone("America/Los_Angeles").build()
    );

    public List<CitySearchResult> searchLocations(String query) {
        if (query == null || query.trim().length() < 2) {
            return DEFAULT_CITIES;
        }

        String trimmed = query.trim();

        // 1. Live geocoding via Open-Meteo with genuine User-Agent
        try {
            String encoded = URLEncoder.encode(trimmed, StandardCharsets.UTF_8);
            String url = geocodingApiUrl + "?name=" + encoded + "&count=10&language=en&format=json";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "AirWise-AI-Urban-Air-Quality-Assistant/1.0 (contact: mihirmahato1304@gmail.com)");
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && !response.getBody().isBlank()) {
                JsonNode root = objectMapper.readTree(response.getBody());
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
            log.warn("Geocoding API search exception for '{}': {}", trimmed, ex.getMessage());
        }

        // 2. Fallback to curated city directory matching query
        String q = trimmed.toLowerCase();
        return DEFAULT_CITIES.stream()
                .filter(c -> c.getName().toLowerCase().contains(q)
                          || (c.getCountry() != null && c.getCountry().toLowerCase().contains(q))
                          || (c.getAdmin1() != null && c.getAdmin1().toLowerCase().contains(q)))
                .toList();
    }

    public List<CitySearchResult> getPopularCities() {
        return DEFAULT_CITIES;
    }
}
