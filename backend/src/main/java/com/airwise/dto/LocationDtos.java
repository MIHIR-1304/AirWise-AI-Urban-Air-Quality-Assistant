package com.airwise.dto;

import lombok.*;

public class LocationDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CitySearchResult {
        private Long id;
        private String name;
        private String country;
        private String admin1;
        private Double latitude;
        private Double longitude;
        private String timezone;
    }
}
