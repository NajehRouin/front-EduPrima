import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ApiEnseignant from "../../Api/Enseignant";

function DetailsDepot() {
  const location = useLocation();
  const { idActivite } = location.state || {};

  const [depot, setDepot] = useState([]);
  const [activite, setActivite] = useState(null);
  const [dateStatus, setDateStatus] = useState("");
  const [nombreDepot, SetNombreDepot] = useState(0);

  const [selectedDepot, setSelectedDepot] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const openNoteModal = (depot, isEdit) => {
    setSelectedDepot(depot);
    setNoteInput(depot.note || "");
    setIsEditMode(isEdit);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDepot(null);
    setNoteInput("");
    setIsEditMode(false);
  };

  const getDepots = async () => {
    try {
      const response = await fetch(ApiEnseignant.getActivitesById.url, {
        method: ApiEnseignant.getActivitesById.method,
        credentials: "include",
        body: JSON.stringify({ idActivite }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const result = responseData?.result;
      SetNombreDepot(responseData?.nombreDepot);
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

  const handleNoteSubmit = async () => {
    console.log("Note soumise :", noteInput, "pour l'ID", selectedDepot._id);

    try {
      const response = await fetch(ApiEnseignant.AjouterNote.url, {
        method: ApiEnseignant.AjouterNote.method,
        credentials: "include",
        body: JSON.stringify({ id: selectedDepot._id, note: noteInput }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      if (responseData?.success) {
        getDepots();
        closeModal();
      }
    } catch (error) {
      console.log("Erreur :", error);
    }
  };
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

            <div className="flex items-center gap-2">
              <span className="text-gray-500">👥</span>
              <p className="text-gray-700">
                <strong>Nombre de dépôts :</strong> {nombreDepot}
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
                <button
                  onClick={() => openNoteModal(item, true)}
                  className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                >
                  Modifier une note
                </button>
              ) : (
                <button
                  onClick={() => openNoteModal(item, false)}
                  className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                >
                  Ajouter une note
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun dépôt trouvé.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Modifier la note" : "Ajouter une note"}
            </h2>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Note :
            </label>
            <input
              type="number"
              min="0"
              max="20"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleNoteSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {isEditMode ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailsDepot;
