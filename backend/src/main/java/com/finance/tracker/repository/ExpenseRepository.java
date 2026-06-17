package com.finance.tracker.repository;

import com.finance.tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Inherits all CRUD functionality automatically from Spring Data JPA
}