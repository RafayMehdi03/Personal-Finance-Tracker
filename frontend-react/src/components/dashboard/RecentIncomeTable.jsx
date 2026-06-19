const RecentIncomeTable = ({ incomes, loading, formatPKR }) => {
  const recentIncomes = incomes.slice(0, 3);

  return (
    <section className="dashboard-panel">
      <div className="panel-header">
        <div>
          <h3>Recent Income</h3>
          <p>Your latest 3 income records.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading income...</div>
      ) : recentIncomes.length === 0 ? (
        <div className="empty-state">No income yet. Add your first income.</div>
      ) : (
        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentIncomes.map((income) => (
                <tr key={income.id}>
                  <td>{income.source}</td>
                  <td>
                    <span className="income-pill">{income.category}</span>
                  </td>
                  <td>{income.date}</td>
                  <td className="income-amount">{formatPKR(income.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentIncomeTable;