package com.airwise.controller;

import com.airwise.dto.AiDtos.*;
import com.airwise.service.AiPersonalizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Air Assistant", description = "Conversational air quality guidance and personalized routine synthesis")
public class AiAssistantController {

    private final AiPersonalizationService aiService;

    @PostMapping("/chat")
    @Operation(summary = "Ask a question to the conversational AI air assistant (Authenticated)")
    public ResponseEntity<ChatResponse> chat(
            Authentication authentication,
            @RequestBody ChatRequest request) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(aiService.handleChat(email, request));
    }

    @PostMapping("/chat/public")
    @Operation(summary = "Public quick consultation without requiring authentication")
    public ResponseEntity<ChatResponse> publicChat(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(aiService.handleChat(null, request));
    }

    @PostMapping("/recommendations")
    @Operation(summary = "Generate structured, personalized lifestyle guidance based on user persona and live AQI")
    public ResponseEntity<PersonalizedGuidanceResponse> getPersonalizedGuidance(
            @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(aiService.getPersonalizedGuidance(request));
    }

    @PostMapping("/recommendations/public")
    @Operation(summary = "Public personalized guidance endpoint")
    public ResponseEntity<PersonalizedGuidanceResponse> getPublicGuidance(
            @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(aiService.getPersonalizedGuidance(request));
    }
}
