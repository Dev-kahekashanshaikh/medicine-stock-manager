import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import MedicineForm from "./pages/MedicineForm";
import StockList from "./pages/StockList";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/medicine"
        element={<MedicineForm />}
      />

      <Route
        path="/medicine/:id"
        element={<MedicineForm />}
      />

      <Route
        path="/stock"
        element={<StockList />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;