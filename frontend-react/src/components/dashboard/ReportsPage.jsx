import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";

const ReportsPage = ({ expenses, incomes, formatPKR }) => {
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const totalIncome = incomes.reduce(
    (total, income) => total + Number(income.amount || 0),
    0
  );

  const currentBalance = totalIncome - totalExpenses;

  const buildCategoryData = (records) => {
    const categoryMap = {};

    records.forEach((record) => {
      const category = record.category || "Other";
      categoryMap[category] =
        (categoryMap[category] || 0) + Number(record.amount || 0);
    });

    return Object.entries(categoryMap).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const buildMonthlyData = () => {
    const monthMap = {};

    expenses.forEach((expense) => {
      const month = expense.date?.slice(0, 7) || "Unknown";

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          income: 0,
          expenses: 0,
          balance: 0,
        };
      }

      monthMap[month].expenses += Number(expense.amount || 0);
    });

    incomes.forEach((income) => {
      const month = income.date?.slice(0, 7) || "Unknown";

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          income: 0,
          expenses: 0,
          balance: 0,
        };
      }

      monthMap[month].income += Number(income.amount || 0);
    });

    return Object.values(monthMap)
      .map((item) => ({
        ...item,
        balance: item.income - item.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const expenseCategoryData = buildCategoryData(expenses);
  const incomeCategoryData = buildCategoryData(incomes);
  const monthlyData = buildMonthlyData();

  const overviewData = [
  {
    name: "Income",
    amount: totalIncome,
    type: "income",
  },
  {
    name: "Expenses",
    amount: totalExpenses,
    type: "expense",
  },
  {
    name: currentBalance < 0 ? "Deficit" : "Balance",
    amount: Math.abs(currentBalance),
    type: currentBalance < 0 ? "deficit" : "balance",
  },
];

  const pieColors = ["#14b8a6", "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4"];

  const hasAnyData = expenses.length > 0 || incomes.length > 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="chart-tooltip">
        {label && <strong>{label}</strong>}

        {payload.map((entry) => {
  const isDeficit = entry.payload?.type === "deficit";

  return (
    <p key={entry.dataKey || entry.name}>
      {entry.payload?.name || entry.name}:{" "}
      {isDeficit ? `-${formatPKR(entry.value)}` : formatPKR(entry.value)}
    </p>
  );
})}
      </div>
    );
  };

  return (
    <section className="reports-page">
      <div className="transactions-header">
        <div>
          <p>Financial Insights</p>
          <h2>Reports</h2>
        </div>

        <div className="transactions-count">
          {expenses.length + incomes.length} total records
        </div>
      </div>

      {!hasAnyData ? (
        <div className="reports-empty-state">
          <div className="reports-empty-icon">
            <BarChart3 size={34} />
          </div>

          <h3>No report data yet</h3>

          <p>
            Add income and expenses first. Your reports will automatically appear here.
            Budgets are optional and are not required for reports.
          </p>
        </div>
      ) : (
        <>
          <section className="reports-summary-grid">
            <div className="report-summary-card income-report-card">
              <span>Total Income</span>
              <strong>{formatPKR(totalIncome)}</strong>
            </div>

            <div className="report-summary-card expense-report-card">
              <span>Total Expenses</span>
              <strong>{formatPKR(totalExpenses)}</strong>
            </div>

            <div className="report-summary-card balance-report-card">
              <span>Current Balance</span>
              <strong>{formatPKR(currentBalance)}</strong>
            </div>
          </section>

          <section className="reports-chart-grid">
            <div className="report-chart-card wide-chart">
              <div className="chart-card-header">
                <h3>Income vs Expenses</h3>
                <p>A simple overview of your overall financial position.</p>
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={overviewData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                      {overviewData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                        entry.type === "income"
                        ? "#22c55e"
                        : entry.type === "expense"
                        ? "#ef4444"
                        : entry.type === "deficit"
                        ? "#f97316"
                        : "#14b8a6"
                      }
                    />  
                    ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="report-chart-card">
              <div className="chart-card-header">
                <h3>Expense by Category</h3>
                <p>Where your money is going.</p>
              </div>

              {expenseCategoryData.length === 0 ? (
                <div className="mini-empty-chart">No expense data yet.</div>
              ) : (
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="report-chart-card">
              <div className="chart-card-header">
                <h3>Income by Category</h3>
                <p>Your main income sources.</p>
              </div>

              {incomeCategoryData.length === 0 ? (
                <div className="mini-empty-chart">No income data yet.</div>
              ) : (
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={incomeCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {incomeCategoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="report-chart-card wide-chart">
              <div className="chart-card-header">
                <h3>Monthly Balance Trend</h3>
                <p>Income, expenses, and remaining balance month by month.</p>
              </div>

              {monthlyData.length === 0 ? (
                <div className="mini-empty-chart">No monthly data yet.</div>
              ) : (
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#22c55e" radius={[10, 10, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[10, 10, 0, 0]} />
                      <Bar dataKey="balance" name="Balance" fill="#14b8a6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default ReportsPage;