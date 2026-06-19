import { Plus } from "lucide-react";

const IncomeForm = ({
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
          <h3>Add Income</h3>
          <p>Record salary, freelance, business, or other income.</p>
        </div>
      </div>

      <form className="expense-form" onSubmit={onSubmit}>
        <div className="form-row">
          <div className="dashboard-field">
            <label>Source</label>
            <input
              type="text"
              name="source"
              placeholder="Salary, freelance, business..."
              value={formData.source}
              onChange={onChange}
            />
          </div>

          <div className="dashboard-field">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="50000"
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
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Business">Business</option>
              <option value="Gift">Gift</option>
              <option value="Investment">Investment</option>
              <option value="Bonus">Bonus</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="dashboard-field">
          <label>Note</label>
          <input
            type="text"
            name="note"
            placeholder="Optional note..."
            value={formData.note}
            onChange={onChange}
          />
        </div>

        <button className="add-expense-btn income-action-btn" type="submit" disabled={saving}>
          <Plus size={18} />
          {saving ? "Adding..." : "Add Income"}
        </button>
      </form>
    </section>
  );
};

export default IncomeForm;