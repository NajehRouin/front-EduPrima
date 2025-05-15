import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import EleveRoutes from "./routes/EleveRoutes";
import EnseignantRoutes from "./routes/EnseignantRoutes";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AuthSelection from "./AuthSelection";
import LoginEleve from "./pages/LoginEleve";
import LoginEseignant from "./pages/LoginEseignant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginEleve" element={<LoginEleve />} />
        <Route path="/loginEnseignant" element={<LoginEseignant />} />
        <Route path="/notFound" element={<NotFound />} />

        {/* Routes protégées */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/eleve/*" element={<EleveRoutes />} />

        <Route path="/enseignant/*" element={<EnseignantRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
