import api from "./api";

// Login Admin
export async function loginAdmin(email, motDePasse) {
  const response = await api.post("/admin/login", { email, motDePasse });
  return response.data;
}

// Login Élève
export async function loginEleve(email, motDePasse) {
  const response = await api.post("/loginEleve", { email, motDePasse });
  console.log("responsone", response?.data);
  return response.data;
}

// Login Enseignant
export async function loginEnseignant(email, motDePasse) {
  const response = await api.post("/loginEns", { email, motDePasse });
  return response.data;
}
