package com.finance.tracker.controller;

import com.finance.tracker.model.Budget;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetController(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
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
    public List<Budget> getAllBudgets(Authentication authentication) {
        User user = getLoggedInUser(authentication);
        return budgetRepository.findByUserOrderByMonthDescCategoryAsc(user);
    }

    @PostMapping
    public Budget createBudget(@RequestBody Budget budget, Authentication authentication) {
        User user = getLoggedInUser(authentication);

        budget.setId(null);
        budget.setUser(user);

        return budgetRepository.save(budget);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(
            @PathVariable Long id,
            @RequestBody Budget updatedBudget,
            Authentication authentication
    ) {
        User user = getLoggedInUser(authentication);

        Budget existingBudget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Budget not found for this user"
                ));

        existingBudget.setCategory(updatedBudget.getCategory());
        existingBudget.setLimitAmount(updatedBudget.getLimitAmount());
        existingBudget.setMonth(updatedBudget.getMonth());

        return budgetRepository.save(existingBudget);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id, Authentication authentication) {
        User user = getLoggedInUser(authentication);

        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Budget not found for this user"
                ));

        budgetRepository.delete(budget);
    }
}