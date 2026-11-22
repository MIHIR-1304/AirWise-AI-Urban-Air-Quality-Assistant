package com.airwise.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "environmental_impact")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvironmentalImpact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "trip_date", nullable = false)
    private LocalDate tripDate;

    @Column(name = "transport_mode", nullable = false, length = 50)
    private String transportMode; // METRO, BUS, BICYCLE, WALKING, CARPOOL

    @Column(name = "distance_km", nullable = false)
    private Double distanceKm;

    @Column(name = "co2_saved_kg", nullable = false)
    private Double co2SavedKg;

    @Column(name = "pm25_avoided_g", nullable = false)
    private Double pm25AvoidedG;

    @Column(length = 255)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
