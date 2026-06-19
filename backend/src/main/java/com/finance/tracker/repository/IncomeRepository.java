package com.finance.tracker.repository;

import com.finance.tracker.model.Income;
import com.finance.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserOrderByDateDesc(User user);

    Optional<Income> findByIdAndUser(Long id, User user);
}