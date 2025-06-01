import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import ApiEnseignant from "../../Api/Enseignant";
import AjouterCoursModal from "../../components/AjouterCoursModal";
import { useNavigate } from "react-router-dom";
import AjouterCoursGeneralModal from "../../components/AjouterCoursGeneralModal ";
const CoursCard = ({
  titre,
  description,
  dateCreation,
  activites,
  onDelete,
  detais,
  gereActivite,
}) => {
  const date = new Date(dateCreation);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  const numberOfActivities = activites.length;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-4 w-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">{titre}</h3>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      </div>
      <p className="text-gray-600">{description}</p>
      <p className="text-gray-500 mt-2">Créé le: {formattedDate}</p>
      <p className="text-gray-500 mt-2">
        Nombre d'activités: {numberOfActivities}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={detais}
        >
          Voir Détails
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={gereActivite}
        >
          Gérer les Activités
        </button>
      </div>
    </div>
  );
};

const CoursGroupes = ({ data, onAddCours }) => {
  const [pagination, setPagination] = useState({});
  const [searchTerms, setSearchTerms] = useState({}); // 🆕 chaque classe a son propre champ de recherche
  const navigate = useNavigate();
  const itemsPerPage = 3;

  const handlePageChange = (classeId, direction) => {
    setPagination((prev) => {
      const currentPage = prev[classeId] || 1;
      const newPage =
        direction === "next" ? currentPage + 1 : Math.max(currentPage - 1, 1);
      return { ...prev, [classeId]: newPage };
    });
  };

  const handleSearchChange = (classeId, value) => {
    setSearchTerms((prev) => ({ ...prev, [classeId]: value }));
  };

  const handleVoirPlus = (lienUrl) => {
    if (lienUrl) {
      navigate(
        `/enseignant/dashboard/resource?url=${encodeURIComponent(lienUrl)}`
      );
    } else {
      console.error("Lien URL non disponible");
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {data.map((classe) => {
        const currentPage = pagination[classe._id] || 1;
        const searchTerm = searchTerms[classe._id] || "";

        const filteredCours = classe.cours.filter((cours) =>
          cours.titre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedCours = filteredCours.slice(
          startIndex,
          startIndex + itemsPerPage
        );
        const totalPages = Math.ceil(filteredCours.length / itemsPerPage);

        return (
          <div key={classe._id} className="w-full p-4">
            <div className="bg-gray-200 p-4 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{classe.nomClasse}</h2>
                  <h3 className="text-xl text-gray-600">{classe.niveau}</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  {/* Champ de recherche par classe */}
                  <input
                    type="text"
                    placeholder="Rechercher un cours..."
                    className="px-2 py-1 rounded border border-gray-300"
                    value={searchTerm}
                    onChange={(e) =>
                      handleSearchChange(classe._id, e.target.value)
                    }
                  />
                  <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                    onClick={() => onAddCours(classe)}
                  >
                    Ajouter un cours
                  </button>
                </div>
              </div>

              <div className="mt-4 flex space-x-6 overflow-x-auto">
                {paginatedCours.map((cours) => (
                  <div key={cours._id} className="flex-none">
                    <CoursCard
                      titre={cours.titre}
                      description={cours.description}
                      dateCreation={cours.dateCreation}
                      activites={cours.activites}
                      onDelete={() =>
                        console.log("Supprimer cours id:", cours._id)
                      }
                      detais={() => handleVoirPlus(cours?.resource?.lienUrl)}
                      gereActivite={() =>
                        navigate("/enseignant/dashboard/activites", {
                          state: {
                            activites: cours.activites,
                            titre: cours.titre,
                            idCours: cours._id,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={() => handlePageChange(classe._id, "prev")}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(classe._id, "next")}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function GestionCours() {
  const [coursData, SetCoursData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClasseId, setSelectedClasseId] = useState(null);
  const [modalfirstCours, SetModalFirstCours] = useState(false);
  const getCours = async () => {
    try {
      const response = await fetch(ApiEnseignant.coursbyEnseignant.url, {
        method: ApiEnseignant.coursbyEnseignant.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData = await response.json();
      SetCoursData(responseData?.result || []);
    } catch (error) {
      console.log("er", error);
    }
  };

  useEffect(() => {
    getCours();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {coursData.length === 0 ? (
        <div className="flex justify-end">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
            onClick={() => SetModalFirstCours(true)}
          >
            Ajouter un cours
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
              onClick={() => SetModalFirstCours(true)}
            >
              Ajouter un cours
            </button>
          </div>
          <CoursGroupes
            data={coursData}
            onAddCours={(classeId) => {
              setSelectedClasseId(classeId);
              setShowModal(true);
            }}
          />
        </>
      )}

      {showModal && (
        <AjouterCoursModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          fetchdata={getCours}
          classeId={selectedClasseId}
        />
      )}

      {modalfirstCours && (
        <AjouterCoursGeneralModal
          isOpen={modalfirstCours}
          onClose={() => SetModalFirstCours(false)}
          fetchdata={getCours}
        />
      )}
    </div>
  );
}

export default GestionCours;
