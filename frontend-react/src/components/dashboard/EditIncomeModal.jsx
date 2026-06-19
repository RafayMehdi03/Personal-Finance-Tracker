import { useEffect, useState } from "react";

const EditIncomeModal = ({ income, onCancel, onSave, saving, getTodayDate }) => {
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: getTodayDate(),
    category: "",
    note: "",
  });

  useEffect(() => {
    if (income) {
      setFormData({
        source: income.source || "",
        amount: income.amount || "",
        date: income.date || getTodayDate(),
        category: income.category || "",
        note: income.note || "",
      });
    }
  }, [income, getTodayDate]);

  if (!income) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSave({
      source: formData.source.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      category: formData.category,
      note: formData.note.trim(),
    });
  };

  return (
    <div className="delete-modal-backdrop">
      <div className="edit-modal">
        <h3>Edit Income</h3>
        <p>Update your income record below.</p>

        <form className="expense-form edit-expense-form" onSubmit={handleSubmit}>
          <div className="dashboard-field">
            <label>Source</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
            />
          </div>

          <div className="dashboard-field">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div className="dashboard-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              max={getTodayDate()}
              onChange={handleChange}
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
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Business">Business</option>
              <option value="Gift">Gift</option>
              <option value="Investment">Investment</option>
              <option value="Bonus">Bonus</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="dashboard-field">
            <label>Note</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <div className="delete-modal-actions">
            <button
              type="button"
              className="cancel-delete-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button type="submit" className="save-edit-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncomeModal;