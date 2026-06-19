const MetricCard = ({ icon, label, value }) => {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
};

export default MetricCard;