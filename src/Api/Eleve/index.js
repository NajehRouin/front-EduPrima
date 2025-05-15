const apiUrl = "http://localhost:5000";

const Api = {
  login: {
    url: `${apiUrl}/api/loginEleve`,
    method: "post",
  },

  //api cours

  getMesCours: {
    url: `${apiUrl}/api/coursByEleve`,
    method: "post",
  },

  getAllEleveByClasse: {
    url: `${apiUrl}/api/eleveByclasse`,
    method: "post",
  },

  AjouterEleve: {
    url: `${apiUrl}/api/eleve`,
    method: "post",
  },

  getDepotByEleve: {
    url: `${apiUrl}/api/getDepotByEleve`,
    method: "POST",
  },

  addDepot: {
    url: `${apiUrl}/api/soumission`,
    method: "POST",
  },

  ModifierDepot: {
    url: `${apiUrl}/api/modifiersoumission`,
    method: "POST",
  },

  deletEleve: {
    url: `${apiUrl}/api/supprimerEleve`,
    method: "POST",
  },

  modifierEleve: {
    url: `${apiUrl}/api/modiferEleve`,
    method: "POST",
  },

  createCommentaire: {
    url: `${apiUrl}/api/createCommentaire`,
    method: "POST",
  },

  notification: {
    url: `${apiUrl}/api/notification`,
    method: "get",
  },
};

export default Api;
