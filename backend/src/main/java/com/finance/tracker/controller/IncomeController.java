package com.finance.tracker.controller;

import com.finance.tracker.model.Income;
import com.finance.tracker.model.User;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "http://localhost:5173")
public class IncomeController {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeController(IncomeRepository incomeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
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
    public List<Income> getAllIncomes(Authentication authentication) {
        User user = getLoggedInUser(authentication);
        return incomeRepository.findByUserOrderByDateDesc(user);
    }

    @PostMapping
    public Income createIncome(@RequestBody Income income, Authentication authentication) {
        User user = getLoggedInUser(authentication);

        income.setId(null);
        income.setUser(user);

        return incomeRepository.save(income);
    }

    @PutMapping("/{id}")
    public Income updateIncome(
            @PathVariable Long id,
            @RequestBody Income updatedIncome,
            Authentication authentication
    ) {
        User user = getLoggedInUser(authentication);

        Income existingIncome = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Income not found for this user"
                ));

        existingIncome.setSource(updatedIncome.getSource());
        existingIncome.setAmount(updatedIncome.getAmount());
        existingIncome.setDate(updatedIncome.getDate());
        existingIncome.setCategory(updatedIncome.getCategory());
        existingIncome.setNote(updatedIncome.getNote());

        return incomeRepository.save(existingIncome);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id, Authentication authentication) {
        User user = getLoggedInUser(authentication);

        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Income not found for this user"
                ));

        incomeRepository.delete(income);
    }
}