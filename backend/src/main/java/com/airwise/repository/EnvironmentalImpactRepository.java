package com.airwise.repository;

import com.airwise.entity.EnvironmentalImpact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvironmentalImpactRepository extends JpaRepository<EnvironmentalImpact, Long> {
    List<EnvironmentalImpact> findByUserIdOrderByTripDateDesc(Long userId);

    @Query("SELECT COALESCE(SUM(e.co2SavedKg), 0.0) FROM EnvironmentalImpact e WHERE e.user.id = :userId")
    Double sumCo2SavedByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.pm25AvoidedG), 0.0) FROM EnvironmentalImpact e WHERE e.user.id = :userId")
    Double sumPm25AvoidedByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(e.distanceKm), 0.0) FROM EnvironmentalImpact e WHERE e.user.id = :userId")
    Double sumDistanceByUserId(@Param("userId") Long userId);
}
