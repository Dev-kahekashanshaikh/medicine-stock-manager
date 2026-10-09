import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const MedicineContext = createContext();

const STORAGE_KEY = "medicineStockManager";

// =========================================================
// GET MEDICINES FROM LOCAL STORAGE
// =========================================================

const getStoredMedicines = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);

    return Array.isArray(parsedData)
      ? parsedData
      : [];
  } catch (error) {
    console.error(
      "Error reading localStorage:",
      error
    );

    return [];
  }
};

// =========================================================
// CREATE UNIQUE ID
// =========================================================

const createId = () => {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}`;
};

// =========================================================
// MEDICINE PROVIDER
// =========================================================

export const MedicineProvider = ({ children }) => {
  // =======================================================
  // MEDICINE STATE
  // =======================================================

  const [medicines, setMedicines] = useState(
    getStoredMedicines
  );

  // =======================================================
  // SAVE DATA TO LOCAL STORAGE
  // =======================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(medicines)
      );
    } catch (error) {
      console.error(
        "Error saving medicines to localStorage:",
        error
      );
    }
  }, [medicines]);

  // =======================================================
  // ADD MEDICINE
  // =======================================================

  const addMedicine = (data) => {
    const name = String(
      data?.name ?? ""
    ).trim();

    const company = String(
      data?.company ?? ""
    ).trim();

    const agencyName = String(
      data?.agencyName ?? ""
    ).trim();

    const batch = String(
      data?.batch ?? ""
    ).trim();

    const expiry = String(
      data?.expiry ?? ""
    ).trim();

    const purchase =
      Number(data?.purchase) || 0;

    const sales =
      Number(data?.sales) || 0;

    const minimum =
      Number(data?.minimum) || 0;

    const price =
      Number(data?.price) || 0;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (!name) {
      return {
        success: false,
        message: "Medicine name is required.",
      };
    }

    if (!expiry) {
      return {
        success: false,
        message: "Expiry date is required.",
      };
    }

    if (purchase < 0) {
      return {
        success: false,
        message:
          "Purchase quantity cannot be negative.",
      };
    }

    if (sales < 0) {
      return {
        success: false,
        message:
          "Sales quantity cannot be negative.",
      };
    }

    if (minimum < 0) {
      return {
        success: false,
        message:
          "Minimum stock cannot be negative.",
      };
    }

    if (price < 0) {
      return {
        success: false,
        message:
          "Purchase price cannot be negative.",
      };
    }

    // Sales cannot be greater than purchase
    if (sales > purchase) {
      return {
        success: false,
        message:
          "Sales quantity cannot be greater than purchase quantity.",
      };
    }

    // -----------------------------------------------------
    // CHECK DUPLICATE
    // -----------------------------------------------------

    const duplicate = medicines.some(
      (medicine) =>
        String(medicine.name ?? "")
          .toLowerCase() === name.toLowerCase() &&
        String(medicine.batch ?? "")
          .toLowerCase() === batch.toLowerCase()
    );

    if (duplicate) {
      return {
        success: false,
        message:
          "This medicine with the same batch already exists.",
      };
    }

    // -----------------------------------------------------
    // CREATE MEDICINE
    // -----------------------------------------------------

    const newMedicine = {
      id: createId(),

      name,
      company,
      agencyName, // Added
      batch,
      expiry,

      purchase,
      sales,

      stock: Math.max(
        0,
        purchase - sales
      ),

      minimum,
      price,
    };

    // -----------------------------------------------------
    // ADD TO STATE
    // -----------------------------------------------------

    setMedicines((previous) => [
      ...previous,
      newMedicine,
    ]);

    return {
      success: true,
      message: "Medicine added successfully.",
    };
  };

  // =======================================================
  // UPDATE MEDICINE
  // =======================================================

  const updateMedicine = (id, data) => {
    const currentMedicine = medicines.find(
      (medicine) => medicine.id === id
    );

    if (!currentMedicine) {
      return {
        success: false,
        message: "Medicine not found.",
      };
    }

    const name = String(
      data?.name ?? ""
    ).trim();

    const company = String(
      data?.company ?? ""
    ).trim();

    const agencyName = String(
      data?.agencyName ?? ""
    ).trim();

    const batch = String(
      data?.batch ?? ""
    ).trim();

    const expiry = String(
      data?.expiry ?? ""
    ).trim();

    const purchase =
      Number(data?.purchase) || 0;

    const sales =
      Number(data?.sales) || 0;

    const minimum =
      Number(data?.minimum) || 0;

    const price =
      Number(data?.price) || 0;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (!name) {
      return {
        success: false,
        message: "Medicine name is required.",
      };
    }

    if (!expiry) {
      return {
        success: false,
        message: "Expiry date is required.",
      };
    }

    if (purchase < 0) {
      return {
        success: false,
        message:
          "Purchase quantity cannot be negative.",
      };
    }

    if (sales < 0) {
      return {
        success: false,
        message:
          "Sales quantity cannot be negative.",
      };
    }

    if (minimum < 0) {
      return {
        success: false,
        message:
          "Minimum stock cannot be negative.",
      };
    }

    if (price < 0) {
      return {
        success: false,
        message:
          "Purchase price cannot be negative.",
      };
    }

    // -----------------------------------------------------
    // AVAILABLE STOCK
    // -----------------------------------------------------

    const availableStock =
      Number(currentMedicine.stock || 0) +
      purchase;

    if (sales > availableStock) {
      return {
        success: false,
        message: `Sales quantity cannot be greater than available stock (${availableStock}).`,
      };
    }

    // -----------------------------------------------------
    // CHECK DUPLICATE
    // -----------------------------------------------------

    const duplicate = medicines.some(
      (medicine) =>
        medicine.id !== id &&
        String(medicine.name ?? "")
          .toLowerCase() === name.toLowerCase() &&
        String(medicine.batch ?? "")
          .toLowerCase() === batch.toLowerCase()
    );

    if (duplicate) {
      return {
        success: false,
        message:
          "Another medicine with the same name and batch already exists.",
      };
    }

    // -----------------------------------------------------
    // UPDATE STATE
    // -----------------------------------------------------

    setMedicines((previous) =>
      previous.map((medicine) => {
        if (medicine.id !== id) {
          return medicine;
        }

        return {
          ...medicine,

          name,
          company,
          agencyName, // Added
          batch,
          expiry,

          purchase,
          sales,

          minimum,
          price,

          stock: Math.max(
            0,
            Number(
              currentMedicine.stock || 0
            ) +
            purchase -
            sales
          ),
        };
      })
    );

    return {
      success: true,
      message:
        "Medicine updated successfully.",
    };
  };

  // =======================================================
  // GET MEDICINE BY ID
  // =======================================================

  const getMedicineById = (id) => {
    return medicines.find(
      (medicine) => medicine.id === id
    );
  };

  // =======================================================
  // DELETE MEDICINE
  // =======================================================

  const deleteMedicine = (id) => {
    setMedicines((previous) =>
      previous.filter(
        (medicine) => medicine.id !== id
      )
    );
  };

  // =======================================================
  // CLEAR ALL MEDICINES
  // =======================================================

  const clearAllMedicines = () => {
    setMedicines([]);
  };

  // =======================================================
  // TOTAL UNITS
  // =======================================================

  const totalUnits = medicines.reduce(
    (total, medicine) =>
      total +
      Number(medicine.stock || 0),
    0
  );

  // =======================================================
  // LOW STOCK MEDICINES
  // =======================================================

  const lowStockMedicines =
    medicines.filter(
      (medicine) =>
        Number(medicine.stock || 0) <=
        Number(medicine.minimum || 0)
    );

  // =======================================================
  // EXPIRED MEDICINES
  // =======================================================

  const expiredMedicines =
    medicines.filter((medicine) => {
      if (!medicine.expiry) {
        return false;
      }

      const expiryDate = new Date(
        `${medicine.expiry}T00:00:00`
      );

      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      return expiryDate < today;
    });

  // =======================================================
  // EXPIRING WITHIN 30 DAYS
  // =======================================================

  const expiringMedicines =
    medicines.filter((medicine) => {
      if (!medicine.expiry) {
        return false;
      }

      const expiryDate = new Date(
        `${medicine.expiry}T00:00:00`
      );

      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const difference = Math.ceil(
        (expiryDate - today) /
        (1000 * 60 * 60 * 24)
      );

      return (
        difference >= 0 &&
        difference <= 30
      );
    });

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  return (
    <MedicineContext.Provider
      value={{
        medicines,

        addMedicine,

        updateMedicine,

        getMedicineById,

        deleteMedicine,

        clearAllMedicines,

        totalUnits,

        lowStockMedicines,

        expiredMedicines,

        expiringMedicines,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useMedicine = () => {
  const context = useContext(
    MedicineContext
  );

  if (!context) {
    throw new Error(
      "useMedicine must be used inside MedicineProvider"
    );
  }

  return context;
};