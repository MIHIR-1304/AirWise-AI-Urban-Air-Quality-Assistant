package com.airwise.service;

import com.airwise.dto.IndoorDtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IndoorGuideService {

    public IndoorGuidanceResponse getIndoorGuidance(Integer outdoorAqi) {
        int aqi = outdoorAqi != null ? outdoorAqi : 148;
        boolean canVentilate = aqi <= 110;

        String verdict;
        String bestWindow;
        String purifierSpeed;
        int targetAch;
        double recommendedCadr = 250.0; // m3/h for a 20-25 m2 room

        if (aqi <= 50) {
            verdict = "EXCELLENT — Open Windows Freely";
            bestWindow = "Open throughout the morning and afternoon";
            purifierSpeed = "Low / Eco Mode or Standby";
            targetAch = 2;
        } else if (aqi <= 100) {
            verdict = "MODERATE — Controlled Midday Flush";
            bestWindow = "12:30 PM to 3:30 PM (15-20 min cross-ventilation)";
            purifierSpeed = "Auto / Medium";
            targetAch = 3;
        } else if (aqi <= 200) {
            verdict = "CAUTION — Keep Windows Sealed";
            bestWindow = "Do not open windows; if necessary, 5-min crack at 2:00 PM only";
            purifierSpeed = "Medium-to-High Continuous";
            targetAch = 4;
        } else {
            verdict = "HAZARDOUS SMOG — Strict Clean-Room Seal";
            bestWindow = "Keep all exterior openings completely sealed";
            purifierSpeed = "Maximum / Turbo Speed Continuous";
            targetAch = 5;
        }

        List<RoomChecklistItem> checklist = List.of(
                RoomChecklistItem.builder()
                        .id("room-bed-1")
                        .roomName("Bedroom")
                        .task("Position HEPA Purifier 1 Meter Away from Walls & Bed Headboard")
                        .impactLevel("HIGH")
                        .whyItMatters("Clear 360-degree intake ensures clean air circulates directly over the breathing zone during 7-8 hours of sleep.")
                        .isDone(false)
                        .build(),
                RoomChecklistItem.builder()
                        .id("room-bed-2")
                        .roomName("Bedroom")
                        .task("Wash Bed Linens in Warm Water & Vacuum with HEPA Seal")
                        .impactLevel("MEDIUM")
                        .whyItMatters("Dermatophagoides (dust mites) and settled particulate matter resuspend into the air every time you move in bed.")
                        .isDone(false)
                        .build(),
                RoomChecklistItem.builder()
                        .id("room-kit-1")
                        .roomName("Kitchen")
                        .task("Run Range Hood Exhaust on High 2 Mins Before Lighting Stoves")
                        .impactLevel("HIGH")
                        .whyItMatters("Gas burner combustion and frying oils generate ultra-fine PM0.1 and NO₂ spikes that can exceed 400 µg/m³ indoors.")
                        .isDone(false)
                        .build(),
                RoomChecklistItem.builder()
                        .id("room-kit-2")
                        .roomName("Kitchen")
                        .task("Keep Kitchen Door Closed During Frying or Sautéing")
                        .impactLevel("HIGH")
                        .whyItMatters("Prevents oil-aerosol particles from drifting into living and sleeping quarters.")
                        .isDone(false)
                        .build(),
                RoomChecklistItem.builder()
                        .id("room-liv-1")
                        .roomName("Living Room")
                        .task("Install Door Sweep / Draft Excluder on Main Entry Door")
                        .impactLevel("HIGH")
                        .whyItMatters("Up to 35% of outdoor fine dust infiltrates through door under-gaps during windy or high-smog periods.")
                        .isDone(false)
                        .build(),
                RoomChecklistItem.builder()
                        .id("room-liv-2")
                        .roomName("Living Room")
                        .task("Avoid Burning Scented Candles or Incense Sticks (Agarbatti)")
                        .impactLevel("HIGH")
                        .whyItMatters("Incense sticks emit massive concentrations of benzene, toluene, and respirable soot equal to multiple cigarettes.")
                        .isDone(false)
                        .build(),
                RoomChecklistItem.builder()
                        .id("room-nur-1")
                        .roomName("Kids & Nursery Room")
                        .task("Maintain Clean-Air Haven (Target AQI < 25)")
                        .impactLevel("HIGH")
                        .whyItMatters("Infants inhale twice as many air pollutants per pound of body weight as adults.")
                        .isDone(false)
                        .build()
        );

        PlantRealityCheck plantCheck = PlantRealityCheck.builder()
                .headline("The Scientific Reality of Houseplants vs Real-World Air")
                .fact("The famous 1989 NASA Clean Air Study tested plants inside airtight 1-cubic-meter sealed glass chambers with zero air exchange.")
                .realisticBenefit("Plants slightly improve psychological wellbeing and stabilize indoor relative humidity.")
                .limitation("In a real home with normal natural air exchange (0.5 to 1.5 ACH), you would need 10 to 100 plants PER SQUARE METER to match the filtration speed of a modest HEPA air purifier.")
                .recommendedSpecies(List.of("Snake Plant (Sansevieria)", "Spider Plant", "Peace Lily", "Areca Palm"))
                .build();

        List<CookingSafetyTip> cookingTips = List.of(
                CookingSafetyTip.builder()
                        .title("Pre-ventilation is essential")
                        .instruction("Turn on your kitchen exhaust 2 minutes before igniting gas burners to establish positive directional suction.")
                        .estimatedPm25Reduction("Up to 65% lower indoor particulate surge")
                        .build(),
                CookingSafetyTip.builder()
                        .title("Cover pots while boiling & simmering")
                        .instruction("Using lids reduces moisture release and prevents grease micro-droplet vaporization into the surrounding air.")
                        .estimatedPm25Reduction("30% reduction in indoor volatile aerosols")
                        .build(),
                CookingSafetyTip.builder()
                        .title("Post-cooking purge")
                        .instruction("Keep the range hood running for 5 to 10 minutes after cooking finishes to remove lingering gaseous byproducts.")
                        .estimatedPm25Reduction("45% faster clearance of airborne NO₂")
                        .build()
        );

        return IndoorGuidanceResponse.builder()
                .outdoorAqi(aqi)
                .windowVentilationAllowed(canVentilate)
                .ventilationVerdict(verdict)
                .bestVentilationWindow(bestWindow)
                .airPurifierSpeedRecommendation(purifierSpeed)
                .targetAirChangesPerHour(targetAch)
                .recommendedCadrForTypicalRoom(recommendedCadr)
                .roomChecklist(checklist)
                .plantRealityCheck(plantCheck)
                .cookingTips(cookingTips)
                .build();
    }
}
