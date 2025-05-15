import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apiclasse from "../Api/classe";
function ModalAjoutClasse({ isOpen, onClose, fetchdata }) {
  const [formData, setFormData] = useState({
    nomClasse: "",
    niveau: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const dataResponse = await fetch(Apiclasse.AjouterClasse.url, {
      method: Apiclasse.AjouterClasse.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const response = await dataResponse.json();
    if (response.success) {
      toast.success(response.msg);
      setFormData({ nomClasse: "", niveau: "" });
      fetchdata();
      // Après 2 secondes (2000ms), on ferme le modal
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      toast.error(response.msg);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <ToastContainer position="top-center" />
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
          <h2 className="text-xl font-semibold mb-4">Ajouter une classe</h2>

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
          <div>
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
              Ajouter
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalAjoutClasse;
