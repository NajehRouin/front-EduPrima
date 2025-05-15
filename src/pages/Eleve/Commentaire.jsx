import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiEnseignant from "../../Api/Enseignant";
import Api from "../../Api/Eleve";

function Commentaire() {
  const location = useLocation();
  const { idActivite } = location.state || {};
  const [commentaire, SetCommentaire] = useState([]);

  const [activite, setActivite] = useState(null);
  const [nouveauCommentaire, setNouveauCommentaire] = useState("");
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

  const envoyerNouveauCommentaire = async () => {
    try {
      const response = await fetch(Api.createCommentaire.url, {
        method: Api.createCommentaire.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: idActivite,

          commentaire: nouveauCommentaire,
        }),
      });

      if (response.ok) {
        setNouveauCommentaire("");
        getCommentiares();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
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
          <h3 className="text-xl font-semibold mb-4">Commentaires :</h3>
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

              {com.reponse && (
                <div className="mt-4 ml-4 border-l-4 border-blue-400 pl-4">
                  <div className="text-sm text-blue-700 font-semibold">
                    👨‍🏫 {com.Enseignant} (enseignant)
                  </div>
                  <div className="text-base text-gray-800">{com.reponse}</div>
                  <div className="text-xs text-gray-500">
                    🕒 {new Date(com.datereponse).toLocaleString("fr-FR")}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="text-center mt-10">
            <textarea
              placeholder="Ajouter un commentaire..."
              className="w-full p-3 border border-gray-300 rounded mb-2"
              rows="3"
              value={nouveauCommentaire}
              onChange={(e) => setNouveauCommentaire(e.target.value)}
            />
            <button
              onClick={envoyerNouveauCommentaire}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Envoyer le commentaire
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-10">
          <div className="font-bold text-gray-600 mb-4">
            Aucun commentaire pour l'instant.
          </div>
          <textarea
            placeholder="Ajouter un commentaire..."
            className="w-full p-3 border border-gray-300 rounded mb-2"
            rows="3"
            value={nouveauCommentaire}
            onChange={(e) => setNouveauCommentaire(e.target.value)}
          />
          <button
            onClick={envoyerNouveauCommentaire}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Envoyer le commentaire
          </button>
        </div>
      )}
    </div>
  );
}

export default Commentaire;
