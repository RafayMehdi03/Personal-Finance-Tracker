import { Plus } from "lucide-react";

const ExpenseForm = ({
  formData,
  onChange,
  onSubmit,
  saving,
  getTodayDate,
}) => {
  return (
    <section className="dashboard-panel">
      <div className="panel-header">
        <div>
          <h3>Add Expense</h3>
          <p>Record a new transaction in your personal hisaab.</p>
        </div>
      </div>

      <form className="expense-form" onSubmit={onSubmit}>
        <div className="form-row">
          <div className="dashboard-field">
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="Lunch, fuel, groceries..."
              value={formData.description}
              onChange={onChange}
            />
          </div>

          <div className="dashboard-field">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="2500"
              value={formData.amount}
              onChange={onChange}
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
              onChange={onChange}
              max={getTodayDate()}
            />
          </div>

          <div className="dashboard-field">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={onChange}
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
  );
};

export default ExpenseForm;