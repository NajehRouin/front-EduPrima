const apiUrl = "http://localhost:5000";

const ApiEnseignant = {
  login: {
    url: `${apiUrl}/api/loginEns`,
    method: "post",
  },

  getAllEnseignantByClasse: {
    url: `${apiUrl}/api/Allenseignant`,
    method: "post",
  },

  AjouterEnseignant: {
    url: `${apiUrl}/api/enseignant`,
    method: "post",
  },

  CurrentEnseignant: {
    url: `${apiUrl}/api/currentEnseignant`,
    method: "get",
  },

  getclasseEnseignant: {
    url: `${apiUrl}/api/getclasseEnseignant`,
    method: "post",
  },

  coursbyEnseignant: {
    url: `${apiUrl}/api/coursbyEnseignant`,
    method: "post",
  },

  ajouterCours: {
    url: `${apiUrl}/api/cours`,
    method: "POST",
  },

  getactivitesbyCours: {
    url: `${apiUrl}/api/getactivites`,
    method: "POST",
  },

  AjouterActivites: {
    url: `${apiUrl}/api/activite`,
    method: "POST",
  },

  getActivitesById: {
    url: `${apiUrl}/api/getActivitesById`,
    method: "POST",
  },

  getCommantaireByActivites: {
    url: `${apiUrl}/api/findcomment`,
    method: "POST",
  },
  AjouterNote: {
    url: `${apiUrl}/api/note`,
    method: "POST",
  },

  repondreCommentaire: {
    url: `${apiUrl}/api/repondecommentaire`,
    method: "POST",
  },

  getEnseignantsiedBar: {
    url: `${apiUrl}/api/getEnseignantsiedBar`,
    method: "get",
  },

  deleteActivites: {
    url: `${apiUrl}/api/deleteActivites`,
    method: "POST",
  },
};

export default ApiEnseignant;
