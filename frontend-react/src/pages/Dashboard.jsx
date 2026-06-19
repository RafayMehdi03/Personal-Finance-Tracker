import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, TrendingUp, Wallet } from "lucide-react";

import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../api/expenseApi";

import {
  createIncome,
  deleteIncome,
  getIncomes,
  updateIncome,
} from "../api/incomeApi";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import MetricCard from "../components/dashboard/MetricCard";
import ExpenseForm from "../components/dashboard/ExpenseForm";
import ExpenseTable from "../components/dashboard/ExpenseTable";
import TransactionsTable from "../components/dashboard/TransactionsTable";
import IncomeForm from "../components/dashboard/IncomeForm";
import RecentIncomeTable from "../components/dashboard/RecentIncomeTable";
import IncomeManagementTable from "../components/dashboard/IncomeManagementTable";
import DeleteConfirmModal from "../components/dashboard/DeleteConfirmModal";
import EditExpenseModal from "../components/dashboard/EditExpenseModal";
import EditIncomeModal from "../components/dashboard/EditIncomeModal";

import "./Dashboard.css";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const Dashboard = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("hisaabkitaab_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [activeSection, setActiveSection] = useState("overview");
  const [overviewMode, setOverviewMode] = useState("expenses");

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const [expenseSortBy, setExpenseSortBy] = useState("date");
  const [expenseSortOrder, setExpenseSortOrder] = useState("desc");

  const [incomeSortBy, setIncomeSortBy] = useState("date");
  const [incomeSortOrder, setIncomeSortOrder] = useState("desc");

  const [expenseFormData, setExpenseFormData] = useState({
    description: "",
    amount: "",
    date: getTodayDate(),
    category: "",
  });

  const [incomeFormData, setIncomeFormData] = useState({
    source: "",
    amount: "",
    date: getTodayDate(),
    category: "",
    note: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingExpense, setSavingExpense] = useState(false);
  const [savingIncome, setSavingIncome] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [incomeToEdit, setIncomeToEdit] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const formatPKR = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const sortRecords = (records, sortBy, sortOrder) => {
    const sorted = [...records];

    sorted.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortBy === "amount") {
        valueA = Number(a.amount || 0);
        valueB = Number(b.amount || 0);
      } else if (sortBy === "category") {
        valueA = (a.category || "").toLowerCase();
        valueB = (b.category || "").toLowerCase();
      } else {
        valueA = new Date(a.date);
        valueB = new Date(b.date);
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;

      return 0;
    });

    return sorted;
  };

  const sortedExpenses = useMemo(() => {
    return sortRecords(expenses, expenseSortBy, expenseSortOrder);
  }, [expenses, expenseSortBy, expenseSortOrder]);

  const sortedIncomes = useMemo(() => {
    return sortRecords(incomes, incomeSortBy, incomeSortOrder);
  }, [incomes, incomeSortBy, incomeSortOrder]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return incomes.reduce((total, income) => total + Number(income.amount || 0), 0);
  }, [incomes]);

  const currentBalance = totalIncome - totalExpenses;

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [expenseData, incomeData] = await Promise.all([
        getExpenses(),
        getIncomes(),
      ]);

      setExpenses(expenseData);
      setIncomes(incomeData);
    } catch (error) {
      console.error("Fetch dashboard data error:", error);
      setMessage("Unable to load dashboard data. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hisaabkitaab_user");
    localStorage.removeItem("hisaabkitaab_token");
    navigate("/login");
  };

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;

    setExpenseFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncomeChange = (event) => {
    const { name, value } = event.target;

    setIncomeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateExpenseData = (data) => {
    if (!data.description.trim() || !data.amount || !data.date || !data.category) {
      setMessage("Please fill all expense fields.");
      return false;
    }

    if (Number(data.amount) <= 0) {
      setMessage("Amount must be greater than zero.");
      return false;
    }

    if (data.date > getTodayDate()) {
      setMessage("Future dates are not allowed.");
      return false;
    }

    return true;
  };

  const validateIncomeData = (data) => {
    if (!data.source.trim() || !data.amount || !data.date || !data.category) {
      setMessage("Please fill all income fields.");
      return false;
    }

    if (Number(data.amount) <= 0) {
      setMessage("Amount must be greater than zero.");
      return false;
    }

    if (data.date > getTodayDate()) {
      setMessage("Future dates are not allowed.");
      return false;
    }

    return true;
  };

  const handleCreateExpense = async (event) => {
    event.preventDefault();

    if (!validateExpenseData(expenseFormData)) return;

    try {
      setSavingExpense(true);
      setMessage("");

      const newExpense = await createExpense({
        description: expenseFormData.description.trim(),
        amount: Number(expenseFormData.amount),
        date: expenseFormData.date,
        category: expenseFormData.category,
      });

      setExpenses((prev) => [newExpense, ...prev]);

      setExpenseFormData({
        description: "",
        amount: "",
        date: getTodayDate(),
        category: "",
      });
    } catch (error) {
      console.error("Create expense error:", error);
      setMessage("Unable to add expense.");
    } finally {
      setSavingExpense(false);
    }
  };

  const handleCreateIncome = async (event) => {
    event.preventDefault();

    if (!validateIncomeData(incomeFormData)) return;

    try {
      setSavingIncome(true);
      setMessage("");

      const newIncome = await createIncome({
        source: incomeFormData.source.trim(),
        amount: Number(incomeFormData.amount),
        date: incomeFormData.date,
        category: incomeFormData.category,
        note: incomeFormData.note.trim(),
      });

      setIncomes((prev) => [newIncome, ...prev]);

      setIncomeFormData({
        source: "",
        amount: "",
        date: getTodayDate(),
        category: "",
        note: "",
      });
    } catch (error) {
      console.error("Create income error:", error);
      setMessage("Unable to add income.");
    } finally {
      setSavingIncome(false);
    }
  };

  const openExpenseEditModal = (expense) => {
    setExpenseToEdit(expense);
  };

  const openIncomeEditModal = (income) => {
    setIncomeToEdit(income);
  };

  const handleUpdateExpense = async (updatedData) => {
    if (!validateExpenseData(updatedData)) return;

    try {
      setEditing(true);
      setMessage("");

      const updatedExpense = await updateExpense(expenseToEdit.id, updatedData);

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );

      setExpenseToEdit(null);
    } catch (error) {
      console.error("Update expense error:", error);
      setMessage("Unable to update expense.");
    } finally {
      setEditing(false);
    }
  };

  const handleUpdateIncome = async (updatedData) => {
    if (!validateIncomeData(updatedData)) return;

    try {
      setEditing(true);
      setMessage("");

      const updatedIncome = await updateIncome(incomeToEdit.id, updatedData);

      setIncomes((prev) =>
        prev.map((income) =>
          income.id === updatedIncome.id ? updatedIncome : income
        )
      );

      setIncomeToEdit(null);
    } catch (error) {
      console.error("Update income error:", error);
      setMessage("Unable to update income.");
    } finally {
      setEditing(false);
    }
  };

  const openDeleteModal = (record, type) => {
    setDeleteTarget({ record, type });
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setMessage("");

      if (deleteTarget.type === "expense") {
        await deleteExpense(deleteTarget.record.id);

        setExpenses((prev) =>
          prev.filter((expense) => expense.id !== deleteTarget.record.id)
        );
      } else {
        await deleteIncome(deleteTarget.record.id);

        setIncomes((prev) =>
          prev.filter((income) => income.id !== deleteTarget.record.id)
        );
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Unable to delete record.");
    }
  };

  return (
    <main className="dashboard-page">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />

      <section className="dashboard-main">
        {activeSection === "overview" && <DashboardHeader user={user} />}

        {activeSection === "transactions" && (
          <div className="transactions-header">
            <div>
              <p>Expense Management</p>
              <h2>Transactions</h2>
            </div>

            <div className="transactions-count">
              {expenses.length} {expenses.length === 1 ? "record" : "records"}
            </div>
          </div>
        )}

        {activeSection === "income" && (
          <div className="transactions-header">
            <div>
              <p>Income Management</p>
              <h2>Income Records</h2>
            </div>

            <div className="transactions-count income-count">
              {incomes.length} {incomes.length === 1 ? "record" : "records"}
            </div>
          </div>
        )}

        {message && <div className="dashboard-message">{message}</div>}

        {activeSection === "overview" && (
          <>
            <section className="dashboard-grid">
              <MetricCard
                icon={<TrendingUp size={24} />}
                label="Total Income"
                value={formatPKR(totalIncome)}
              />

              <MetricCard
                icon={<Wallet size={24} />}
                label="Total Expenses"
                value={formatPKR(totalExpenses)}
              />

              <MetricCard
                icon={<Landmark size={24} />}
                label="Current Balance"
                value={formatPKR(currentBalance)}
              />
            </section>

            <div className="overview-switch-card">
              <div>
                <h3>Manage Records</h3>
                <p>Switch between adding expenses and recording income.</p>
              </div>

              <div className="overview-toggle">
                <button
                  className={overviewMode === "expenses" ? "active" : ""}
                  onClick={() => setOverviewMode("expenses")}
                >
                  Expenses
                </button>

                <button
                  className={overviewMode === "income" ? "active income-active" : ""}
                  onClick={() => setOverviewMode("income")}
                >
                  Income
                </button>
              </div>
            </div>

            <section className="dashboard-content-grid">
              {overviewMode === "expenses" ? (
                <>
                  <ExpenseForm
                    formData={expenseFormData}
                    onChange={handleExpenseChange}
                    onSubmit={handleCreateExpense}
                    saving={savingExpense}
                    getTodayDate={getTodayDate}
                  />

                  <ExpenseTable
                    expenses={sortedExpenses}
                    loading={loading}
                    formatPKR={formatPKR}
                  />
                </>
              ) : (
                <>
                  <IncomeForm
                    formData={incomeFormData}
                    onChange={handleIncomeChange}
                    onSubmit={handleCreateIncome}
                    saving={savingIncome}
                    getTodayDate={getTodayDate}
                  />

                  <RecentIncomeTable
                    incomes={sortedIncomes}
                    loading={loading}
                    formatPKR={formatPKR}
                  />
                </>
              )}
            </section>
          </>
        )}

        {activeSection === "transactions" && (
          <section className="transactions-page-section">
            <TransactionsTable
              expenses={sortedExpenses}
              loading={loading}
              formatPKR={formatPKR}
              sortBy={expenseSortBy}
              sortOrder={expenseSortOrder}
              onSortByChange={setExpenseSortBy}
              onSortOrderChange={setExpenseSortOrder}
              onEditClick={openExpenseEditModal}
              onDeleteClick={(expense) => openDeleteModal(expense, "expense")}
            />
          </section>
        )}

        {activeSection === "income" && (
          <section className="transactions-page-section">
            <IncomeManagementTable
              incomes={sortedIncomes}
              loading={loading}
              formatPKR={formatPKR}
              sortBy={incomeSortBy}
              sortOrder={incomeSortOrder}
              onSortByChange={setIncomeSortBy}
              onSortOrderChange={setIncomeSortOrder}
              onEditClick={openIncomeEditModal}
              onDeleteClick={(income) => openDeleteModal(income, "income")}
            />
          </section>
        )}

        {activeSection === "budgets" && (
          <section className="dashboard-panel placeholder-panel">
            <h3>Budgets</h3>
            <p>Budget planning will be added in the next phase.</p>
          </section>
        )}

        {activeSection === "reports" && (
          <section className="dashboard-panel placeholder-panel">
            <h3>Reports</h3>
            <p>Spending reports and charts will be added later.</p>
          </section>
        )}
      </section>

      <DeleteConfirmModal
        record={deleteTarget?.record}
        recordType={deleteTarget?.type}
        title={
          deleteTarget?.type === "income"
            ? deleteTarget?.record?.source
            : deleteTarget?.record?.description
        }
        amount={deleteTarget?.record?.amount}
        formatPKR={formatPKR}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <EditExpenseModal
        expense={expenseToEdit}
        onCancel={() => setExpenseToEdit(null)}
        onSave={handleUpdateExpense}
        saving={editing}
        getTodayDate={getTodayDate}
      />

      <EditIncomeModal
        income={incomeToEdit}
        onCancel={() => setIncomeToEdit(null)}
        onSave={handleUpdateIncome}
        saving={editing}
        getTodayDate={getTodayDate}
      />
    </main>
  );
};

export default Dashboard;