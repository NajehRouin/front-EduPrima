// EleveRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../utils/auth";
import DashboardEleve from "../pages/Eleve/DashboardEleve";
import Cours from "../pages/Eleve/Cours";
import ResourcePage from "../pages/Eleve/ResourcePage";
import MesActivites from "../pages/Eleve/MesActivites";
import MesDepot from "../pages/Eleve/MesDepot";
import Commentaire from "../pages/Eleve/Commentaire";

import ChatEleve from "../pages/Eleve/ChatEleve";

function EleveRoutes() {
  if (!isAuthenticated() || !hasRole("Eleve")) {
    return <Navigate to="/notFound" />;
  }

  return (
    <Routes>
      <Route path="dashboard" element={<DashboardEleve />}>
        <Route path="" element={<Cours />} />
        <Route path="resource" element={<ResourcePage />} />
        <Route path="activites" element={<MesActivites />} />
        <Route path="voirDpot" element={<MesDepot />} />
        <Route path="commentaires" element={<Commentaire />} />

        <Route path="chat" element={<ChatEleve />} />
      </Route>
    </Routes>
  );
}

export default EleveRoutes;
