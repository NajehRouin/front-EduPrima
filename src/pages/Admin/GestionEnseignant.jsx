import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ApiEnseignant from "../../Api/Enseignant";
import AjouterEnseignant from "../../components/AjouterEnseignant";

const enseignantsParPage = 5;

function GestionEnseignant() {
  const [classes, setClasses] = useState([]);
  const [currentPages, setCurrentPages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [enseignantToDelete, setEnseignantToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(ApiEnseignant.getAllEnseignantByClasse.url, {
        method: ApiEnseignant.getAllEnseignantByClasse.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        const updated = data.result.map((classe) => ({
          ...classe,
          searchTerm: "",
        }));
        setClasses(updated);
        setCurrentPages(new Array(data.result.length).fill(1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e, idx) => {
    const updated = [...classes];
    updated[idx].searchTerm = e.target.value;
    setClasses(updated);
  };

  const handlePageChange = (idx, direction) => {
    const newPages = [...currentPages];
    newPages[idx] += direction;
    setCurrentPages(newPages);
  };

  const openModal = (classe) => {
    setSelectedClasse(classe);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (enseignant) => {
    setEnseignantToDelete(enseignant);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // TODO: delete logic
    setShowDeleteModal(false);
    setEnseignantToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEnseignantToDelete(null);
  };

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Liste des enseignants par classe
      </h1>

      {classes.map((classe, idx) => {
        const filtered = classe.enseignants.filter((ens) =>
          ens.nom.toLowerCase().includes(classe.searchTerm?.toLowerCase() || "")
        );

        const indexOfLast = currentPages[idx] * enseignantsParPage;
        const indexOfFirst = indexOfLast - enseignantsParPage;
        const current = filtered.slice(indexOfFirst, indexOfLast);
        const totalPages = Math.ceil(filtered.length / enseignantsParPage);

        return (
          <div key={idx} className="mb-10">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="text-xl font-semibold text-blue-600">
                {classe.nomClasse} - {classe.niveau}
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rechercher un enseignant"
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
                    <th className="py-2 px-4 border-b text-center">
                      Spécialité
                    </th>
                    <th className="py-2 px-4 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {current.map((ens) => (
                    <tr key={ens._id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">
                        {ens.nom}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {ens.email}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {ens.specialite}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <div className="flex justify-center gap-4">
                          <button className="text-blue-500 hover:text-blue-700">
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteClick(ens)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {current.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 text-center text-gray-400"
                      >
                        Aucun enseignant trouvé.
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

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Confirmer la suppression
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Supprimer {enseignantToDelete?.nom} ?
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

      {/* Modal d'ajout (placeholder) */}
      {isModalOpen && (
        <AjouterEnseignant
          fetchdata={fetchData}
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          selectedClasse={selectedClasse}
        />
      )}
    </div>
  );
}

export default GestionEnseignant;
