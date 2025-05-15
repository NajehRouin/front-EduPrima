import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Api from "../../Api/Eleve";
import ModalAjoutEleve from "../../components/ModalAjoutEleve";
import ModalModifierEleve from "../../components/ModalModifierEleve";

function GestionEleves() {
  const [eleves, setEleves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eleveToDelete, setEleveToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eleveToEdit, setEleveToEdit] = useState(null);
  const elevesParPage = 5;
  const [currentPages, setCurrentPages] = useState({}); // chaque classe aura sa page courante

  const getAllEleve = async () => {
    try {
      const dataResponse = await fetch(Api.getAllEleveByClasse.url, {
        method: Api.getAllEleveByClasse.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await dataResponse.json();

      if (response.success) {
        setEleves(
          response.result.map((classe, index) => ({
            ...classe,
            searchTerm: "", // initialise searchTerm
          }))
        );
        // 👉 initialise currentPages
        const initialPages = {};
        response.result.forEach((_, idx) => {
          initialPages[idx] = 1;
        });
        setCurrentPages(initialPages);
      } else {
        setEleves([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllEleve();
  }, []);

  const handleSearchChange = (event, classeIndex) => {
    const searchTerm = event.target.value.toLowerCase();
    setEleves((prevEleves) => {
      const updatedEleves = [...prevEleves];
      updatedEleves[classeIndex].searchTerm = searchTerm;
      return updatedEleves;
    });
    //  Lors d'une recherche, revenir à la première page
    setCurrentPages((prevPages) => ({
      ...prevPages,
      [classeIndex]: 1,
    }));
  };

  const openModal = (classe) => {
    setSelectedClasse(classe);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (eleve) => {
    setEleveToDelete(eleve);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(Api.deletEleve.url, {
        method: Api.deletEleve.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idEleve: eleveToDelete._id }),
      });

      if (response.ok) {
        getAllEleve(); // refresh list
        setShowDeleteModal(false);
      } else {
        console.error("Erreur de suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEleveToDelete(null);
  };

  const handlePageChange = (classeIndex, direction) => {
    setCurrentPages((prevPages) => ({
      ...prevPages,
      [classeIndex]: prevPages[classeIndex] + direction,
    }));
  };

  const handleEditClick = (eleve) => {
    setEleveToEdit(eleve);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Liste des élèves par classe
      </h1>

      {eleves.map((classe, idx) => {
        const filteredEleves = classe.eleves.filter((eleve) =>
          eleve.nom
            .toLowerCase()
            .includes(classe.searchTerm?.toLowerCase() || "")
        );

        const indexOfLastEleve = currentPages[idx] * elevesParPage;
        const indexOfFirstEleve = indexOfLastEleve - elevesParPage;
        const currentEleves = filteredEleves.slice(
          indexOfFirstEleve,
          indexOfLastEleve
        );

        const totalPages = Math.ceil(filteredEleves.length / elevesParPage);

        return (
          <div key={idx} className="mb-10">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="text-xl font-semibold text-blue-600">
                {classe.nomClasse} - {classe.niveau}
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rechercher un élève"
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={classe.searchTerm || ""}
                  onChange={(e) => handleSearchChange(e, idx)}
                />
                <button
                  onClick={() => openModal(classe)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-center">Nom</th>
                    <th className="py-2 px-4 border-b text-center">Email</th>
                    <th className="py-2 px-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEleves.map((eleve) => (
                    <tr key={eleve._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">
                        {eleve.nom}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {eleve.email}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleEditClick(eleve)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(eleve)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {currentEleves.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-4 text-center text-gray-400"
                      >
                        Aucun élève trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => handlePageChange(idx, -1)}
                disabled={currentPages[idx] === 1 || totalPages === 0}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-4 py-2">
                Page {totalPages === 0 ? 0 : currentPages[idx]} /{" "}
                {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(idx, 1)}
                disabled={currentPages[idx] === totalPages || totalPages === 0}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        );
      })}

      {/* Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Confirmer la suppression
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Êtes-vous sûr de vouloir supprimer {eleveToDelete?.nom} ?
            </p>
            <div className="flex justify-around">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && eleveToEdit && (
        <ModalModifierEleve
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          eleve={eleveToEdit}
          fetchData={getAllEleve}
        />
      )}

      {isModalOpen && (
        <ModalAjoutEleve
          fetchdata={getAllEleve}
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          selectedClasse={selectedClasse}
        />
      )}
    </div>
  );
}

export default GestionEleves;
