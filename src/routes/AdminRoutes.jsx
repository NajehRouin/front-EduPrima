// AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../utils/auth";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import GestionEleves from "../pages/Admin/GestionEleves";
import GestionEnseignant from "../pages/Admin/GestionEnseignant";
import GestionClasse from "../pages/Admin/GestionClasse";

function AdminRoutes() {
  if (!isAuthenticated() || !hasRole("Admin")) {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="dashboard" element={<DashboardAdmin />}>
        <Route path="eleves" element={<GestionEleves />} />
        <Route path="enseignants" element={<GestionEnseignant />} />
        <Route path="classes" element={<GestionClasse />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
