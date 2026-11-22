package com.airwise.service;

import com.airwise.dto.RoutineDtos.*;
import com.airwise.entity.*;
import com.airwise.exception.ResourceNotFoundException;
import com.airwise.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DailyRoutineService {

    private final DailyRoutineRepository dailyRoutineRepository;
    private final RoutineActivityRepository routineActivityRepository;
    private final UserRepository userRepository;
    private final SavedRecommendationRepository savedRecommendationRepository;

    public RoutineDto getTodayRoutine(String userEmail, Integer currentAqi, String persona) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        LocalDate today = LocalDate.now();
        DailyRoutine routine = dailyRoutineRepository.findByUserIdAndRoutineDate(user.getId(), today)
                .orElseGet(() -> generateAndSaveRoutine(user, today, currentAqi != null ? currentAqi : 155, persona != null ? persona : user.getPersona()));

        return mapToDto(routine);
    }

    @Transactional
    public RoutineDto generateNewRoutine(String userEmail, GenerateRoutineRequest req) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        LocalDate today = LocalDate.now();
        DailyRoutine existing = dailyRoutineRepository.findByUserIdAndRoutineDate(user.getId(), today).orElse(null);
        if (existing != null) {
            dailyRoutineRepository.delete(existing);
        }

        DailyRoutine routine = generateAndSaveRoutine(user, today, req.getAqi() != null ? req.getAqi() : 155, req.getPersona() != null ? req.getPersona() : user.getPersona());
        return mapToDto(routine);
    }

    @Transactional
    public RoutineActivityDto updateActivityStatus(Long activityId, UpdateActivityStatusRequest req) {
        RoutineActivity activity = routineActivityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found: " + activityId));

        activity.setIsCompleted(req.getIsCompleted());
        if (Boolean.TRUE.equals(req.getIsCompleted())) {
            activity.setCompletedAt(LocalDateTime.now());
        } else {
            activity.setCompletedAt(null);
        }

        activity = routineActivityRepository.save(activity);
        return mapActivityToDto(activity);
    }

    @Transactional
    public SavedRecommendation saveRecommendation(String userEmail, String title, String category, String content, String actionItem) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        SavedRecommendation rec = SavedRecommendation.builder()
                .user(user)
                .title(title)
                .category(category != null ? category : "ROUTINE")
                .content(content)
                .actionItem(actionItem)
                .build();

        return savedRecommendationRepository.save(rec);
    }

    public List<SavedRecommendation> getSavedRecommendations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return savedRecommendationRepository.findByUserIdOrderBySavedAtDesc(user.getId());
    }

    @Transactional
    public void deleteSavedRecommendation(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        SavedRecommendation rec = savedRecommendationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found: " + id));
        if (rec.getUser().getId().equals(user.getId())) {
            savedRecommendationRepository.delete(rec);
        }
    }

    private DailyRoutine generateAndSaveRoutine(User user, LocalDate date, int aqi, String persona) {
        boolean isSevere = aqi > 200;
        boolean isElevated = aqi > 100;

        DailyRoutine routine = DailyRoutine.builder()
                .user(user)
                .routineDate(date)
                .summary(isSevere
                        ? "High Smog Alert Protocol: Minimize ground exposure, use HEPA spaces, and commute in closed transit."
                        : isElevated
                        ? "Moderate Smog Protocol: Shift intense workouts to midday; wear N95 in transit."
                        : "Clear Air Routine: Safe for full outdoor activities and cross-ventilation.")
                .overallExposureRisk(isSevere ? "SEVERE" : isElevated ? "MODERATE_HIGH" : "LOW")
                .build();

        routine = dailyRoutineRepository.save(routine);

        List<RoutineActivity> activities = new ArrayList<>();

        // Morning Exercise
        activities.add(RoutineActivity.builder()
                .routine(routine)
                .timeSlot("06:30 - 07:30")
                .activityType("Morning Exercise")
                .suggestedActivity(isSevere || isElevated ? "Indoor Core & Resistance Workout in Purified Room" : "Outdoor 5K Jog or Cycling")
                .reason(isElevated ? "Morning atmospheric inversion traps vehicular particulates near the ground until sunlight breaks the thermal layer." : "Fresh ambient air with optimal oxygenation.")
                .exposureLevel(isSevere ? "SEVERE" : isElevated ? "HIGH" : "LOW")
                .alternativeAction(isElevated ? "Substitute morning outdoor run with indoor stationary bike or bodyweight session." : "Keep gentle pace.")
                .isCompleted(false)
                .build());

        // Morning Commute
        activities.add(RoutineActivity.builder()
                .routine(routine)
                .timeSlot("08:30 - 09:30")
                .activityType("Office / Campus Commute")
                .suggestedActivity(isElevated ? "Underground Metro or Carpool with cabin air recirculation ON" : "Bicycle or Walk")
                .reason(isElevated ? "Peak traffic hours produce heavy NO₂ and PM10 plumes along roadways." : "Clean air allows sustainable active transport.")
                .exposureLevel(isSevere ? "SEVERE" : isElevated ? "MODERATE" : "LOW")
                .alternativeAction("Wear a certified N95 respirator if traveling via open auto or bus.")
                .isCompleted(false)
                .build());

        // Midday / Lunch Walk
        activities.add(RoutineActivity.builder()
                .routine(routine)
                .timeSlot("13:00 - 13:45")
                .activityType("Midday Break & Errand")
                .suggestedActivity(isSevere ? "Indoor Cafeteria Walk / Quick Errand only" : "Outdoor 20-min Sunlight Walk")
                .reason("Midday thermal mixing lifts particulates to their highest daily altitude, providing the cleanest ambient air of the day.")
                .exposureLevel(isSevere ? "MODERATE" : "LOW")
                .alternativeAction("If stepping out, choose tree-lined secondary streets rather than major road junctions.")
                .isCompleted(false)
                .build());

        // Grocery / Shopping
        activities.add(RoutineActivity.builder()
                .routine(routine)
                .timeSlot("17:30 - 18:15")
                .activityType("Grocery & Errands")
                .suggestedActivity("Consolidated shopping trip at an enclosed supermarket")
                .reason("Evening traffic begins to stack emissions as ambient temperature starts falling.")
                .exposureLevel(isSevere ? "HIGH" : isElevated ? "MODERATE" : "LOW")
                .alternativeAction("Use quick delivery or combine multiple errands into one trip.")
                .isCompleted(false)
                .build());

        // Evening Workout / Relaxation
        activities.add(RoutineActivity.builder()
                .routine(routine)
                .timeSlot("19:30 - 20:30")
                .activityType("Evening Workout")
                .suggestedActivity(isElevated ? "Indoor Yoga, Mobility, or Gym Workout" : "Evening Park Walk")
                .reason(isElevated ? "Cold winter air locks PM2.5 at breathing level during nightfall." : "Cool, clear evening air.")
                .exposureLevel(isSevere ? "SEVERE" : isElevated ? "HIGH" : "LOW")
                .alternativeAction("Ensure air purifier has been running in the room for at least 30 minutes before exercising.")
                .isCompleted(false)
                .build());

        routineActivityRepository.saveAll(activities);
        routine.setActivities(activities);
        return routine;
    }

    private RoutineDto mapToDto(DailyRoutine routine) {
        List<RoutineActivityDto> activityDtos = routine.getActivities().stream()
                .map(this::mapActivityToDto)
                .toList();

        return RoutineDto.builder()
                .id(routine.getId())
                .routineDate(routine.getRoutineDate())
                .summary(routine.getSummary())
                .overallExposureRisk(routine.getOverallExposureRisk())
                .activities(activityDtos)
                .build();
    }

    private RoutineActivityDto mapActivityToDto(RoutineActivity act) {
        return RoutineActivityDto.builder()
                .id(act.getId())
                .timeSlot(act.getTimeSlot())
                .activityType(act.getActivityType())
                .suggestedActivity(act.getSuggestedActivity())
                .reason(act.getReason())
                .exposureLevel(act.getExposureLevel())
                .alternativeAction(act.getAlternativeAction())
                .isCompleted(act.getIsCompleted())
                .build();
    }
}
