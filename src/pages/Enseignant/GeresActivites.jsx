import { useLocation } from "react-router-dom";
import { FaEye, FaCommentDots } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import AjouterActivites from "../../components/AjouterActivites";
import { useEffect, useState } from "react";
import ApiEnseignant from "../../Api/Enseignant";
import { FaTrash } from "react-icons/fa"; //
import { useNavigate } from "react-router-dom";
import SupprimeActivites from "../../components/SupprimeActivites";

const GeresActivites = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { titre, idCours } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activites, SetActivites] = useState([]);

  const getActivitesCours = async () => {
    try {
      const response = await fetch(ApiEnseignant.getactivitesbyCours.url, {
        method: ApiEnseignant.getactivitesbyCours.method,
        credentials: "include",
        body: JSON.stringify({ idCours: idCours }),
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData = await response.json();

      SetActivites(responseData?.result || []);
    } catch (error) {
      console.log("er", error);
    }
  };

  useEffect(() => {
    getActivitesCours();
  }, [idCours]);

  const [showModal, setShowModal] = useState(false);

  const totalPages = Math.ceil(activites.length / itemsPerPage);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      const newPage = prev + direction;
      if (newPage < 1 || newPage > totalPages) return prev;
      return newPage;
    });
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActivites = activites.slice(indexOfFirstItem, indexOfLastItem);

  const openDeleteModal = (id) => {
    setSelectedActivityId(id);
    setIsDeleteModalOpen(true);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Activités pour le cours : {titre}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Ajouter Activité
        </button>
      </div>
      {activites?.length ? (
        <>
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4">Titre</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Date Limite</th>
                <th className="py-2 px-4">État</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentActivites?.map((act) => (
                <tr key={act._id} className="border-b">
                  <td className="py-2 px-4">{act.titre}</td>
                  <td className="py-2 px-4">{act.description}</td>
                  <td className="py-2 px-4">
                    {new Date(act.dateLimite).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{act.etat}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-4 text-blue-600 text-lg">
                      <button
                        title="Voir Dépôts"
                        onClick={() =>
                          navigate("/enseignant/dashboard/voirDpot", {
                            state: {
                              idActivite: act._id,
                            },
                          })
                        }
                      >
                        <FaFileAlt />
                      </button>
                      <button
                        title="Voir Commentaires"
                        onClick={() =>
                          navigate("/enseignant/dashboard/commentaires", {
                            state: {
                              idActivite: act._id,
                            },
                          })
                        }
                      >
                        <FaCommentDots />
                      </button>

                      <button
                        title="Supprimer Activité"
                        onClick={() => openDeleteModal(act._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activites.length > 0 && (
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => handlePageChange(-1)}
                disabled={currentPage === 1 || totalPages === 0}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-4 py-2">
                Page {totalPages === 0 ? 0 : currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Aucune activité trouvée.</p>
      )}

      {showModal && (
        <AjouterActivites
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          classeId={idCours}
          fetchdata={getActivitesCours}
        />
      )}
      {isDeleteModalOpen && (
        <SupprimeActivites
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          idActivite={selectedActivityId}
          fetchdata={getActivitesCours}
          deleteUrl={ApiEnseignant.deleteActivites.url}
          deleteMethod={ApiEnseignant.deleteActivites.method}
        />
      )}
    </div>
  );
};

export default GeresActivites;
