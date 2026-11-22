package com.airwise.dto;

import lombok.*;

import java.util.List;

public class AirQualityDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AirQualityResponse {
        private String locationName;
        private String country;
        private Double latitude;
        private Double longitude;
        private Integer aqi;
        private String aqiCategory; // Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous
        private String aqiColor;
        private String dominantPollutant;
        private Double temperature;
        private Double humidity;
        private Double windSpeed;
        private String windDirection;
        private String weatherDescription;
        private Double uvIndex;
        private Double pm25;
        private Double pm10;
        private String recordedAt;
        private String source;
        private List<PollutantDetail> pollutants;
        private List<HourlyTrendPoint> hourlyTrend;
        private List<ForecastDay> forecast;
        private HealthAdvisory healthAdvisory;
        private OutdoorSafety outdoorSafety;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PollutantDetail {
        private String code; // PM2.5, PM10, NO2, O3, SO2, CO
        private String name;
        private Double value;
        private String unit;
        private String status; // Good, Moderate, Poor, Severe
        private String color;
        private String description;
        private Double whoGuideline;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HourlyTrendPoint {
        private String time;
        private Integer aqi;
        private Double pm25;
        private Double pm10;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForecastDay {
        private String day;
        private String date;
        private Integer aqi;
        private String category;
        private String color;
        private Double maxTemp;
        private Double minTemp;
        private String summary;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HealthAdvisory {
        private String generalMessage;
        private String sensitiveGroupsMessage;
        private String maskGuidance; // None, N95 Recommended, N95 Mandatory
        private String windowVentilation; // Safe, Brief only, Keep Closed
        private String outdoorExercise; // Safe, Limit, Avoid
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OutdoorSafety {
        private ActivitySafety running;
        private ActivitySafety cycling;
        private ActivitySafety walking;
        private ActivitySafety childrenAndSeniors;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivitySafety {
        private String status; // SAFE, CAUTION, NOT_RECOMMENDED, HAZARDOUS
        private String advice;
        private String recommendedTime;
    }
}
