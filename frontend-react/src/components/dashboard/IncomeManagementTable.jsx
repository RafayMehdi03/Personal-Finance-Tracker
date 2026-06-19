import { Pencil, Trash2, ArrowDownUp } from "lucide-react";

const IncomeManagementTable = ({
  incomes,
  loading,
  formatPKR,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <section className="dashboard-panel transactions-panel">
      <div className="panel-header transactions-panel-header">
        <div>
          <h3>All Income</h3>
          <p>View, edit, sort, and manage your income records.</p>
        </div>

        <div className="sort-controls">
          <div className="sort-control">
            <label>Sort by</label>
            <select
              value={sortBy}
              onChange={(event) => onSortByChange(event.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="sort-control">
            <label>Order</label>
            <select
              value={sortOrder}
              onChange={(event) => onSortOrderChange(event.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading income records...</div>
      ) : incomes.length === 0 ? (
        <div className="empty-state">No income records found.</div>
      ) : (
        <div className="expense-table-wrapper">
          <table className="expense-table transactions-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>
                  <span className="sortable-heading">
                    Category <ArrowDownUp size={13} />
                  </span>
                </th>
                <th>
                  <span className="sortable-heading">
                    Date <ArrowDownUp size={13} />
                  </span>
                </th>
                <th>
                  <span className="sortable-heading">
                    Amount <ArrowDownUp size={13} />
                  </span>
                </th>
                <th>Note</th>
                <th className="actions-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {incomes.map((income) => (
                <tr key={income.id}>
                  <td>
                    <strong>{income.source}</strong>
                  </td>

                  <td>
                    <span className="income-pill">{income.category}</span>
                  </td>

                  <td>{income.date}</td>

                  <td className="income-amount">{formatPKR(income.amount)}</td>

                  <td>{income.note || "-"}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="edit-expense-btn"
                        onClick={() => onEditClick(income)}
                        aria-label="Edit income"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="delete-expense-btn"
                        onClick={() => onDeleteClick(income)}
                        aria-label="Delete income"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default IncomeManagementTable;