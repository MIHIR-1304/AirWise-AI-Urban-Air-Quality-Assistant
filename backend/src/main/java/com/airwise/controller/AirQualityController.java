package com.airwise.controller;

import com.airwise.dto.AirQualityDtos.AirQualityResponse;
import com.airwise.service.AirQualityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/air-quality")
@RequiredArgsConstructor
@Tag(name = "Air Quality Intelligence", description = "Real-time global AQI, pollutants, and forecasts")
public class AirQualityController {

    private final AirQualityService airQualityService;

    @GetMapping("/current")
    @Operation(summary = "Get current air quality, pollutants breakdown, trends, and safety guidance")
    public ResponseEntity<AirQualityResponse> getCurrentAirQuality(
            @Parameter(description = "City name e.g. 'Jamshedpur', 'New Delhi'") @RequestParam(required = false, defaultValue = "Jamshedpur") String city,
            @Parameter(description = "Latitude") @RequestParam(required = false) Double lat,
            @Parameter(description = "Longitude") @RequestParam(required = false) Double lon) {
        return ResponseEntity.ok(airQualityService.getAirQuality(city, lat, lon));
    }

    @GetMapping("/history")
    @Operation(summary = "Get 24-hour historical air quality hourly trend for location")
    public ResponseEntity<AirQualityResponse> getHourlyTrend(
            @RequestParam(required = false, defaultValue = "Jamshedpur") String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        return ResponseEntity.ok(airQualityService.getAirQuality(city, lat, lon));
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get 7-day multi-pollutant forecast")
    public ResponseEntity<AirQualityResponse> getForecast(
            @RequestParam(required = false, defaultValue = "Jamshedpur") String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        return ResponseEntity.ok(airQualityService.getAirQuality(city, lat, lon));
    }
}
