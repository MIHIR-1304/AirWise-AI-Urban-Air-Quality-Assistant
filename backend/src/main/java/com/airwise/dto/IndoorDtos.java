package com.airwise.dto;

import lombok.*;

import java.util.List;

public class IndoorDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class IndoorGuidanceResponse {
        private Integer outdoorAqi;
        private Boolean windowVentilationAllowed;
        private String ventilationVerdict; // "SAFE TO VENTILATE", "CAUTION / QUICK FLUSH ONLY", "KEEP SEALED"
        private String bestVentilationWindow;
        private String airPurifierSpeedRecommendation;
        private Integer targetAirChangesPerHour; // e.g. 4-5 ACH
        private Double recommendedCadrForTypicalRoom;
        private List<RoomChecklistItem> roomChecklist;
        private PlantRealityCheck plantRealityCheck;
        private List<CookingSafetyTip> cookingTips;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoomChecklistItem {
        private String id;
        private String roomName;
        private String task;
        private String impactLevel; // HIGH, MEDIUM, LOW
        private String whyItMatters;
        private Boolean isDone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PlantRealityCheck {
        private String headline;
        private String fact;
        private String realisticBenefit;
        private String limitation;
        private List<String> recommendedSpecies;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CookingSafetyTip {
        private String title;
        private String instruction;
        private String estimatedPm25Reduction;
    }
}
