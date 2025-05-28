const apiUrl = "http://localhost:5000";

const ApiSpecialite = {
  AjouterSpecialite: {
    url: `${apiUrl}/api/specialite`,
    method: "post",
  },

  getAllSpecialite: {
    url: `${apiUrl}/api/specialite`,
    method: "GET",
  },
};

export default ApiSpecialite;
