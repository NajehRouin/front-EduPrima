import React, { useEffect, useState } from "react";

import { FiEdit, FiTrash2 } from "react-icons/fi";

import AjouterSpecialite from "../../components/AjouterSpecialite";
import ApiSpecialite from "../../Api/Specialite";

function GestionSpecialite() {
  const [specialtes, setSpecialites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 3;
  const [showModalSpecialite, setShowModalSpecialite] = useState(false);
  const getAllSpecialite = async () => {
    try {
      const dataResponse = await fetch(ApiSpecialite.getAllSpecialite.url, {
        method: ApiSpecialite.getAllSpecialite.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await dataResponse.json();
      setSpecialites(response?.result || []);
      console.log("response?.result", response?.result);
    } catch (error) {
      console.log("Erreur lors de la récupération des specialite", error);
    }
  };

  useEffect(() => {
    getAllSpecialite();
  }, []);

  const filteredSpecilaite = specialtes.filter((c) =>
    c.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSpecilaite.length / rowsPerPage);
  const paginatedData = filteredSpecilaite.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-6xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher une specialite..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <div className="flex gap-3">
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
              <th className="px-6 py-3 text-left">Label</th>

              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData?.map((sp) => (
                <tr key={sp._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{sp.label}</td>

                  <td className="px-6 py-4 flex gap-4 items-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Modifier"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
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
                  Aucune specialite trouvée.
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

      {showModalSpecialite && (
        <AjouterSpecialite
          isOpen={showModalSpecialite}
          onClose={() => setShowModalSpecialite(false)}
          fetchdata={getAllSpecialite}
        />
      )}
    </div>
  );
}

export default GestionSpecialite;
