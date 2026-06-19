import { LogOut } from "lucide-react";
import BrandLogo from "../brandlogo";

const Sidebar = ({ activeSection, onSectionChange, onLogout }) => {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-brand">
        <BrandLogo size="small" />

        <div>
          <h1>HisaabKitaab</h1>
          <p>Track. Save. Grow.</p>
        </div>
      </div>

      <nav className="dashboard-nav">
        <button
          className={activeSection === "overview" ? "active" : ""}
          onClick={() => onSectionChange("overview")}
        >
          Overview
        </button>

        <button
          className={activeSection === "transactions" ? "active" : ""}
          onClick={() => onSectionChange("transactions")}
        >
          Transactions
        </button>

        <button
          className={activeSection === "income" ? "active" : ""}
          onClick={() => onSectionChange("income")}
        >
          Income
        </button>

        <button
          className={activeSection === "budgets" ? "active" : ""}
          onClick={() => onSectionChange("budgets")}
        >
          Budgets
        </button>

        <button
          className={activeSection === "reports" ? "active" : ""}
          onClick={() => onSectionChange("reports")}
        >
          Reports
        </button>
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;