package com.airwise.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "routine_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    @JsonIgnore
    private DailyRoutine routine;

    @Column(name = "time_slot", nullable = false, length = 50)
    private String timeSlot;

    @Column(name = "activity_type", nullable = false, length = 100)
    private String activityType;

    @Column(name = "suggested_activity", nullable = false)
    private String suggestedActivity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "exposure_level", nullable = false, length = 50)
    private String exposureLevel; // LOW, MODERATE, HIGH, SEVERE

    @Column(name = "alternative_action", columnDefinition = "TEXT")
    private String alternativeAction;

    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
