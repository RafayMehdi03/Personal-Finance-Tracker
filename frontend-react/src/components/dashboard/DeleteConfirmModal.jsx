import { Trash2 } from "lucide-react";

const DeleteConfirmModal = ({
  record,
  recordType,
  title,
  amount,
  formatPKR,
  onCancel,
  onConfirm,
}) => {
  if (!record) return null;

  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal">
        <div className="delete-modal-icon">
          <Trash2 size={22} />
        </div>

        <h3>Delete {recordType}?</h3>

        <p>
          Are you sure you want to delete <strong>{title}</strong> worth{" "}
          <strong>{formatPKR(amount)}</strong>? This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="cancel-delete-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-delete-btn"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;