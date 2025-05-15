import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiEnseignant from "../Api/Enseignant";

function AjouterActivites({ isOpen, onClose, classeId, fetchdata }) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    dateLimite: "",
    idCours: classeId,
  });

  const [disabled, setDisabled] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    try {
      const res = await fetch(ApiEnseignant.AjouterActivites.url, {
        method: ApiEnseignant.AjouterActivites.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          titre: formData?.titre,
          description: formData?.description,
          dateLimite: formData?.dateLimite,
          idCours: classeId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Activité ajoutée avec succès !");
        fetchdata();
        setTimeout(() => {
          onClose(); // close modal
        }, 1000);
      } else {
        toast.error("Erreur lors de l'ajout !");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur !");
    } finally {
      setDisabled(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
          <h2 className="text-xl font-semibold mb-4">Ajouter une Activité</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Titre</label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">Date Limite</label>
              <input
                type="date"
                name="dateLimite"
                value={formData.dateLimite}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={disabled}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AjouterActivites;
