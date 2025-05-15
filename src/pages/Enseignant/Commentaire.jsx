import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiEnseignant from "../../Api/Enseignant";

function Commentaire() {
  const location = useLocation();
  const { idActivite } = location.state || {};
  const [commentaire, SetCommentaire] = useState([]);
  const [reponses, setReponses] = useState({}); // Pour stocker les réponses temporaires
  const [activite, setActivite] = useState(null);
  const getCommentiares = async () => {
    try {
      const response = await fetch(
        ApiEnseignant.getCommantaireByActivites.url,
        {
          method: ApiEnseignant.getCommantaireByActivites.method,
          credentials: "include",
          body: JSON.stringify({ idActivite }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      const result = responseData?.result;
      setActivite(result);
      SetCommentaire(result?.commentaire);
    } catch (error) {
      console.log("Erreur :", error);
    }
  };

  const handleInputChange = (id, value) => {
    setReponses({ ...reponses, [id]: value });
  };

  const handleSendResponse = async (idCommentaire) => {
    const reponseText = reponses[idCommentaire];

    // Exemple de requête à adapter selon ton API
    try {
      const response = await fetch(ApiEnseignant.repondreCommentaire.url, {
        method: ApiEnseignant.repondreCommentaire.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idActivite: idActivite,
          idCommentaire: idCommentaire,
          reponse: reponseText,
        }),
      });

      if (response.ok) {
        getCommentiares();
        setReponses((prev) => ({ ...prev, [idCommentaire]: "" }));
      }
    } catch (err) {
      console.error("Erreur d'envoi de la réponse :", err);
    }
  };

  useEffect(() => {
    getCommentiares();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Détails de l'activité</h2>
      {activite && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {activite?.titre}
            </h3>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                activite?.etat === "en_cours"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {activite?.etat === "en_cours" ? "En cours" : "termine"}
            </span>
          </div>

          <p className="text-gray-600 mb-3">
            📄 <strong>Description :</strong> {activite?.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"></div>
        </div>
      )}

      {commentaire && commentaire.length > 0 ? (
        <>
          <h3 className="text-xl font-semibold mb-4">commentaires :</h3>

          {commentaire.map((com) => (
            <div
              key={com._id}
              className="bg-gray-100 p-4 rounded shadow mb-4 max-h-64 overflow-y-auto"
            >
              <div className="text-sm font-semibold text-gray-700">
                {com.eleve}
              </div>
              <div className="text-base text-gray-900">{com.commentaire}</div>
              <div className="text-xs text-gray-500">
                🕒{" "}
                {new Date(com.date || com.datecomment).toLocaleString("fr-FR")}
              </div>

              {com.reponse ? (
                <div className="mt-4 ml-4 border-l-4 border-blue-400 pl-4">
                  <div className="text-sm text-blue-700 font-semibold">
                    👨‍🏫 {com.Enseignant} (enseignant)
                  </div>
                  <div className="text-base text-gray-800">{com.reponse}</div>
                  <div className="text-xs text-gray-500">
                    🕒 {new Date(com.datereponse).toLocaleString("fr-FR")}
                  </div>
                </div>
              ) : (
                <div className="mt-4 ml-4">
                  <textarea
                    placeholder="Votre réponse..."
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                    rows="2"
                    value={reponses[com._id] || ""}
                    onChange={(e) => handleInputChange(com._id, e.target.value)}
                  />
                  <button
                    onClick={() => handleSendResponse(com._id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Répondre a {com.eleve}
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <div className="text-center font-bold text-gray-600 mt-10">
          Aucun commentaire pour l'instant.
        </div>
      )}
    </div>
  );
}

export default Commentaire;
