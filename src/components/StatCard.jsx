function StatCard({
  icon,
  title,
  value,
  description,
  type = "blue",
}) {
  return (
    <div className={`stat-card ${type}`}>

      <div className="stat-card-top">

        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-title">
          {title}
        </span>

      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-description">
        {description}
      </div>

    </div>
  );
}

export default StatCard;