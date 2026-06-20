import { Eye, EyeOff, Lock, LogOut, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { changePassword } from "../../api/settingsApi";

const SettingsPage = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessage();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setMessage("Please fill all password fields.");
      setMessageType("error");
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      setMessageType("error");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("New password and confirm password do not match.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);

      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage(response.message || "Password changed successfully.");
      setMessageType("success");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setMessage(error.message || "Unable to change password.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="settings-page">
      <div className="transactions-header">
        <div>
          <p>Account Control</p>
          <h2>Settings</h2>
        </div>

        <div className="settings-secure-pill">
          <ShieldCheck size={17} />
          Secured
        </div>
      </div>

      <section className="settings-grid">
        <div className="settings-profile-card">
          <div className="settings-avatar">
            {(user?.fullName || "U").charAt(0).toUpperCase()}
          </div>

          <h3>{user?.fullName || "User"}</h3>
          <p>{user?.email || "No email found"}</p>

          <div className="settings-profile-list">
            <div>
              <User size={17} />
              <span>Profile</span>
              <strong>{user?.fullName || "User"}</strong>
            </div>

            <div>
              <Mail size={17} />
              <span>Email</span>
              <strong>{user?.email || "-"}</strong>
            </div>

            <div>
              <ShieldCheck size={17} />
              <span>Security</span>
              <strong>JWT Protected</strong>
            </div>
          </div>

          <button type="button" className="settings-logout-btn" onClick={onLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>

        <div className="settings-security-card">
          <div className="settings-card-heading">
            <div className="settings-card-icon">
              <Lock size={22} />
            </div>

            <div>
              <h3>Change Password</h3>
              <p>Use a strong password to keep your account secure.</p>
            </div>
          </div>

          {message && (
            <div className={`settings-message ${messageType}`}>
              {message}
            </div>
          )}

          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="dashboard-field">
              <label>Current Password</label>

              <div className="settings-password-field">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="dashboard-field">
              <label>New Password</label>

              <div className="settings-password-field">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="dashboard-field">
              <label>Confirm New Password</label>

              <div className="settings-password-field">
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                >
                  {showConfirmNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" className="save-edit-btn settings-save-btn" disabled={saving}>
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </section>
    </section>
  );
};

export default SettingsPage;