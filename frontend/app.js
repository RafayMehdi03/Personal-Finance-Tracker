const API_URL = "http://localhost:8080/api/expenses";

const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const submitBtn = document.getElementById("submit-btn");

// 📥 1. FETCH AND PROCESS ALL TRANSACTIONS
async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);
        const expenses = await response.json();
        
        // --- SECTION A: DASHBOARD CALC CARDS (Runs only if elements exist) ---
        let totalSpending = 0;
        expenses.forEach(exp => totalSpending += exp.amount);
        const initialBudget = 150000.00;
        let budgetRemaining = initialBudget - totalSpending;

        const totalExpensesCard = document.querySelector(".metric-card:nth-child(1) .metric-value");
        const budgetRemainingCard = document.querySelector(".metric-card:nth-child(3) .metric-value");
        
        if (totalExpensesCard) {
            totalExpensesCard.textContent = `Rs. ${totalSpending.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
        }
        if (budgetRemainingCard) {
            budgetRemainingCard.textContent = `Rs. ${budgetRemaining.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
        }

        // --- SECTION B: DATA TABLE BUILDER (Runs seamlessly on transactions page) ---
        if (expenseList) {
            if (expenses.length > 0) {
                expenseList.innerHTML = ""; // Clear loader message
                expenses.forEach(expense => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td style="font-weight: 600; color: #ffffff;">${expense.description}</td>
                        <td><span class="category-badge">${expense.category}</span></td>
                        <td>${expense.date}</td>
                        <td class="amount-cell">-Rs. ${expense.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                        <td style="text-align: right;"><button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button></td>
                    `;
                    expenseList.appendChild(tr);
                });
            } else {
                expenseList.innerHTML = `<tr><td colspan="5" class="empty-state">No recorded transactions found. Add some on the dashboard!</td></tr>`;
            }
        }
    } catch (error) {
        console.error("Error executing fetch routine:", error);
        if (expenseList) {
            expenseList.innerHTML = `<tr><td colspan="5" class="empty-state" style="color:#ef4444;">Error connecting to Spring Boot backend server.</td></tr>`;
        }
    }
}

// 📤 2. SAVE FORM HANDLER (Only active on dashboard layout)
if (submitBtn) {
    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const descriptionValue = document.getElementById("description").value.trim();
        const amountValue = document.getElementById("amount").value;
        const dateValue = document.getElementById("date").value;
        const categoryValue = document.getElementById("category").value;

        if (!descriptionValue || !amountValue || !dateValue || !categoryValue) {
            alert("Please fill out all fields before adding an expense!");
            return;
        }

        const newExpense = { 
            description: descriptionValue, 
            amount: parseFloat(amountValue), 
            date: dateValue, 
            category: categoryValue 
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense)
            });

            if (response.ok) {
                expenseForm.reset();
                fetchExpenses();
            }
        } catch (error) {
            console.error("Error dispatching record:", error);
        }
    });
}

// 🗑️ 3. DELETE TRANSACTION HANDLER (Global context mapping)
async function deleteExpense(id) {
    if (!confirm("Are you sure you want to permanently delete this transaction?")) {
        return; 
    }
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
            fetchExpenses(); // Re-render live array metrics
        }
    } catch (error) {
        console.error("Error running delete pipeline:", error);
    }
}
window.deleteExpense = deleteExpense;

// 📅 4. INPUT DATE BOUNDARY RULES
function restrictFutureDates() {
    const dateField = document.getElementById("date");
    if (dateField) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateField.setAttribute("max", `${yyyy}-${mm}-${dd}`);
    }
}

// Fire system initialization scripts
fetchExpenses();
restrictFutureDates();