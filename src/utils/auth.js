// auth.js

// Exemple : récupérer l'utilisateur depuis le localStorage ou un autre storage sécurisé
export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  return JSON.parse(userStr);
}

// Vérifier si l'utilisateur est connecté
export function isAuthenticated() {
  const user = getCurrentUser();
  return !!user; // retourne true si user existe
}

// Vérifier si l'utilisateur a un rôle spécifique
export function hasRole(role) {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  return user.role === role;
}

// Vérifier si l'utilisateur a l'un des rôles autorisés (par exemple ['admin', 'enseignant'])
export function hasAnyRole(roles = []) {
  const user = getCurrentUser();
  if (!user || !user.role) return false;
  return roles.includes(user.role);
}

export function deconnecte() {
  localStorage.removeItem("user");
}
