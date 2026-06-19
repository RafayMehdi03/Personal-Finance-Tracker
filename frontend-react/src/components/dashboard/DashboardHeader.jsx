import { ShieldCheck } from "lucide-react";

const DashboardHeader = ({ user }) => {
  return (
    <header className="dashboard-header">
      <div>
        <p>Welcome back</p>
        <h2>{user?.fullName || "User"}</h2>
      </div>

      <div className="secure-badge">
        <ShieldCheck size={18} />
        JWT Secured
      </div>
    </header>
  );
};

export default DashboardHeader;