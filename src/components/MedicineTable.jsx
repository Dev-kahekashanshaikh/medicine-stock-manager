import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../styles/MedicineTable.css";

function MedicineTable({
  medicines,
  onDelete,
}) {
  const navigate = useNavigate();

  const getStatus = (medicine) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(
      `${medicine.expiry}T00:00:00`
    );

    if (expiryDate < today) {
      return {
        text: "Expired",
        className: "expired",
      };
    }

    const days = Math.ceil(
      (expiryDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 30) {
      return {
        text: "Expiring Soon",
        className: "expiring",
      };
    }

    if (
      Number(medicine.stock) <=
      Number(medicine.minimum)
    ) {
      return {
        text: "Low Stock",
        className: "low",
      };
    }

    return {
      text: "Available",
      className: "available",
    };
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <div className="medicine-table-wrapper">

      <table className="medicine-table">

        <thead>
          <tr>
            <th>Medicine</th>
            <th>Company</th>
            <th>Agency Name</th>
            <th>Batch</th>
            <th>Expiry</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {medicines.map((medicine) => {
            const status =
              getStatus(medicine);

            return (
              <tr key={medicine.id}>

                <td>
                  <strong>
                    {medicine.name}
                  </strong>
                </td>

                <td>
                  {medicine.company || "-"}
                </td>

                <td>
                  {medicine.agencyName || "-"}
                </td>

                <td>
                  {medicine.batch || "-"}
                </td>

                <td>
                  {medicine.expiry}
                </td>

                <td>
                  <strong>
                    {medicine.stock}
                  </strong>
                </td>

                <td>
                  ₹
                  {Number(
                    medicine.price
                  ).toFixed(2)}
                </td>

                <td>
                  <span
                    className={`status-badge ${status.className}`}
                  >
                    {status.text}
                  </span>
                </td>

                <td>
                  <div className="table-actions">

                    <button
                      type="button"
                      className="edit-action"
                      title="Edit"
                      onClick={() =>
                        navigate(
                          `/medicine/${medicine.id}`
                        )
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      className="delete-action"
                      title="Delete"
                      onClick={() =>
                        handleDelete(medicine.id)
                      }
                    >
                      <FaTrash />
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}

export default MedicineTable;