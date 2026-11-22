package com.airwise;

import com.airwise.service.AirQualityService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AirQualityServiceTest {

    @Test
    void testAqiCategorization() {
        assertEquals("Good", AirQualityService.getAqiCategory(35));
        assertEquals("Moderate", AirQualityService.getAqiCategory(75));
        assertEquals("Unhealthy for Sensitive Groups", AirQualityService.getAqiCategory(125));
        assertEquals("Unhealthy", AirQualityService.getAqiCategory(175));
        assertEquals("Very Unhealthy", AirQualityService.getAqiCategory(250));
        assertEquals("Hazardous", AirQualityService.getAqiCategory(350));
    }

    @Test
    void testAqiColorMatching() {
        assertEquals("#2E8B57", AirQualityService.getAqiColor(40));
        assertEquals("#D97706", AirQualityService.getAqiColor(80));
        assertEquals("#EA580C", AirQualityService.getAqiColor(140));
        assertEquals("#DC2626", AirQualityService.getAqiColor(190));
        assertEquals("#9333EA", AirQualityService.getAqiColor(260));
        assertEquals("#881337", AirQualityService.getAqiColor(380));
    }
}
