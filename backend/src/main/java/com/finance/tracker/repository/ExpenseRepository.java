package com.finance.tracker.repository;

import com.finance.tracker.model.Expense;
import com.finance.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByDateDesc(User user);

    Optional<Expense> findByIdAndUser(Long id, User user);
}