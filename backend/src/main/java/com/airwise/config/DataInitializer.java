package com.airwise.config;

import com.airwise.entity.*;
import com.airwise.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final DailyRoutineRepository dailyRoutineRepository;
    private final RoutineActivityRepository routineActivityRepository;
    private final EnvironmentalImpactRepository environmentalImpactRepository;
    private final SavedRecommendationRepository savedRecommendationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Remove legacy demo user completely if it exists
        userRepository.findByEmail("demo@airwise.ai").ifPresent(demoUser -> {
            log.info("Removing legacy demo user: demo@airwise.ai");
            savedRecommendationRepository.findByUserIdOrderBySavedAtDesc(demoUser.getId())
                    .forEach(savedRecommendationRepository::delete);
            environmentalImpactRepository.findByUserIdOrderByTripDateDesc(demoUser.getId())
                    .forEach(environmentalImpactRepository::delete);
            dailyRoutineRepository.findByUserIdOrderByRoutineDateDesc(demoUser.getId()).forEach(routine -> {
                routineActivityRepository.deleteAll(routine.getActivities());
                dailyRoutineRepository.delete(routine);
            });
            userPreferenceRepository.findByUserId(demoUser.getId()).ifPresent(userPreferenceRepository::delete);
            userRepository.delete(demoUser);
            log.info("Legacy demo user removed.");
        });

        // 2. Seed or update primary Admin user: mihirmahato1304@gmail.com
        String adminEmail = "mihirmahato1304@gmail.com";
        String adminPassword = "Mihir13@";

        if (!userRepository.existsByEmail(adminEmail)) {
            log.info("Seeding primary admin user: {}", adminEmail);

            User adminUser = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .fullName("Mihir Mahato")
                    .role("ADMIN")
                    .persona("WORKING_PROFESSIONAL")
                    .build();

            adminUser = userRepository.save(adminUser);

            UserPreference pref = UserPreference.builder()
                    .user(adminUser)
                    .defaultCity("Jamshedpur")
                    .defaultLat(22.8046)
                    .defaultLon(86.2029)
                    .hasInfants(true)
                    .hasElderly(true)
                    .hasRespiratoryIssues(true)
                    .preferredCommute("METRO")
                    .notifySmogAlerts(true)
                    .notifyMorningBriefing(true)
                    .notifyPurifierReminders(true)
                    .build();
            userPreferenceRepository.save(pref);

            // Seed initial daily routine for today
            DailyRoutine routine = DailyRoutine.builder()
                    .user(adminUser)
                    .routineDate(LocalDate.now())
                    .summary("Winter Smog Defense Routine: Minimizing morning peak exposure & utilizing metro corridors.")
                    .overallExposureRisk("MODERATE_TO_HIGH")
                    .build();
            routine = dailyRoutineRepository.save(routine);

            RoutineActivity act1 = RoutineActivity.builder()
                    .routine(routine)
                    .timeSlot("06:30 - 07:30")
                    .activityType("Morning Exercise")
                    .suggestedActivity("Indoor Yoga & Light Resistance Band Routine")
                    .reason("Outdoor PM2.5 typically surges before 8:30 AM due to surface temperature inversion.")
                    .exposureLevel("HIGH")
                    .alternativeAction("Switch to an enclosed, air-filtered living room routine instead of outdoor jogging.")
                    .isCompleted(true)
                    .build();

            RoutineActivity act2 = RoutineActivity.builder()
                    .routine(routine)
                    .timeSlot("08:45 - 09:40")
                    .activityType("Work Commute")
                    .suggestedActivity("Underground Metro Commute wearing N95 particulate respirator")
                    .reason("Roadway surface smog is at peak density; underground metro cabins offer HEPA-filtered air circulation.")
                    .exposureLevel("MODERATE")
                    .alternativeAction("Avoid open two-wheeler or autorickshaw commutes during morning gridlock.")
                    .isCompleted(false)
                    .build();

            RoutineActivity act3 = RoutineActivity.builder()
                    .routine(routine)
                    .timeSlot("13:00 - 13:45")
                    .activityType("Afternoon Walk & Lunch")
                    .suggestedActivity("Short 15-minute shaded courtyard walk")
                    .reason("Solar radiation breaks the ground-level inversion layer, causing AQI to reach its lowest daily dip.")
                    .exposureLevel("LOW")
                    .alternativeAction("Carry an N95 mask if wind picks up dust.")
                    .isCompleted(false)
                    .build();

            RoutineActivity act4 = RoutineActivity.builder()
                    .routine(routine)
                    .timeSlot("18:30 - 19:30")
                    .activityType("Evening Commute")
                    .suggestedActivity("Car-pool or Metro with recirculating cabin air mode enabled")
                    .reason("Evening rush-hour traffic causes sharp NO2 and PM10 spike.")
                    .exposureLevel("HIGH")
                    .alternativeAction("Keep car ventilation in recirculation mode (do not pull outside air).")
                    .isCompleted(false)
                    .build();

            routineActivityRepository.saveAll(List.of(act1, act2, act3, act4));

            // Seed sample environmental impact logs
            EnvironmentalImpact impact1 = EnvironmentalImpact.builder()
                    .user(adminUser)
                    .tripDate(LocalDate.now().minusDays(1))
                    .transportMode("METRO")
                    .distanceKm(18.5)
                    .co2SavedKg(3.15)
                    .pm25AvoidedG(0.42)
                    .notes("Subway commute from Connaught Place to Cyber City")
                    .build();

            EnvironmentalImpact impact2 = EnvironmentalImpact.builder()
                    .user(adminUser)
                    .tripDate(LocalDate.now().minusDays(2))
                    .transportMode("CARPOOL")
                    .distanceKm(24.0)
                    .co2SavedKg(2.80)
                    .pm25AvoidedG(0.35)
                    .notes("3-person carpool for client meeting")
                    .build();

            environmentalImpactRepository.saveAll(List.of(impact1, impact2));

            // Seed sample saved recommendations
            SavedRecommendation rec1 = SavedRecommendation.builder()
                    .user(adminUser)
                    .title("HEPA Purifier CADR Optimization")
                    .category("INDOOR")
                    .content("Keep bedroom purifier at Medium fan speed 45 mins before bedtime to establish a 4 ACH clean zone.")
                    .actionItem("Set purifier timer to 10:00 PM nightly")
                    .build();

            savedRecommendationRepository.save(rec1);

            log.info("Primary admin user successfully seeded: {}", adminEmail);
        } else {
            // Ensure admin role and verified password
            userRepository.findByEmail(adminEmail).ifPresent(adminUser -> {
                adminUser.setPassword(passwordEncoder.encode(adminPassword));
                adminUser.setRole("ADMIN");
                adminUser.setFullName("Mihir Mahato");
                userRepository.save(adminUser);
                log.info("Admin user {} credentials and role verified.", adminEmail);
            });
        }
    }
}
