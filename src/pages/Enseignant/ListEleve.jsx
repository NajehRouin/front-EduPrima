import React, { useEffect, useState } from "react";
import ApiEnseignant from "../../Api/Enseignant";

function ListEleve() {
  const [classes, setClasses] = useState([]);
  const [searchTerms, setSearchTerms] = useState([]);
  const [currentPages, setCurrentPages] = useState([]);
  const elevesParPage = 2;

  const handleSearchChange = (e, idx) => {
    const updatedSearchTerms = [...searchTerms];
    updatedSearchTerms[idx] = e.target.value;
    setSearchTerms(updatedSearchTerms);
  };

  const handlePageChange = (idx, direction) => {
    const newPages = [...currentPages];
    newPages[idx] = currentPages[idx] + direction;
    setCurrentPages(newPages);
  };

  const getListEleve = async () => {
    try {
      const response = await fetch(ApiEnseignant.getclasseEnseignant.url, {
        method: ApiEnseignant.getclasseEnseignant.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData = await response.json();

      const classesGroupées = responseData?.classesGroupées || [];

      setClasses(classesGroupées);
      setSearchTerms(new Array(classesGroupées.length).fill(""));
      setCurrentPages(new Array(classesGroupées.length).fill(1));
    } catch (error) {
      console.log("Erreur lors du chargement des classes :", error);
    }
  };

  useEffect(() => {
    getListEleve();
  }, []);

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Liste des élèves par classe
      </h1>

      {classes.map((classe, idx) => {
        const filteredEleves = classe.eleves.filter((eleve) =>
          eleve.nom
            .toLowerCase()
            .includes((searchTerms[idx] || "").toLowerCase())
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
                  value={searchTerms[idx] || ""}
                  onChange={(e) => handleSearchChange(e, idx)}
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-center">Nom</th>
                    <th className="py-2 px-4 border-b text-center">Email</th>
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
    </div>
  );
}

export default ListEleve;
