package com.airwise.controller;

import com.airwise.dto.RoutineDtos.*;
import com.airwise.entity.SavedRecommendation;
import com.airwise.service.DailyRoutineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
@Tag(name = "Daily Planner & Routine", description = "Personalized smog defense daily routine planner")
@SecurityRequirement(name = "BearerAuth")
public class DailyRoutineController {

    private final DailyRoutineService dailyRoutineService;

    @GetMapping("/today")
    @Operation(summary = "Get today's tailored routine with outdoor/commute/exercise safety")
    public ResponseEntity<RoutineDto> getTodayRoutine(
            Authentication authentication,
            @RequestParam(required = false) Integer aqi,
            @RequestParam(required = false) String persona) {
        return ResponseEntity.ok(dailyRoutineService.getTodayRoutine(authentication.getName(), aqi, persona));
    }

    @PostMapping("/generate")
    @Operation(summary = "Regenerate personalized routine based on latest AQI or updated persona")
    public ResponseEntity<RoutineDto> generateNewRoutine(
            Authentication authentication,
            @RequestBody GenerateRoutineRequest request) {
        return ResponseEntity.ok(dailyRoutineService.generateNewRoutine(authentication.getName(), request));
    }

    @PutMapping("/activities/{activityId}/status")
    @Operation(summary = "Mark an activity as completed or uncompleted")
    public ResponseEntity<RoutineActivityDto> updateActivityStatus(
            @PathVariable Long activityId,
            @RequestBody UpdateActivityStatusRequest request) {
        return ResponseEntity.ok(dailyRoutineService.updateActivityStatus(activityId, request));
    }

    @GetMapping("/saved-recommendations")
    @Operation(summary = "Get user's bookmarked air quality recommendations")
    public ResponseEntity<List<SavedRecommendation>> getSavedRecommendations(Authentication authentication) {
        return ResponseEntity.ok(dailyRoutineService.getSavedRecommendations(authentication.getName()));
    }

    @PostMapping("/saved-recommendations")
    @Operation(summary = "Save a personalized tip or recommendation")
    public ResponseEntity<SavedRecommendation> saveRecommendation(
            Authentication authentication,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(dailyRoutineService.saveRecommendation(
                authentication.getName(),
                body.get("title"),
                body.get("category"),
                body.get("content"),
                body.get("actionItem")
        ));
    }

    @DeleteMapping("/saved-recommendations/{id}")
    @Operation(summary = "Remove a saved recommendation")
    public ResponseEntity<Void> deleteSavedRecommendation(
            Authentication authentication,
            @PathVariable Long id) {
        dailyRoutineService.deleteSavedRecommendation(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
