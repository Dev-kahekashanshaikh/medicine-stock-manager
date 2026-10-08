import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiPackage,
  FiCalendar,
  FiHash,
  FiTruck,
  FiShoppingCart,
  FiAlertTriangle,
} from "react-icons/fi";

import { useMedicine } from "../context/MedicineContext";
import "../styles/MedicineForm.css";

const initialForm = {
  name: "",
  company: "",
  batch: "",
  expiry: "",
  purchase: "",
  sales: "",
  minimum: "",
  price: "",
};

const MedicineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    medicines,
    addMedicine,
    updateMedicine,
  } = useMedicine();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  // Find medicine when editing
  const medicine = medicines.find((item) => item.id === id);

  // Load existing medicine data
  useEffect(() => {
    if (isEditMode && medicine) {
      setForm({
        name: medicine.name || "",
        company: medicine.company || "",
        batch: medicine.batch || "",
        expiry: medicine.expiry || "",
        purchase: "",
        sales: "",
        minimum: medicine.minimum ?? "",
        price: medicine.price ?? "",
      });
    }
  }, [isEditMode, medicine]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Submit form
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    // Basic validation
    if (!form.name.trim()) {
      setError("Medicine name is required.");
      return;
    }

    if (!form.expiry) {
      setError("Expiry date is required.");
      return;
    }

    const purchase = Number(form.purchase) || 0;
    const sales = Number(form.sales) || 0;

    if (purchase < 0 || sales < 0) {
      setError("Purchase and sales quantities cannot be negative.");
      return;
    }

    if (Number(form.minimum) < 0) {
      setError("Minimum stock cannot be negative.");
      return;
    }

    if (Number(form.price) < 0) {
      setError("Purchase price cannot be negative.");
      return;
    }

    // When editing, calculate available stock
    // using existing stock + new purchase.
    if (isEditMode && medicine) {
      const availableStock = Number(medicine.stock) + purchase;

      if (sales > availableStock) {
        setError(
          `Sales quantity cannot be greater than available stock (${availableStock}).`
        );
        return;
      }
    }

    // When adding a new medicine
    if (!isEditMode && sales > purchase) {
      setError(
        "Sales quantity cannot be greater than the purchase quantity."
      );
      return;
    }

    let result;

    if (isEditMode) {
      result = updateMedicine(id, form);
    } else {
      result = addMedicine(form);
    }

    if (!result?.success) {
      setError(result?.message || "Something went wrong.");
      return;
    }

    navigate("/stock");
  };

  // Invalid edit ID
  if (isEditMode && !medicine) {
    return (
      <div className="medicine-form-page">
        <div className="form-not-found">
          <div className="not-found-icon">
            <FiAlertTriangle />
          </div>

          <h2>Medicine Not Found</h2>

          <p>
            The medicine you are trying to update does not exist.
          </p>

          <Link to="/stock" className="primary-button">
            <FiArrowLeft />
            Back to Stock
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="medicine-form-page">
      {/* Page Header */}
      <div className="form-page-header">
        <div>
          <Link to="/stock" className="back-link">
            <FiArrowLeft />
            Back to Stock
          </Link>

          <h1>
            {isEditMode ? "Update Medicine" : "Add Medicine"}
          </h1>

          <p>
            {isEditMode
              ? "Update medicine details or adjust the current stock."
              : "Add a new medicine to your stock inventory."}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="medicine-form-card">
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="form-error">
              <FiAlertTriangle />
              <span>{error}</span>
            </div>
          )}

          {/* Medicine Information */}
          <div className="form-section">
            <div className="section-heading">
              <div className="section-icon">
                <FiPackage />
              </div>

              <div>
                <h2>Medicine Information</h2>
                <p>Enter the basic medicine details.</p>
              </div>
            </div>

            <div className="form-grid">
              {/* Medicine Name */}
              <div className="form-group full-width">
                <label htmlFor="name">
                  Medicine Name
                  <span className="required">*</span>
                </label>

                <div className="input-wrapper">
                  <FiPackage className="input-icon" />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Paracetamol 500mg"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="form-group">
                <label htmlFor="company">Company</label>

                <div className="input-wrapper">
                  <FiTruck className="input-icon" />

                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. Cipla"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Batch */}
              <div className="form-group">
                <label htmlFor="batch">Batch Number</label>

                <div className="input-wrapper">
                  <FiHash className="input-icon" />

                  <input
                    id="batch"
                    type="text"
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    placeholder="e.g. PCM2026A"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Expiry */}
              <div className="form-group">
                <label htmlFor="expiry">
                  Expiry Date
                  <span className="required">*</span>
                </label>

                <div className="input-wrapper">
                  <FiCalendar className="input-icon" />

                  <input
                    id="expiry"
                    type="date"
                    name="expiry"
                    value={form.expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="form-section">
            <div className="section-heading">
              <div className="section-icon">
                <FiShoppingCart />
              </div>

              <div>
                <h2>Stock Information</h2>

                <p>
                  {isEditMode
                    ? "Enter purchase or sales quantities to adjust stock."
                    : "Enter the initial stock quantities."}
                </p>
              </div>
            </div>

            {/* Current Stock - Edit Mode */}
            {isEditMode && (
              <div className="current-stock-box">
                <div className="current-stock-icon">
                  <FiPackage />
                </div>

                <div>
                  <span>Current Stock</span>
                  <strong>{medicine.stock} units</strong>
                </div>
              </div>
            )}

            <div className="form-grid">
              {/* Purchase Quantity */}
              <div className="form-group">
                <label htmlFor="purchase">
                  Purchase Quantity
                </label>

                <div className="input-wrapper">
                  <FiShoppingCart className="input-icon" />

                  <input
                    id="purchase"
                    type="number"
                    name="purchase"
                    value={form.purchase}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>

                {isEditMode && (
                  <small className="field-help">
                    Units purchased now will be added to current stock.
                  </small>
                )}
              </div>

              {/* Sales Quantity */}
              <div className="form-group">
                <label htmlFor="sales">Sales Quantity</label>

                <div className="input-wrapper">
                  <FiShoppingCart className="input-icon" />

                  <input
                    id="sales"
                    type="number"
                    name="sales"
                    value={form.sales}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>

                {isEditMode && (
                  <small className="field-help">
                    Units sold now will be deducted from stock.
                  </small>
                )}
              </div>

              {/* Minimum Stock */}
              <div className="form-group">
                <label htmlFor="minimum">Minimum Stock</label>

                <div className="input-wrapper">
                  <FiAlertTriangle className="input-icon" />

                  <input
                    id="minimum"
                    type="number"
                    name="minimum"
                    value={form.minimum}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    min="0"
                    step="1"
                  />
                </div>

                <small className="field-help">
                  Stock at or below this value will be marked LOW.
                </small>
              </div>

              {/* Purchase Price */}
              <div className="form-group">
                <label htmlFor="price">
                  Purchase Price / Unit
                </label>

                <div className="input-wrapper">
                <span className="rupee-icon">₹</span>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 25.50"
                    min="0"
                    step="0.01"
                  />
                </div>

                <small className="field-help">
                  Enter the purchase price for one unit.
                </small>
              </div>
            </div>
          </div>

          {/* Stock Calculation Info */}
          <div className="stock-info">
            <FiPackage />

            <div>
              <strong>Stock calculation</strong>

              <p>
                {isEditMode
                  ? "New Stock = Current Stock + Purchase Quantity − Sales Quantity"
                  : "Initial Stock = Purchase Quantity − Sales Quantity"}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/stock" className="secondary-button">
              Cancel
            </Link>

            <button type="submit" className="primary-button">
              <FiSave />

              {isEditMode
                ? "Update Medicine"
                : "Save Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineForm;