import React, { useEffect, useState } from "react";
import Api from "../../Api/Eleve";
import { useNavigate } from "react-router-dom";

function Cours() {
  const [cours, SetCours] = useState([]);

  const getCoursEleves = async () => {
    try {
      const response = await fetch(Api.getMesCours.url, {
        method: Api.getMesCours.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData = await response.json();

      SetCours(responseData?.result || []);
    } catch (error) {
      console.log("errrrrrrrrrrr", error);
    }
  };

  useEffect(() => {
    getCoursEleves();
  }, []);

  const [search, setSearch] = useState(""); // Texte de recherche
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle

  const itemsPerPage = 9; // Nombre de cours par page

  // Filtrer les cours selon le texte de recherche
  const filteredCours = cours.filter((c) =>
    c.titre.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCours = filteredCours.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  const handleVoirPlus = (lienUrl) => {
    if (lienUrl) {
      navigate(`/eleve/dashboard/resource?url=${encodeURIComponent(lienUrl)}`);
    } else {
      console.error("Lien URL non disponible");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Liste des cours</h2>

      {/* Champ de recherche */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Rechercher un cours..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Liste des cours */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {currentCours.length > 0 ? (
          currentCours.map((cours) => (
            <div
              key={cours._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{cours.titre}</h3>
              <p className="text-gray-600 mb-2">{cours.description}</p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Enseignant:</span>{" "}
                {cours?.enseignantId?.nom || "N/A"}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Nombre d'activités:</span>{" "}
                {cours?.activites?.length || 0}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Date de création:</span>{" "}
                {new Date(cours.dateCreation).toLocaleDateString()}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleVoirPlus(cours?.resource?.lienUrl)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Voir plus
                </button>

                {cours?.activites?.length > 0 && (
                  <button
                    onClick={() => {
                      navigate("/eleve/dashboard/activites", {
                        state: {
                          activites: cours.activites,
                          titre: cours.titre,
                          idCours: cours._id,
                        },
                      });
                      console.log("activites", cours?.activites);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Voir activités
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Aucun cours trouvé.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cours;
