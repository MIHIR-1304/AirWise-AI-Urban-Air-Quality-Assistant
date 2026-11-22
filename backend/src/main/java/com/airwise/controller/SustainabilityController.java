package com.airwise.controller;

import com.airwise.dto.ImpactDtos.*;
import com.airwise.service.SustainabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/impact")
@RequiredArgsConstructor
@Tag(name = "Sustainability & Impact", description = "Low-emission commute options, transparent CO2 calculations, and personal environmental tracking")
public class SustainabilityController {

    private final SustainabilityService sustainabilityService;

    @GetMapping("/calculate")
    @Operation(summary = "Compare commute alternatives (Metro, EV Bus, Carpool, Bicycle) vs ICE car emissions")
    public ResponseEntity<CommuteComparisonResponse> calculateCommute(
            @RequestParam(required = false, defaultValue = "15.0") Double distanceKm) {
        return ResponseEntity.ok(sustainabilityService.compareCommuteModes(distanceKm));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get user's personal clean air contribution, CO2 saved, and logged trips")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<ImpactSummaryResponse> getImpactSummary(Authentication authentication) {
        return ResponseEntity.ok(sustainabilityService.getImpactSummary(authentication.getName()));
    }

    @PostMapping("/log-trip")
    @Operation(summary = "Log a sustainable commute trip and calculate CO2/PM2.5 saved")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<LoggedTripDto> logTrip(
            Authentication authentication,
            @RequestBody LogTripRequest request) {
        return ResponseEntity.ok(sustainabilityService.logTrip(authentication.getName(), request));
    }
}
