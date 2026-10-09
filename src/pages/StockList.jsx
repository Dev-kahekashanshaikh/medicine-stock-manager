import { useMemo, useState } from "react";

import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaFileCsv,
  FaFileAlt,
  FaFileCode,
  FaTrash,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import MedicineTable from "../components/MedicineTable";
import MedicineCard from "../components/MedicineCard";

import emptyIcon from "../assets/pills-pill-svgrepo-com.svg";
import {
  useMedicine,
} from "../context/MedicineContext";

import "../styles/StockList.css";

function StockList() {
  const {
    medicines,
    deleteMedicine,
    clearAllMedicines,
  } = useMedicine();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [agencyName, setAgencyName] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const getMedicineStatus = (medicine) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(
      `${medicine.expiry}T00:00:00`
    );

    if (expiryDate < today) {
      return "Expired";
    }

    const days = Math.ceil(
      (expiryDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 30) {
      return "Expiring Soon";
    }

    if (
      Number(medicine.stock) <=
      Number(medicine.minimum)
    ) {
      return "Low Stock";
    }

    return "Available";
  };

  const agencyNames = [
    "All",
    ...new Set(
      medicines
        .map((medicine) => medicine.agencyName)
        .filter(Boolean)
    ),
  ];

  const filteredMedicines = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return medicines.filter((medicine) => {
      const matchesSearch =
        !query ||
        `${medicine.name}
        ${medicine.company}
        ${medicine.agencyName}
        ${medicine.batch}`
          .toLowerCase()
          .includes(query);

      const matchesAgencyName =
        agencyName === "All" ||
        medicine.agencyName === agencyName;

      const matchesStatus =
        status === "All" ||
        getMedicineStatus(medicine) ===
          status;

      return (
        matchesSearch &&
        matchesAgencyName &&
        matchesStatus
      );
    });
  }, [
    medicines,
    search,
    agencyName,
    status,
  ]);

  const handleSearch = (event) => {
    const value = event.target.value;

    setSearch(value);

    if (value.trim()) {
      setSearchParams({
        search: value,
      });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearch("");

    setAgencyName("All");

    setStatus("All");

    setSearchParams({});
  };

  // --------------------------------
  // FILE DOWNLOAD
  // --------------------------------

  const downloadFile = (
    content,
    fileName,
    type
  ) => {
    const blob = new Blob(
      [content],
      { type }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // --------------------------------
  // CSV
  // --------------------------------

  const escapeCSV = (value) => {
    const text = String(
      value ?? ""
    ).replace(/"/g, '""');

    return `"${text}"`;
  };

  const exportCSV = () => {
    if (!medicines.length) {
      alert("No medicine data available.");
      return;
    }

    const headers = [
      "Medicine Name",
      "Company",
      "Agency Name",
      "Batch",
      "Expiry",
      "Purchase Quantity",
      "Sales Quantity",
      "Available Stock",
      "Minimum Stock",
      "Price",
      "Status",
    ];

    const rows = medicines.map(
      (medicine) => [
        medicine.name,
        medicine.company,
        medicine.agencyName,
        medicine.batch,
        medicine.expiry,
        medicine.purchaseQty,
        medicine.salesQty,
        medicine.stock,
        medicine.minimum,
        medicine.price,
        getMedicineStatus(medicine),
      ]
    );

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    downloadFile(
      csv,
      "medicine-stock.csv",
      "text/csv;charset=utf-8;"
    );
  };

  // --------------------------------
  // TXT
  // --------------------------------

  const exportTXT = () => {
    if (!medicines.length) {
      alert("No medicine data available.");
      return;
    }

    let text =
      "MEDICINE STOCK REPORT\n";

    text +=
      "=====================\n\n";

    medicines.forEach(
      (medicine, index) => {
        text += `Medicine ${index + 1}\n`;

        text +=
          "---------------------\n";

        text += `Medicine Name: ${medicine.name}\n`;

        text += `Company: ${
          medicine.company || "-"
        }\n`;

        text += `Agency: ${
          medicine.agencyName || "-"
        }\n`;

        text += `Batch: ${
          medicine.batch || "-"
        }\n`;

        text += `Expiry: ${medicine.expiry}\n`;

        text += `Purchase Quantity: ${
          medicine.purchaseQty
        }\n`;

        text += `Sales Quantity: ${
          medicine.salesQty
        }\n`;

        text += `Available Stock: ${
          medicine.stock
        }\n`;

        text += `Minimum Stock: ${
          medicine.minimum
        }\n`;

        text += `Price: ₹${
          Number(
            medicine.price
          ).toFixed(2)
        }\n`;

        text += `Status: ${
          getMedicineStatus(medicine)
        }\n\n`;
      }
    );

    downloadFile(
      text,
      "medicine-stock.txt",
      "text/plain;charset=utf-8;"
    );
  };

  // --------------------------------
  // JSON
  // --------------------------------

  const exportJSON = () => {
    if (!medicines.length) {
      alert("No medicine data available.");
      return;
    }

    const json = JSON.stringify(
      medicines,
      null,
      2
    );

    downloadFile(
      json,
      "medicine-stock.json",
      "application/json"
    );
  };

  const handleClearAll = () => {
    if (!medicines.length) {
      return;
    }

    const confirmed = window.confirm(
      "Delete ALL medicine data? This action cannot be undone."
    );

    if (confirmed) {
      clearAllMedicines();
    }
  };

  return (
    <>
      <Navbar />

      <main className="stock-page">

        {/* HEADER */}

        <section className="stock-page-header">

          <div>
            <h1>Available Stock</h1>

            <p>
              View and manage all medicine
              inventory.
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

        {/* SEARCH / FILTER */}

        <section className="stock-toolbar">

          <div className="stock-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search by medicine, company, agency or batch..."
              value={search}
              onChange={handleSearch}
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSearchParams({});
                }}
              >
                <FaTimes />
              </button>
            )}

          </div>

          <button
            type="button"
            className="filter-button"
            onClick={() =>
              setShowFilters(
                (previous) => !previous
              )
            }
          >
            <FaFilter />
            Filters
          </button>

        </section>

        {/* FILTERS */}

        {showFilters && (
          <section className="filters-panel">

            <div className="filter-group">

              <label>
                Agency Name
              </label>

              <select
                value={agencyName}
                onChange={(event) =>
                  setAgencyName(
                    event.target.value
                  )
                }
              >
                {agencyNames.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

            <div className="filter-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Low Stock">
                  Low Stock
                </option>

                <option value="Expiring Soon">
                  Expiring Soon
                </option>

                <option value="Expired">
                  Expired
                </option>
              </select>

            </div>

            <button
              type="button"
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </section>
        )}

        {/* EXPORT */}

        <section className="stock-actions">

          <div className="result-count">
            Showing{" "}
            <strong>
              {filteredMedicines.length}
            </strong>{" "}
            of{" "}
            <strong>
              {medicines.length}
            </strong>{" "}
            medicines
          </div>

          <div className="export-buttons">

            <button
              type="button"
              onClick={exportCSV}
              title="Download CSV"
            >
              <FaFileCsv />
              CSV
            </button>

            <button
              type="button"
              onClick={exportTXT}
              title="Download Text"
            >
              <FaFileAlt />
              TXT
            </button>

            <button
              type="button"
              onClick={exportJSON}
              title="Download JSON"
            >
              <FaFileCode />
              JSON
            </button>

            <button
              type="button"
              className="clear-all-button"
              onClick={handleClearAll}
            >
              <FaTrash />
              Clear All
            </button>

          </div>

        </section>

        {/* CONTENT */}

        <section className="stock-container">

          {filteredMedicines.length === 0 ? (
            <div className="stock-empty">

              <div className="empty-icon">
                {medicines.length === 0
                  ? <img src={emptyIcon} alt="No Medicines" />
                  : "🔍"}
              </div>

              <h2>
              {/* "💊" */}
                {medicines.length === 0
                  ? "No medicines added"
                  : "No medicines found"}
              </h2>

              <p>
                {medicines.length === 0
                  ? "Add your first medicine to start managing your inventory."
                  : "Try changing your search or filters."}
              </p>

              {medicines.length === 0 && (
                <Link
                  to="/medicine"
                  className="primary-button"
                >
                  <FaPlus />
                  Add Medicine
                </Link>
              )}

            </div>
          ) : (
            <>
              {/* Desktop */}

              <div className="desktop-stock">
                <MedicineTable
                  medicines={
                    filteredMedicines
                  }
                  onDelete={
                    deleteMedicine
                  }
                />
              </div>

              {/* Mobile */}

              <div className="mobile-stock">

                {filteredMedicines.map(
                  (medicine) => (
                    <MedicineCard
                      key={medicine.id}
                      medicine={medicine}
                      onDelete={
                        deleteMedicine
                      }
                    />
                  )
                )}

              </div>
            </>
          )}

        </section>

      </main>
    </>
  );
}

export default StockList;