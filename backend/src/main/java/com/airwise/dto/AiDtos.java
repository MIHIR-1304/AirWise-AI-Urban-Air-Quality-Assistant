package com.airwise.dto;

import lombok.*;

import java.util.List;

public class AiDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatRequest {
        private Long sessionId;
        private String message;
        private Integer aqi;
        private String city;
        private String persona;
        private Boolean hasInfants;
        private Boolean hasElderly;
        private Boolean hasRespiratoryIssues;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatResponse {
        private Long sessionId;
        private String reply;
        private String senderRole;
        private List<String> suggestedFollowUps;
        private String timestamp;
        private String sourceAttribution; // "Gemini 1.5 Flash AI Engine" or "AirWise Health Heuristics Rule Engine"
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendationRequest {
        private String city;
        private Integer aqi;
        private Double pm25;
        private String persona;
        private Boolean hasInfants;
        private Boolean hasElderly;
        private Boolean hasRespiratoryIssues;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonalizedGuidanceResponse {
        private String headline;
        private String summary;
        private String exposureRiskLevel;
        private String morningRoutine;
        private String commuteStrategy;
        private String indoorAirStrategy;
        private String eveningRoutine;
        private String maskRecommendation;
        private String dietAndHydrationTip;
        private List<String> rationaleBullets;
        private String sourceAttribution;
    }
}
