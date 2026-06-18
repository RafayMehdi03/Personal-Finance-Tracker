package com.finance.tracker.controller;

import com.finance.tracker.model.Expense;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Logged-in user not found"
                ));
    }

    @GetMapping
    public List<Expense> getAllExpenses(Authentication authentication) {
        User user = getLoggedInUser(authentication);
        return expenseRepository.findByUserOrderByDateDesc(user);
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense, Authentication authentication) {
        User user = getLoggedInUser(authentication);

        expense.setId(null);
        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id, Authentication authentication) {
        User user = getLoggedInUser(authentication);

        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Expense not found for this user"
                ));

        expenseRepository.delete(expense);
    }
}