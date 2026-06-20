import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuthData } from "../utils/authStorage";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import "./Auth.css";
import BrandLogo from "./BrandLogo";

const API_BASE_URL = "http://localhost:8080/api/auth";

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const isValidGmail = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    return /^[A-Za-z0-9._%+-]+@gmail\.com$/.test(cleanEmail);
  };

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

    setRememberMe(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    if (!isValidGmail(formData.email.trim())) {
      setMessage("Please enter a valid Gmail address.");
      setMessageType("error");
      return false;
    }

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setMessageType("error");
      return false;
    }

    if (!isLogin && !formData.fullName.trim()) {
      setMessage("Full name is required.");
      setMessageType("error");
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessage();

    if (!validateForm()) {
      return;
    }

    const endpoint = isLogin ? "/login" : "/signup";

    const payload = isLogin
      ? {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }
      : {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
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

      saveAuthData(data, isLogin && rememberMe);

      setMessage(data.message || "Success");
      setMessageType("success");

      console.log("Auth success:", data);
      console.log("JWT token:", data.token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
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

      <section className="auth-shell">
        <div className="auth-visual-panel">
          <nav className="auth-brand">
            <BrandLogo size="large" />

            <div>
              <h1>HisaabKitaab</h1>
              <p>Apna Hisaab, Apne Haath</p>
            </div>
          </nav>

          <div className="hero-copy">
            <div className="premium-chip">
              <BookOpen size={14} />
              A ledger, kept properly
            </div>

            <h2>
              Every rupee,
              <span>written down and accounted for.</span>
            </h2>

            <p>
              No clutter, no guesswork. Just a clear running record of what
              came in, what went out, and what's actually left.
            </p>
          </div>

          <div className="finance-preview">
            <div className="preview-top">
              <div>
                <p>Closing balance</p>
                <h3>PKR 24,892</h3>
              </div>

              <div className="growth-pill">
                <TrendingUp size={14} />
                +18.2% this month
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
                <strong>PKR 84,200</strong>
              </div>

              <div>
                <span>Expenses</span>
                <strong>PKR 31,800</strong>
              </div>

              <div>
                <span>Savings</span>
                <strong>PKR 52,400</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="security-icon">
              <ShieldCheck size={24} />
            </div>

            <div className="auth-heading">
              <h2>{isLogin ? "Open your ledger" : "Start your ledger"}</h2>
              <p>
                {isLogin
                  ? "Sign in with your Gmail account to pick up where you left off."
                  : "Create an account with your Gmail address to begin tracking."}
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
                    <User size={17} />
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
                  <Mail size={17} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    pattern="[A-Za-z0-9._%+-]+@gmail\.com"
                    title="Please enter a valid Gmail address"
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Password</label>
                <div className="field-box">
                  <Lock size={17} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="field-group">
                  <label>Confirm Password</label>
                  <div className="field-box">
                    <Lock size={17} />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Repeat your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength={8}
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <label className="remember-me-row">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />

                  <span>Remember Me</span>
                </label>
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

                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="divider">
              <span />
              <p>Secured access</p>
              <span />
            </div>

            <div className="auth-footer-note">
              <ShieldCheck size={16} />
              <p>
                {isLogin
                  ? "Your session is verified with JWT authentication."
                  : "Your account details are stored securely in PostgreSQL."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;
