const ExpenseTable = ({ expenses, loading, formatPKR }) => {
  const recentExpenses = expenses.slice(0, 3);

  return (
    <section className="dashboard-panel">
      <div className="panel-header">
        <div>
          <h3>Recent Expenses</h3>
          <p>Your latest 3 recorded transactions.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading expenses...</div>
      ) : recentExpenses.length === 0 ? (
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
              </tr>
            </thead>

            <tbody>
              {recentExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>
                    <span className="category-pill">{expense.category}</span>
                  </td>
                  <td>{expense.date}</td>
                  <td>{formatPKR(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ExpenseTable;