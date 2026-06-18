import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Landmark,
  Plus,
  Trash2,
} from "lucide-react";
import BrandLogo from "../components/brandlogo";
import { createExpense, deleteExpense, getExpenses } from "../api/expenseApi";
import "./Dashboard.css";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const Dashboard = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("hisaabkitaab_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: getTodayDate(),
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const formatPKR = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, expense) => {
      return total + Number(expense.amount || 0);
    }, 0);
  }, [expenses]);

  const monthlyExpenses = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return expenses.reduce((total, expense) => {
      const expenseDate = new Date(expense.date);

      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        return total + Number(expense.amount || 0);
      }

      return total;
    }, 0);
  }, [expenses]);

  const latestExpense = expenses.length > 0 ? expenses[0] : null;

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Fetch expenses error:", error);
      setMessage("Unable to load expenses. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hisaabkitaab_user");
    localStorage.removeItem("hisaabkitaab_token");
    navigate("/login");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateExpense = async (event) => {
    event.preventDefault();

    if (
      !formData.description.trim() ||
      !formData.amount ||
      !formData.date ||
      !formData.category
    ) {
      setMessage("Please fill all expense fields.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setMessage("Amount must be greater than zero.");
      return;
    }

    if (formData.date > getTodayDate()) {
      setMessage("Future dates are not allowed.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const newExpense = await createExpense({
        description: formData.description.trim(),
        amount: Number(formData.amount),
        date: formData.date,
        category: formData.category,
      });

      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);

      setFormData({
        description: "",
        amount: "",
        date: getTodayDate(),
        category: "",
      });
    } catch (error) {
      console.error("Create expense error:", error);
      setMessage("Unable to add expense.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirmation = (expense) => {
  setExpenseToDelete(expense);
};

const closeDeleteConfirmation = () => {
  setExpenseToDelete(null);
};

const confirmDeleteExpense = async () => {
  if (!expenseToDelete) return;

  try {
    setMessage("");

    await deleteExpense(expenseToDelete.id);

    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== expenseToDelete.id)
    );

    setExpenseToDelete(null);
  } catch (error) {
    console.error("Delete expense error:", error);
    setMessage("Unable to delete expense.");
  }
};

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <BrandLogo size="small" />

          <div>
            <h1>HisaabKitaab</h1>
            <p>Track. Save. Grow.</p>
          </div>
        </div>

        <nav className="dashboard-nav">
          <button className="active">Overview</button>
          <button>Transactions</button>
          <button>Budgets</button>
          <button>Reports</button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p>Welcome back</p>
            <h2>{user?.fullName || "User"}</h2>
          </div>

          <div className="secure-badge">
            <ShieldCheck size={18} />
            JWT Secured
          </div>
        </header>

        {message && <div className="dashboard-message">{message}</div>}

        <section className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <Wallet size={24} />
            </div>
            <p>Total Expenses</p>
            <h3>{formatPKR(totalExpenses)}</h3>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <TrendingUp size={24} />
            </div>
            <p>This Month</p>
            <h3>{formatPKR(monthlyExpenses)}</h3>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <Landmark size={24} />
            </div>
            <p>Total Records</p>
            <h3>{expenses.length}</h3>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <section className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Add Expense</h3>
                <p>Record a new transaction in your personal hisaab.</p>
              </div>
            </div>

            <form className="expense-form" onSubmit={handleCreateExpense}>
              <div className="form-row">
                <div className="dashboard-field">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Lunch, fuel, groceries..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="dashboard-field">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="2500"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="dashboard-field">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    max={getTodayDate()}
                  />
                </div>

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
              </div>

              <button className="add-expense-btn" type="submit" disabled={saving}>
                <Plus size={18} />
                {saving ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </section>

          <section className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Expenses</h3>
                <p>Your latest recorded transactions.</p>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="empty-state">
                No expenses yet. Add your first record.
              </div>
            ) : (
              <div className="expense-table-wrapper">
                <table className="expense-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.description}</td>
                        <td>
                          <span className="category-pill">
                            {expense.category}
                          </span>
                        </td>
                        <td>{expense.date}</td>
                        <td>{formatPKR(expense.amount)}</td>
                        <td>
                          <button
                            type="button"
                            className="delete-expense-btn"
                            onClick={() => openDeleteConfirmation(expense)}
                            aria-label="Delete expense"
                        >
                         <Trash2 size={16} />
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {latestExpense && (
              <div className="latest-box">
                <span>Latest entry</span>
                <strong>
                  {latestExpense.description} —{" "}
                  {formatPKR(latestExpense.amount)}
                </strong>
              </div>
            )}
          </section>
        </section>
      </section>
      {expenseToDelete && (
  <div className="delete-modal-backdrop">
    <div className="delete-modal">
      <div className="delete-modal-icon">
        <Trash2 size={22} />
      </div>

      <h3>Delete expense?</h3>

      <p>
        Are you sure you want to delete{" "}
        <strong>{expenseToDelete.description}</strong> worth{" "}
        <strong>{formatPKR(expenseToDelete.amount)}</strong>? This action cannot
        be undone.
      </p>

      <div className="delete-modal-actions">
        <button
          type="button"
          className="cancel-delete-btn"
          onClick={closeDeleteConfirmation}
        >
          Cancel
        </button>

        <button
          type="button"
          className="confirm-delete-btn"
          onClick={confirmDeleteExpense}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
};

export default Dashboard;