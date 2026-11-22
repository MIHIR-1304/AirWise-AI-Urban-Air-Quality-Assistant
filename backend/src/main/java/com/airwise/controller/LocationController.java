package com.airwise.controller;

import com.airwise.dto.LocationDtos.CitySearchResult;
import com.airwise.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Tag(name = "Location Services", description = "Global city search and geographical coordinate lookup")
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/search")
    @Operation(summary = "Search cities worldwide with autocomplete")
    public ResponseEntity<List<CitySearchResult>> search(@RequestParam(required = false, defaultValue = "") String query) {
        return ResponseEntity.ok(locationService.searchLocations(query));
    }

    @GetMapping("/popular")
    @Operation(summary = "Get list of major metropolitan cities monitored globally")
    public ResponseEntity<List<CitySearchResult>> getPopular() {
        return ResponseEntity.ok(locationService.getPopularCities());
    }
}
