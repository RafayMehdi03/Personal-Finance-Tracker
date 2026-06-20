import { Pencil, Trash2, ArrowDownUp } from "lucide-react";

const TransactionsTable = ({
  expenses,
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
          <h3>All Transactions</h3>
          <p>View, edit, sort, and manage all your recorded expenses.</p>
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
        <div className="empty-state">Loading transactions...</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">No transactions found.</div>
      ) : (
        <div className="expense-table-wrapper">
          <table className="expense-table transactions-table">
            <thead>
              <tr>
                <th>Description</th>
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
                <th className="actions-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <strong>{expense.description}</strong>
                  </td>

                  <td>
                    <span className="category-pill">{expense.category}</span>
                  </td>

                  <td>{expense.date}</td>

                  <td className="expense-amount">{formatPKR(expense.amount)}</td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="edit-expense-btn"
                        onClick={() => onEditClick(expense)}
                        aria-label="Edit expense"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="delete-expense-btn"
                        onClick={() => onDeleteClick(expense)}
                        aria-label="Delete expense"
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

export default TransactionsTable;