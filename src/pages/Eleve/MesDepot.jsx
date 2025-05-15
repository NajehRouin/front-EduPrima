import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Api from "../../Api/Eleve";
import DepotModal from "../../components/DepotModal"; // ajuste le chemin si nécessaire
import ModifierDepot from "../../components/ModifierDepot";

function MesDepot() {
  const location = useLocation();

  const { idActivite } = location.state || {};

  const [depot, setDepot] = useState([]);
  const [activite, setActivite] = useState(null);

  const [dateStatus, setDateStatus] = useState("");

  const getDepots = async () => {
    try {
      const response = await fetch(Api.getDepotByEleve.url, {
        method: Api.getDepotByEleve.method,
        credentials: "include",
        body: JSON.stringify({ idActivite }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const result = responseData?.result;

      setDepot(result?.depot || []);
      setActivite(result);

      const now = new Date();
      const deadline = new Date(result?.dateLimite);
      if (deadline < now) {
        setDateStatus("Délai dépassé");
      } else {
        const diff = deadline - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        // Format : Il reste x jour(s) y heure(s) z minute(s)
        setDateStatus(
          `Il reste ${days} jour(s), ${hours} heure(s), ${minutes} minute(s)`
        );
      }
    } catch (error) {
      console.log("Erreur :", error);
    }
  };

  useEffect(() => {
    getDepots();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [showModalModifier, setShowModalModifier] = useState(false);
  const [idDepot, SetIdDepot] = useState();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Détails de l'activité</h2>
      {activite && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {activite.titre}
            </h3>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                activite.etat === "en_cours"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {activite.etat === "en_cours" ? "En cours" : "termine"}
            </span>
          </div>

          <p className="text-gray-600 mb-3">
            📄 <strong>Description :</strong> {activite.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">📅</span>
              <p className="text-gray-700">
                <strong>Date limite :</strong>{" "}
                {new Date(activite.dateLimite).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500">⏳</span>
              <p
                className={`font-semibold ${
                  dateStatus.includes("dépassé")
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {dateStatus}
              </p>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">Dépôts :</h3>
      {depot.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {depot.map((item) => (
            <div
              key={item._id}
              className="border border-gray-300 rounded-md p-4 bg-gray-50 shadow-sm"
            >
              <p>
                <strong>Nom élève :</strong> {item.idEleve?.nom}
              </p>
              <p>
                <strong>Email :</strong> {item.idEleve?.email}
              </p>
              <p>
                <strong>Fichier :</strong>{" "}
                <a
                  href={item.fichier}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Voir le fichier
                </a>
              </p>
              <p>
                <strong>Note :</strong>{" "}
                {item.note ? (
                  item.note
                ) : (
                  <span className="text-gray-500 italic">Non noté</span>
                )}
              </p>
              <p>
                <strong>Date de dépôt :</strong>{" "}
                {new Date(item.dateDepot).toLocaleDateString()}
              </p>

              {item.note ? (
                <></>
              ) : (
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded ${
                    dateStatus.includes("dépassé")
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={dateStatus.includes("dépassé")}
                  onClick={() => {
                    setShowModalModifier(true);
                    SetIdDepot(item?._id);
                  }}
                >
                  modifier depot
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="mb-4">Aucun dépôt trouvé.</p>
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded ${
              dateStatus.includes("dépassé")
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={dateStatus.includes("dépassé")}
            onClick={() => setShowModal(true)}
          >
            Faire un dépôt
          </button>
        </div>
      )}

      {showModal && (
        <DepotModal
          show={showModal}
          onClose={() => setShowModal(false)}
          fetchData={getDepots}
          activite={activite}
        />
      )}

      {showModalModifier && (
        <ModifierDepot
          show={showModalModifier}
          onClose={() => setShowModalModifier(false)}
          fetchData={getDepots}
          activite={activite}
          idDepot={idDepot}
        />
      )}
    </div>
  );
}

export default MesDepot;
