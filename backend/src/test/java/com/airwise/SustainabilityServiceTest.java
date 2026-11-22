package com.airwise;

import com.airwise.dto.ImpactDtos.CommuteComparisonResponse;
import com.airwise.dto.ImpactDtos.TransportOption;
import com.airwise.service.SustainabilityService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SustainabilityServiceTest {

    private final SustainabilityService sustainabilityService = new SustainabilityService(null, null);

    @Test
    void testCommuteComparisonCalculations() {
        CommuteComparisonResponse resp = sustainabilityService.compareCommuteModes(20.0);

        assertNotNull(resp);
        assertEquals(20.0, resp.getDistanceKm());
        assertFalse(resp.getOptions().isEmpty());

        TransportOption metro = resp.getOptions().stream()
                .filter(o -> "METRO".equals(o.getMode()))
                .findFirst()
                .orElse(null);

        assertNotNull(metro);
        assertTrue(metro.getCo2SavedVsCarKg() > 0, "Metro should yield positive CO2 savings over solo car");
        assertTrue(metro.getPm25AvoidedG() > 0, "Metro should avoid particulate tire/brake emissions");
    }
}
