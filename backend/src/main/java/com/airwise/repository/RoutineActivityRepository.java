package com.airwise.repository;

import com.airwise.entity.RoutineActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoutineActivityRepository extends JpaRepository<RoutineActivity, Long> {
    List<RoutineActivity> findByRoutineIdOrderByIdAsc(Long routineId);
}
