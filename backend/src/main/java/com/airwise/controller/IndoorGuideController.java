package com.airwise.controller;

import com.airwise.dto.IndoorDtos.IndoorGuidanceResponse;
import com.airwise.service.IndoorGuideService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/indoor")
@RequiredArgsConstructor
@Tag(name = "Indoor Air Quality Guide", description = "Ventilation, HEPA purifiers, CADR sizing, and room safety checklist")
public class IndoorGuideController {

    private final IndoorGuideService indoorGuideService;

    @GetMapping("/public-guidance")
    @Operation(summary = "Get indoor air guidance, window-opening status, and room checklists")
    public ResponseEntity<IndoorGuidanceResponse> getPublicGuidance(@RequestParam(required = false, defaultValue = "145") Integer aqi) {
        return ResponseEntity.ok(indoorGuideService.getIndoorGuidance(aqi));
    }

    @GetMapping("/guidance")
    @Operation(summary = "Get indoor guidance for authenticated user's current city")
    public ResponseEntity<IndoorGuidanceResponse> getGuidance(@RequestParam(required = false, defaultValue = "145") Integer aqi) {
        return ResponseEntity.ok(indoorGuideService.getIndoorGuidance(aqi));
    }
}
