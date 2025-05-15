import axios from "axios";

// Créer une instance Axios avec la baseURL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // ⬅️ Ici tu mets l'URL de ton backend
});

export default api;
