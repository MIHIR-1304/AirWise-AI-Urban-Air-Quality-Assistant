package com.airwise.repository;

import com.airwise.entity.DailyRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyRoutineRepository extends JpaRepository<DailyRoutine, Long> {
    Optional<DailyRoutine> findByUserIdAndRoutineDate(Long userId, LocalDate routineDate);
    List<DailyRoutine> findByUserIdOrderByRoutineDateDesc(Long userId);
}
