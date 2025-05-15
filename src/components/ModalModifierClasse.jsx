import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Apiclasse from "../Api/classe";

function ModalModifierClasse({ isOpen, onClose, classeToEdit, fetchdata }) {
  const [formData, setFormData] = useState({
    nomClasse: "",
    niveau: "",
  });

  useEffect(() => {
    if (classeToEdit) {
      setFormData({
        nomClasse: classeToEdit.nomClasse || "",
        niveau: classeToEdit.niveau || "",
      });
    }
  }, [classeToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(Apiclasse.modifierClasse.url, {
        method: Apiclasse.modifierClasse.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idClass: classeToEdit._id,
          ...formData,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.msg);

        fetchdata();
        // Après 2 secondes (2000ms), on ferme le modal
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      toast.error("Erreur de communication avec le serveur.");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <ToastContainer position="top-center" />
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
          <h2 className="text-xl font-semibold mb-4">Modifier la classe</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de la classe
            </label>
            <input
              type="text"
              name="nomClasse"
              value={formData.nomClasse}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
              Niveau
            </label>
            <input
              type="text"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalModifierClasse;
