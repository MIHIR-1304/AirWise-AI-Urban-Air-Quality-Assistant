package com.airwise.service;

import com.airwise.dto.ImpactDtos.*;
import com.airwise.entity.EnvironmentalImpact;
import com.airwise.entity.User;
import com.airwise.exception.ResourceNotFoundException;
import com.airwise.repository.EnvironmentalImpactRepository;
import com.airwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SustainabilityService {

    private final EnvironmentalImpactRepository impactRepository;
    private final UserRepository userRepository;

    // Transparent Emission Factors (grams per passenger-km)
    // Based on IPCC, UK DEFRA, and Central Pollution Control Board (CPCB) urban transit standards:
    // Single-occupant standard petrol car: 192.0 g CO2/km, 0.045 g PM2.5/km
    private static final double CAR_CO2_PER_KM = 192.0; // grams
    private static final double CAR_PM25_PER_KM = 0.045; // grams

    private static final double METRO_CO2_PER_KM = 38.0;
    private static final double METRO_PM25_PER_KM = 0.004;

    private static final double BUS_CO2_PER_KM = 54.0;
    private static final double BUS_PM25_PER_KM = 0.012;

    private static final double CARPOOL_CO2_PER_KM = 64.0;
    private static final double CARPOOL_PM25_PER_KM = 0.015;

    public CommuteComparisonResponse compareCommuteModes(Double distanceKm) {
        double dist = (distanceKm != null && distanceKm > 0) ? distanceKm : 15.0;

        List<TransportOption> options = new ArrayList<>();

        // Metro Option
        double metroCo2Kg = (METRO_CO2_PER_KM * dist) / 1000.0;
        double carCo2Kg = (CAR_CO2_PER_KM * dist) / 1000.0;
        double metroSavedCo2Kg = carCo2Kg - metroCo2Kg;
        double metroAvoidedPm25G = (CAR_PM25_PER_KM - METRO_PM25_PER_KM) * dist;

        options.add(TransportOption.builder()
                .mode("METRO")
                .label("Rapid Underground Metro")
                .co2EmittedKg(round(metroCo2Kg))
                .co2SavedVsCarKg(round(metroSavedCo2Kg))
                .pm25AvoidedG(round(metroAvoidedPm25G))
                .exposureRisk("LOW — Air-conditioned coaches with high-efficiency particulate filtration")
                .recommendation("Top recommended choice during peak winter smog")
                .estMinutes((int) (dist * 2.2 + 8))
                .build());

        // Electric Bus Option
        double busCo2Kg = (BUS_CO2_PER_KM * dist) / 1000.0;
        options.add(TransportOption.builder()
                .mode("ELECTRIC_BUS")
                .label("City Transit Bus")
                .co2EmittedKg(round(busCo2Kg))
                .co2SavedVsCarKg(round(carCo2Kg - busCo2Kg))
                .pm25AvoidedG(round((CAR_PM25_PER_KM - BUS_PM25_PER_KM) * dist))
                .exposureRisk("MODERATE — Wear N95 during roadside boarding and transit")
                .recommendation("Good sustainable mass-transit option")
                .estMinutes((int) (dist * 3.5 + 10))
                .build());

        // Carpool Option
        double poolCo2Kg = (CARPOOL_CO2_PER_KM * dist) / 1000.0;
        options.add(TransportOption.builder()
                .mode("CARPOOL")
                .label("3-Person Shared Ride")
                .co2EmittedKg(round(poolCo2Kg))
                .co2SavedVsCarKg(round(carCo2Kg - poolCo2Kg))
                .pm25AvoidedG(round((CAR_PM25_PER_KM - CARPOOL_PM25_PER_KM) * dist))
                .exposureRisk("LOW — When cabin recirculation mode is active")
                .recommendation("Cuts per-person emissions by 66% compared to solo driving")
                .estMinutes((int) (dist * 2.8 + 5))
                .build());

        // Cycling Option (Safe only when AQI < 100)
        options.add(TransportOption.builder()
                .mode("CYCLING")
                .label("Commuter Bicycle")
                .co2EmittedKg(0.0)
                .co2SavedVsCarKg(round(carCo2Kg))
                .pm25AvoidedG(round(CAR_PM25_PER_KM * dist))
                .exposureRisk("HIGH during smog — only recommended when local AQI is below 100")
                .recommendation("Zero carbon emissions; exercise caution if smog exceeds 100 AQI")
                .estMinutes((int) (dist * 4.0))
                .build());

        // Solo Car baseline
        options.add(TransportOption.builder()
                .mode("SINGLE_CAR")
                .label("Solo Petrol Vehicle (Baseline)")
                .co2EmittedKg(round(carCo2Kg))
                .co2SavedVsCarKg(0.0)
                .pm25AvoidedG(0.0)
                .exposureRisk("MODERATE — Contributes heavily to urban street-level smog")
                .recommendation("Avoid solo driving when cleaner shared alternatives exist")
                .estMinutes((int) (dist * 2.8))
                .build());

        return CommuteComparisonResponse.builder()
                .distanceKm(dist)
                .options(options)
                .methodology("Emissions calculated against standard 192g CO₂/km passenger petrol vehicle baseline based on DEFRA and CPCB urban transport emission standards.")
                .build();
    }

    public ImpactSummaryResponse getImpactSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Double totalCo2 = impactRepository.sumCo2SavedByUserId(user.getId());
        Double totalPm25 = impactRepository.sumPm25AvoidedByUserId(user.getId());
        Double totalDist = impactRepository.sumDistanceByUserId(user.getId());

        List<EnvironmentalImpact> logs = impactRepository.findByUserIdOrderByTripDateDesc(user.getId());
        List<LoggedTripDto> recentTrips = logs.stream()
                .limit(10)
                .map(l -> LoggedTripDto.builder()
                        .id(l.getId())
                        .tripDate(l.getTripDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                        .transportMode(l.getTransportMode())
                        .distanceKm(l.getDistanceKm())
                        .co2SavedKg(l.getCo2SavedKg())
                        .pm25AvoidedG(l.getPm25AvoidedG())
                        .notes(l.getNotes())
                        .build())
                .toList();

        // 1 mature tree absorbs approx 21.77 kg CO2 per year
        double equivalentTrees = totalCo2 / 21.77;
        int cleanAirDays = Math.max(1, logs.size());

        return ImpactSummaryResponse.builder()
                .totalCo2SavedKg(round(totalCo2))
                .totalPm25AvoidedG(round(totalPm25))
                .totalDistanceKm(round(totalDist))
                .cleanAirDaysCount(cleanAirDays)
                .equivalentTreesPlanted(round(equivalentTrees))
                .recentTrips(recentTrips)
                .calculationDisclaimer("Impact calculations reflect verified avoidance vs single-occupancy ICE vehicle baseline.")
                .build();
    }

    @Transactional
    public LoggedTripDto logTrip(String userEmail, LogTripRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        double dist = req.getDistanceKm() != null ? req.getDistanceKm() : 10.0;
        String mode = req.getTransportMode() != null ? req.getTransportMode().toUpperCase() : "METRO";

        double factorPerKm;
        double pmFactorPerKm;

        switch (mode) {
            case "METRO" -> {
                factorPerKm = (CAR_CO2_PER_KM - METRO_CO2_PER_KM) / 1000.0;
                pmFactorPerKm = CAR_PM25_PER_KM - METRO_PM25_PER_KM;
            }
            case "BUS", "ELECTRIC_BUS" -> {
                factorPerKm = (CAR_CO2_PER_KM - BUS_CO2_PER_KM) / 1000.0;
                pmFactorPerKm = CAR_PM25_PER_KM - BUS_PM25_PER_KM;
            }
            case "CARPOOL" -> {
                factorPerKm = (CAR_CO2_PER_KM - CARPOOL_CO2_PER_KM) / 1000.0;
                pmFactorPerKm = CAR_PM25_PER_KM - CARPOOL_PM25_PER_KM;
            }
            case "CYCLING", "WALKING" -> {
                factorPerKm = CAR_CO2_PER_KM / 1000.0;
                pmFactorPerKm = CAR_PM25_PER_KM;
            }
            default -> {
                factorPerKm = 0.05;
                pmFactorPerKm = 0.01;
            }
        }

        double co2Saved = round(dist * factorPerKm);
        double pmAvoided = round(dist * pmFactorPerKm);

        EnvironmentalImpact impact = EnvironmentalImpact.builder()
                .user(user)
                .tripDate(LocalDate.now())
                .transportMode(mode)
                .distanceKm(dist)
                .co2SavedKg(co2Saved)
                .pm25AvoidedG(pmAvoided)
                .notes(req.getNotes() != null ? req.getNotes() : "Daily low-emission commute")
                .build();

        impact = impactRepository.save(impact);

        return LoggedTripDto.builder()
                .id(impact.getId())
                .tripDate(impact.getTripDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .transportMode(impact.getTransportMode())
                .distanceKm(impact.getDistanceKm())
                .co2SavedKg(impact.getCo2SavedKg())
                .pm25AvoidedG(impact.getPm25AvoidedG())
                .notes(impact.getNotes())
                .build();
    }

    private double round(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
