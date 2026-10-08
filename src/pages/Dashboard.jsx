import {
  FaBoxes,
  FaExclamationTriangle,
  FaPills,
  FaClock,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

import { useMedicine } from "../context/MedicineContext";
import medicineIcon from "../assets/pills-pill-svgrepo-com.svg";
import emptyIcon from "../assets/pills-pill-svgrepo-com.svg";
import "../styles/Dashboard.css";

function Dashboard() {
  const {
    medicines,
    totalUnits,
    lowStockMedicines,
    expiredMedicines,
    expiringMedicines,
  } = useMedicine();

  const recentMedicines = [...medicines]
    .reverse()
    .slice(0, 5);

  return (
    <>
      <Navbar />

      <main className="dashboard-page">

        {/* Header */}

        <section className="page-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Manage your medicine inventory
              easily and efficiently.
            </p>
          </div>

          <Link
            to="/medicine"
            className="primary-button"
          >
            <FaPlus />
            Add Medicine
          </Link>

        </section>

        {/* Statistics */}

        <section className="stats-grid">

          <StatCard
            icon={<FaPills />}
            title="Medicines"
            value={medicines.length}
            description="Total medicine records"
            type="blue"
          />

          <StatCard
            icon={<FaBoxes />}
            title="Total Units"
            value={totalUnits}
            description="Available medicine units"
            type="green"
          />

          <StatCard
            icon={<FaExclamationTriangle />}
            title="Low Stock"
            value={lowStockMedicines.length}
            description="Need restocking"
            type="orange"
          />

          <StatCard
            icon={<FaClock />}
            title="Expiry Alerts"
            value={
              expiredMedicines.length +
              expiringMedicines.length
            }
            description="Expired or expiring"
            type="red"
          />

        </section>

        {/* Alerts */}

        <section className="dashboard-grid">

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h2>Stock Alerts</h2>

                <p>
                  Medicines that need attention
                </p>
              </div>

              <Link to="/stock">
                View All
                <FaArrowRight />
              </Link>

            </div>

            {lowStockMedicines.length === 0 &&
            expiredMedicines.length === 0 &&
            expiringMedicines.length === 0 ? (
              <div className="empty-dashboard">
                <div>✓</div>

                <h3>Everything looks good</h3>

                <p>
                  No stock or expiry alerts.
                </p>
              </div>
            ) : (
              <div className="alert-list">

                {expiredMedicines
                  .slice(0, 5)
                  .map((medicine) => (
                    <div
                      className="alert-item expired"
                      key={`expired-${medicine.id}`}
                    >
                      <div className="alert-icon">
                        ⚠
                      </div>

                      <div>
                        <strong>
                          {medicine.name}
                        </strong>

                        <span>
                          Expired on{" "}
                          {medicine.expiry}
                        </span>
                      </div>
                    </div>
                  ))}

                {lowStockMedicines
                  .slice(0, 5)
                  .map((medicine) => (
                    <div
                      className="alert-item low"
                      key={`low-${medicine.id}`}
                    >
                      <div className="alert-icon">
                        !
                      </div>

                      <div>
                        <strong>
                          {medicine.name}
                        </strong>

                        <span>
                          Only{" "}
                          {medicine.stock} units
                          remaining
                        </span>
                      </div>
                    </div>
                  ))}

                {expiringMedicines
                  .slice(0, 5)
                  .map((medicine) => (
                    <div
                      className="alert-item soon"
                      key={`soon-${medicine.id}`}
                    >
                      <div className="alert-icon">
                        ⏱
                      </div>

                      <div>
                        <strong>
                          {medicine.name}
                        </strong>

                        <span>
                          Expires on{" "}
                          {medicine.expiry}
                        </span>
                      </div>
                    </div>
                  ))}

              </div>
            )}

          </div>

          {/* Quick actions */}

          <div className="dashboard-panel quick-panel">

            <div className="panel-header">
              <div>
                <h2>Quick Actions</h2>

                <p>
                  Common inventory actions
                </p>
              </div>
            </div>

            <div className="quick-actions">

              <Link to="/medicine">
                <span>➕</span>

                <div>
                  <strong>Add Medicine</strong>

                  <small>
                    Add a new medicine
                  </small>
                </div>

                <FaArrowRight />
              </Link>

              <Link to="/stock">
                <span>📦</span>

                <div>
                  <strong>View Stock</strong>

                  <small>
                    Check available stock
                  </small>
                </div>

                <FaArrowRight />
              </Link>

            </div>

          </div>

        </section>

        {/* Recent Medicines */}

        <section className="dashboard-panel recent-panel">

          <div className="panel-header">

            <div>
              <h2>Recently Added</h2>

              <p>
                Latest medicine records
              </p>
            </div>

            <Link to="/stock">
              View All
              <FaArrowRight />
            </Link>

          </div>

          {recentMedicines.length === 0 ? (
            <div className="empty-dashboard">
              <div className="empty-icon">
                <img src={emptyIcon} alt="No Medicines" />
              </div>

              <h3>No medicines yet</h3>

              <p>
                Add your first medicine to
                start managing your stock.
              </p>

              <Link
                to="/medicine"
                className="primary-button"
              >
                <FaPlus />
                Add Medicine
              </Link>
            </div>
          ) : (
            <div className="recent-list">

              {recentMedicines.map((medicine) => (
                <div
                  className="recent-item"
                  key={medicine.id}
                >
                  <div className="recent-medicine-icon">
                    <img src={medicineIcon} alt="Medicine" />
                  </div>

                  <div className="recent-info">
                    <strong>
                      {medicine.name}
                    </strong>

                    <span>
                      {medicine.company ||
                        "No company"}{" "}
                      • {medicine.category ||
                        "Other"}
                    </span>
                  </div>

                  <div className="recent-stock">
                    <strong>
                      {medicine.stock}
                    </strong>

                    <span>units</span>
                  </div>

                  <span
                    className={
                      medicine.stock <=
                      medicine.minimum
                        ? "stock-badge low"
                        : "stock-badge"
                    }
                  >
                    {medicine.stock <=
                    medicine.minimum
                      ? "Low"
                      : "Available"}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

      </main>
    </>
  );
}

export default Dashboard;