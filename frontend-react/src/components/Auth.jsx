import { useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Mail,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import "./Auth.css";

const API_BASE_URL = "http://localhost:8080/api/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const handleModeChange = (mode) => {
    setIsLogin(mode);
    resetMessage();

    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessage();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    const endpoint = isLogin ? "/login" : "/signup";

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        };

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            data.detail ||
            "Signup/Login request failed."
        );
      }

      localStorage.setItem("financeos_user", JSON.stringify(data));

      setMessage(data.message || "Success");
      setMessageType("success");

      console.log("Auth success:", data);
    } catch (error) {
      setMessage(error.message || "Unable to connect to backend.");
      setMessageType("error");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="noise-layer" />

      <section className="auth-orb auth-orb-one" />
      <section className="auth-orb auth-orb-two" />

      <section className="auth-shell">
        <div className="auth-visual-panel">
          <nav className="auth-brand">
            <div className="brand-mark">
              <BadgeDollarSign size={28} />
            </div>

            <div>
              <h1>FinanceOS</h1>
              <p>Personal finance command center</p>
            </div>
          </nav>

          <div className="hero-copy">
            <div className="premium-chip">
              <Sparkles size={15} />
              Smart finance workspace
            </div>

            <h2>
              Your money,
              <span> organized like an operating system.</span>
            </h2>

            <p>
              Track expenses, monitor cash flow, and control your financial
              dashboard from one elegant workspace.
            </p>
          </div>

          <div className="finance-preview">
            <div className="preview-top">
              <div>
                <p>Total Balance</p>
                <h3>$24,892.40</h3>
              </div>

              <div className="growth-pill">
                <TrendingUp size={16} />
                +18.2%
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-bar bar-one" />
              <div className="chart-bar bar-two" />
              <div className="chart-bar bar-three" />
              <div className="chart-bar bar-four" />
              <div className="chart-bar bar-five" />
              <div className="chart-bar bar-six" />
              <div className="chart-bar bar-seven" />
            </div>

            <div className="mini-stats">
              <div>
                <span>Income</span>
                <strong>$8,420</strong>
              </div>

              <div>
                <span>Expenses</span>
                <strong>$3,180</strong>
              </div>

              <div>
                <span>Savings</span>
                <strong>$5,240</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="security-icon">
              <Fingerprint size={34} />
            </div>

            <div className="auth-heading">
              <h2>{isLogin ? "Access FinanceOS" : "Create your workspace"}</h2>
              <p>
                {isLogin
                  ? "Enter your credentials to open your finance dashboard."
                  : "Start your personal finance dashboard with a secure account."}
              </p>
            </div>

            <div className="auth-switch">
              <button
                type="button"
                className={isLogin ? "active" : ""}
                onClick={() => handleModeChange(true)}
              >
                Login
              </button>

              <button
                type="button"
                className={!isLogin ? "active" : ""}
                onClick={() => handleModeChange(false)}
              >
                Signup
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="field-group">
                  <label>Full Name</label>
                  <div className="field-box">
                    <User size={18} />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Rafay Mehdi"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="field-group">
                <label>Email Address</label>
                <div className="field-box">
                  <Mail size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Password</label>
                <div className="field-box">
                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter secure password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="field-group">
                  <label>Confirm Password</label>
                  <div className="field-box">
                    <Lock size={18} />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={6}
                      required
                    />
                  </div>
                </div>
              )}

              {message && (
                <div className={`auth-message ${messageType}`}>{message}</div>
              )}

              <button type="submit" className="primary-action" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Enter Dashboard"
                  : "Create Account"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="divider">
              <span />
              <p>Finance-grade access</p>
              <span />
            </div>

            <div className="auth-footer-note">
              <BarChart3 size={17} />
              <p>
                {isLogin
                  ? "Your login is connected to the Spring Boot backend."
                  : "Your account will be saved securely in PostgreSQL."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;