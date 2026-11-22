package com.airwise.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(name = "default_city")
    @Builder.Default
    private String defaultCity = "Jamshedpur";

    @Column(name = "default_lat")
    @Builder.Default
    private Double defaultLat = 22.8046;

    @Column(name = "default_lon")
    @Builder.Default
    private Double defaultLon = 86.2029;

    @Column(name = "has_infants")
    @Builder.Default
    private Boolean hasInfants = false;

    @Column(name = "has_elderly")
    @Builder.Default
    private Boolean hasElderly = false;

    @Column(name = "has_respiratory_issues")
    @Builder.Default
    private Boolean hasRespiratoryIssues = false;

    @Column(name = "preferred_commute")
    @Builder.Default
    private String preferredCommute = "METRO";

    @Column(name = "notify_smog_alerts")
    @Builder.Default
    private Boolean notifySmogAlerts = true;

    @Column(name = "notify_morning_briefing")
    @Builder.Default
    private Boolean notifyMorningBriefing = true;

    @Column(name = "notify_purifier_reminders")
    @Builder.Default
    private Boolean notifyPurifierReminders = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
