package com.finance.tracker.repository;

import com.finance.tracker.model.Budget;
import com.finance.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserOrderByMonthDescCategoryAsc(User user);

    Optional<Budget> findByIdAndUser(Long id, User user);
}