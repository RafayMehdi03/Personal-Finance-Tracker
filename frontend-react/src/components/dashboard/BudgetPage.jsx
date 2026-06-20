import { Trash2, WalletCards } from "lucide-react";
import { useState } from "react";

const getCurrentMonth = () => {
  return new Date().toISOString().slice(0, 7);
};

const BudgetPage = ({
  budgets,
  expenses,
  loading,
  formatPKR,
  onCreateBudget,
  onDeleteBudget,
}) => {
  const [formData, setFormData] = useState({
    category: "",
    limitAmount: "",
    month: getCurrentMonth(),
  });

  const [saving, setSaving] = useState(false);

  const calculateSpent = (budget) => {
    return expenses
      .filter((expense) => {
        const expenseMonth = expense.date?.slice(0, 7);

        return (
          expense.category === budget.category &&
          expenseMonth === budget.month
        );
      })
      .reduce((total, expense) => total + Number(expense.amount || 0), 0);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.category || !formData.limitAmount || !formData.month) {
      return;
    }

    if (Number(formData.limitAmount) <= 0) {
      return;
    }

    try {
      setSaving(true);

      await onCreateBudget({
        category: formData.category,
        limitAmount: Number(formData.limitAmount),
        month: formData.month,
      });

      setFormData({
        category: "",
        limitAmount: "",
        month: getCurrentMonth(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="budget-page">
      <div className="transactions-header">
        <div>
          <p>Optional Planning</p>
          <h2>Budgets</h2>
        </div>

        <div className="transactions-count">
          {budgets.length} {budgets.length === 1 ? "budget" : "budgets"}
        </div>
      </div>

      <div className="budget-helper-card">
        <div className="budget-helper-icon">
          <WalletCards size={26} />
        </div>

        <div>
          <h3>Budgets are optional</h3>
          <p>
            Use this page only if you want to plan category-wise spending.
            If you do not add budgets, your dashboard and reports will still work normally.
          </p>
        </div>
      </div>

      <section className="dashboard-content-grid budget-layout">
        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Create Budget</h3>
              <p>Set a monthly limit for any spending category.</p>
            </div>
          </div>

          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="dashboard-field">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="dashboard-field">
              <label>Monthly Limit</label>
              <input
                type="number"
                name="limitAmount"
                placeholder="15000"
                value={formData.limitAmount}
                onChange={handleChange}
              />
            </div>

            <div className="dashboard-field">
              <label>Month</label>
              <input
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="add-expense-btn"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Budget"}
            </button>
          </form>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Your Budgets</h3>
              <p>Track how much you have spent against your optional limits.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="budget-empty-state">
              <h3>No budgets set</h3>
              <p>
                That is completely fine. Many students and casual users do not
                need budgets. You can still use income, expenses, and reports normally.
              </p>
            </div>
          ) : (
            <div className="budget-list">
              {budgets.map((budget) => {
                const spent = calculateSpent(budget);
                const limit = Number(budget.limitAmount || 0);
                const percentage =
                  limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
                const isOverBudget = spent > limit;

                return (
                  <div className="budget-item" key={budget.id}>
                    <div className="budget-item-top">
                      <div>
                        <h4>{budget.category}</h4>
                        <span>{budget.month}</span>
                      </div>

                      <button
                        type="button"
                        className="delete-expense-btn"
                        onClick={() => onDeleteBudget(budget)}
                        aria-label="Delete budget"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="budget-amount-row">
                      <span>
                        Spent: <strong>{formatPKR(spent)}</strong>
                      </span>

                      <span>
                        Limit: <strong>{formatPKR(limit)}</strong>
                      </span>
                    </div>

                    <div className="budget-progress">
                      <div
                        className={isOverBudget ? "over-budget" : ""}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="budget-status">
                      {isOverBudget ? (
                        <span className="budget-danger">
                          Over budget by {formatPKR(spent - limit)}
                        </span>
                      ) : (
                        <span className="budget-safe">
                          Remaining {formatPKR(limit - spent)}
                        </span>
                      )}

                      <strong>{percentage}% used</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </section>
  );
};

export default BudgetPage;