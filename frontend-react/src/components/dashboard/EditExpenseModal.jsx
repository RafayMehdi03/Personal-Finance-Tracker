import { useEffect, useState } from "react";

const EditExpenseModal = ({ expense, onCancel, onSave, saving, getTodayDate }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: getTodayDate(),
    category: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || "",
        amount: expense.amount || "",
        date: expense.date || getTodayDate(),
        category: expense.category || "",
      });
    }
  }, [expense, getTodayDate]);

  if (!expense) return null;

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
      description: formData.description.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      category: formData.category,
    });
  };

  return (
    <div className="delete-modal-backdrop">
      <div className="edit-modal">
        <h3>Edit Expense</h3>
        <p>Update your transaction details below.</p>

        <form className="expense-form edit-expense-form" onSubmit={handleSubmit}>
          <div className="dashboard-field">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
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
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="delete-modal-actions">
            <button
              type="button"
              className="cancel-delete-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-edit-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;