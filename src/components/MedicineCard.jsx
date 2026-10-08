import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import medicineIcon from "../assets/pills-pill-svgrepo-com.svg";

import "../styles/MedicineCard.css";

function MedicineCard({
  medicine,
  onDelete,
}) {
  const navigate = useNavigate();

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(
    `${medicine.expiry}T00:00:00`
  );

  let status = "Available";
  let statusClass = "available";

  if (expiryDate < today) {
    status = "Expired";
    statusClass = "expired";
  } else {
    const days = Math.ceil(
      (expiryDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 30) {
      status = "Expiring Soon";
      statusClass = "expiring";
    } else if (
      medicine.stock <= medicine.minimum
    ) {
      status = "Low Stock";
      statusClass = "low";
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${medicine.name}?`
    );

    if (confirmed) {
      onDelete(medicine.id);
    }
  };

  return (
    <article className="medicine-card">

      <div className="medicine-card-header">

        <div className="medicine-card-icon">
          <img src={medicineIcon} alt="No Medicines" />
        </div>

        <div className="medicine-card-title">
          <h3>{medicine.name}</h3>

          <p>
            {medicine.company ||
              "Company not specified"}
          </p>
        </div>

        <span
          className={`card-status ${statusClass}`}
        >
          {status}
        </span>

      </div>

      <div className="medicine-card-details">

        <div>
          <span>Category</span>
          <strong>
            {medicine.category || "-"}
          </strong>
        </div>

        <div>
          <span>Batch</span>
          <strong>
            {medicine.batch || "-"}
          </strong>
        </div>

        <div>
          <span>Expiry</span>
          <strong>
            {medicine.expiry}
          </strong>
        </div>

        <div>
          <span>Stock</span>
          <strong>
            {medicine.stock} units
          </strong>
        </div>

        <div>
          <span>Price</span>
          <strong>
            ₹{Number(
              medicine.price
            ).toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Minimum</span>
          <strong>
            {medicine.minimum} units
          </strong>
        </div>

      </div>

      <div className="medicine-card-actions">

        <button
          type="button"
          className="card-edit"
          onClick={() =>
            navigate(
              `/medicine/${medicine.id}`
            )
          }
        >
          <FaEdit />
          Edit
        </button>

        <button
          type="button"
          className="card-delete"
          onClick={handleDelete}
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </article>
  );
}

export default MedicineCard;