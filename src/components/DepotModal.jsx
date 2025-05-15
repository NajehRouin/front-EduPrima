// components/DepotModal.jsx
import React, { useState } from "react";
import Api from "../Api/Eleve";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function DepotModal({ show, onClose, fetchData, activite }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDepotSubmit = async () => {
    if (!selectedFile) return toast.error("Veuillez sélectionner un fichier.");

    const formData = new FormData();
    formData.append("Activite", activite?._id);
    formData.append("fichier", selectedFile);

    try {
      const response = await fetch(Api.addDepot.url, {
        method: Api.addDepot.method,
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (data?.success) {
        toast.success(data?.msg);
        fetchData();

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Erreur lors du dépôt :", error);
    }
  };

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <ToastContainer position="top-center" />

        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Faire un dépôt</h3>
          <p className="mb-2">
            <strong>Activité :</strong> {activite?.titre}
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4 block w-full"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={handleDepotSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Soumettre
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default DepotModal;
