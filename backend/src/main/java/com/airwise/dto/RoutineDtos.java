package com.airwise.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

public class RoutineDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoutineDto {
        private Long id;
        private LocalDate routineDate;
        private String summary;
        private String overallExposureRisk;
        private List<RoutineActivityDto> activities;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoutineActivityDto {
        private Long id;
        private String timeSlot;
        private String activityType;
        private String suggestedActivity;
        private String reason;
        private String exposureLevel;
        private String alternativeAction;
        private Boolean isCompleted;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GenerateRoutineRequest {
        private String city;
        private Integer aqi;
        private String persona;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateActivityStatusRequest {
        private Boolean isCompleted;
    }
}
