import React from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SupprimeActivites = ({
  isOpen,
  onClose,
  idActivite,
  fetchdata,
  deleteUrl,
  deleteMethod = "POST",
}) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(deleteUrl, {
        method: deleteMethod,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idActivite }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Activité supprimée avec succès.");
        fetchdata();
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.success(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <ToastContainer position="top-center" />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
        <p className="mb-6">
          Êtes-vous sûr de vouloir supprimer cette activité ?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupprimeActivites;
