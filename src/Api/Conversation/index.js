const apiUrl = "http://localhost:5000";

const Apiconverstaion = {
  send: {
    url: `${apiUrl}/api/conversation/send`,
    method: "POST",
  },
  getConversationByEnseignant: {
    url: `${apiUrl}/api/getConversationByEnseignant`,
    method: "post",
  },

  getConversationByEleve: {
    url: `${apiUrl}/api/getConversationByEleve`,
    method: "post",
  },
};

export default Apiconverstaion;
