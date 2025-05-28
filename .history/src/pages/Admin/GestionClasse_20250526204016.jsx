import React, { useEffect, useState } from "react";
import Apiclasse from "../../Api/classe";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ModalAjoutClasse from "../../components/ModalAjoutClasse";
import AjouterEleve from "../../components/AjouterEleve";
import ModalModifierClasse from "../../components/ModalModifierClasse";
import AjouterProfesseur from "../../components/AjouterProfesseur";
import AjouterSpecialite from "../../components/AjouterSpecialite";

function GestionClasse() {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 3;
  const [showModal, setShowModal] = useState(false);
  const [showModalEleve, setShowModalEleve] = useState(false);
  const [showModalProf, setShowModalProf] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [classeToEdit, setClasseToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classeToDelete, setClasseToDelete] = useState(null);
  const [showModalSpecialite, setShowModalSpecialite] = useState(false);

  const fetchClasses = async () => {
    try {
      const dataResponse = await fetch(Apiclasse.getAllClasseByEleve.url, {
        method: Apiclasse.getAllClasseByEleve.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await dataResponse.json();
      setClasses(data.result || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des classes:", error);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(
    (classe) =>
      classe.nomClasse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classe.niveau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);
  const paginatedData = filteredClasses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleEdit = (classe) => {
    setClasseToEdit(classe);
    setShowEditModal(true);
  };

  const handleDelete = (classe) => {
    setClasseToDelete(classe);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setClasseToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(Apiclasse.deleteClasse.url, {
        method: Apiclasse.deleteClasse.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idClass: classeToDelete._id }),
      });

      if (response.ok) {
        fetchClasses(); // refresh list
        setShowDeleteModal(false);
      } else {
        console.error("Erreur de suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-6xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher une classe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Ajouter Classe
          </button>
          <button
            onClick={() => setShowModalEleve(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Ajouter Élève
          </button>
          <button
            onClick={() => setShowModalProf(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Ajouter Enseignant
          </button>
          <button
            onClick={() => setShowModalSpecialite(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            Ajouter Spécialité
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-800 text-sm font-semibold">
            <tr>
              <th className="px-6 py-3 text-left">Niveau</th>
              <th className="px-6 py-3 text-left">Nom de la classe</th>
              <th className="px-6 py-3 text-left">Nombre des élève</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData?.map((classe) => (
                <tr key={classe._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{classe.niveau}</td>
                  <td className="px-6 py-4 capitalize">{classe.nomClasse}</td>
                  <td className="px-6 py-4 capitalize">
                    {classe.nombreEleves}
                  </td>
                  <td className="px-6 py-4 flex gap-4 items-center">
                    <button
                      onClick={() => handleEdit(classe)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Modifier"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(classe)}
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  Aucune classe trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>

      {/*modal supprime */}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-xl w-96 relative">
            <div className="flex items-center justify-center mb-4">
              <div className="text-red-600 text-4xl mr-2">⚠️</div>
              <h2 className="text-xl font-semibold text-red-700">
                Confirmation de suppression
              </h2>
            </div>
            <p className="text-gray-700 text-center mb-2">
              Êtes-vous sûr de vouloir supprimer la classe{" "}
              <span className="font-semibold text-black">
                {classeToDelete?.nomClasse}
              </span>{" "}
              ?
            </p>
            <p className="text-sm text-center text-red-600 mb-6">
              Cette action est irréversible. Toutes les données associées seront
              également supprimées.
            </p>
            <div className="flex justify-around">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout (placeholder) */}

      {showModal && (
        <ModalAjoutClasse
          fetchdata={fetchClasses}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModalEleve && (
        <AjouterEleve
          fetchdata={fetchClasses}
          isOpen={showModalEleve}
          closeModal={() => setShowModalEleve(false)}
        />
      )}

      {showModalProf && (
        <AjouterProfesseur
          isOpen={showModalProf}
          fetchdata={fetchClasses}
          closeModal={() => setShowModalProf(false)}
        />
      )}

      {showEditModal && (
        <ModalModifierClasse
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          classeToEdit={classeToEdit}
          fetchdata={fetchClasses}
        />
      )}

      {showModalSpecialite && (
        <AjouterSpecialite
          isOpen={showModalSpecialite}
          onClose={() => setShowModalSpecialite(false)}
          fetchdata={fetchClasses}
        />
      )}
    </div>
  );
}

export default GestionClasse;
