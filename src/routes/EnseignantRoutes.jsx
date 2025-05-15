// EnseignantRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../utils/auth";
import DashboardEnseignant from "../pages/Enseignant/DashboardEnseignant";
import GestionCours from "../pages/Enseignant/GestionCours";
import ListEleve from "../pages/Enseignant/ListEleve";
import ResourcePage from "../pages/Eleve/ResourcePage";
import GeresActivites from "../pages/Enseignant/GeresActivites";
import DetailsDepot from "../pages/Enseignant/DetailsDepot";
import Commentaire from "../pages/Enseignant/Commentaire";
import Chat from "../pages/Enseignant/Chat";

function EnseignantRoutes() {
  if (!isAuthenticated() || !hasRole("Enseignant")) {
    return <Navigate to="/notFound" />;
  }

  return (
    <Routes>
      <Route path="dashboard" element={<DashboardEnseignant />}>
        <Route path="" element={<ListEleve />} />
        <Route path="cours" element={<GestionCours />} />
        <Route path="resource" element={<ResourcePage />} />
        <Route path="activites" element={<GeresActivites />} />
        <Route path="voirDpot" element={<DetailsDepot />} />
        <Route path="commentaires" element={<Commentaire />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default EnseignantRoutes;
