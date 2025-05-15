const apiUrl = "http://localhost:5000";

const Apiclasse = {
  getAllClasse: {
    url: `${apiUrl}/api/getAllclasse`,
    method: "post",
  },

  getAllClasseByEleve: {
    url: `${apiUrl}/api/getAllClasseByEleve`,
    method: "post",
  },

  AjouterClasse: {
    url: `${apiUrl}/api/classe`,
    method: "post",
  },
  modifierClasse: {
    url: `${apiUrl}/api/modifierclasse`,
    method: "post",
  },

  deleteClasse: {
    url: `${apiUrl}/api/deleteClasse`,
    method: "post",
  },
};

export default Apiclasse;
