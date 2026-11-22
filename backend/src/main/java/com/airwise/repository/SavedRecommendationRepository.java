package com.airwise.repository;

import com.airwise.entity.SavedRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedRecommendationRepository extends JpaRepository<SavedRecommendation, Long> {
    List<SavedRecommendation> findByUserIdOrderBySavedAtDesc(Long userId);
}
