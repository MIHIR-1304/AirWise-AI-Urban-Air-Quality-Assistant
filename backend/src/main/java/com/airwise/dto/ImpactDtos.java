package com.airwise.dto;

import lombok.*;

import java.util.List;

public class ImpactDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommuteCalculationRequest {
        private Double distanceKm;
        private String fromLocation;
        private String toLocation;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommuteComparisonResponse {
        private Double distanceKm;
        private List<TransportOption> options;
        private String methodology;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransportOption {
        private String mode; // "METRO", "ELECTRIC_BUS", "CARPOOL", "CYCLING", "SINGLE_CAR"
        private String label;
        private Double co2EmittedKg;
        private Double co2SavedVsCarKg;
        private Double pm25AvoidedG;
        private String exposureRisk;
        private String recommendation;
        private Integer estMinutes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImpactSummaryResponse {
        private Double totalCo2SavedKg;
        private Double totalPm25AvoidedG;
        private Double totalDistanceKm;
        private Integer cleanAirDaysCount;
        private Double equivalentTreesPlanted;
        private List<LoggedTripDto> recentTrips;
        private String calculationDisclaimer;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LogTripRequest {
        private String transportMode;
        private Double distanceKm;
        private String notes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoggedTripDto {
        private Long id;
        private String tripDate;
        private String transportMode;
        private Double distanceKm;
        private Double co2SavedKg;
        private Double pm25AvoidedG;
        private String notes;
    }
}
