import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiEnseignant from "../Api/Enseignant";
const AjouterCoursModal = ({ isOpen, onClose, classeId, fetchdata }) => {
  const [disabled, SetDisabled] = useState(false);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [fichier, setFichier] = useState(null);

  const handleSubmit = async () => {
    if (!titre || !description || !fichier)
      return toast.error("remplissez tous les champs");
    SetDisabled(true);
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("classeId", classeId?._id);
    formData.append("fichier", fichier);

    try {
      const dataResponse = await fetch(ApiEnseignant.ajouterCours.url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const response = await dataResponse.json();
      if (response.success) {
        toast.success(response.message);
        SetDisabled(true);
        fetchdata();
        setTitre("");
        setDescription("");
        setFichier(null);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(response.msg);
      }
    } catch (error) {
      toast.error(error);
      SetDisabled(false);
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <ToastContainer position="top-center" />
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <h2 className="text-sm font-bold mb-4">
            Ajouter un cours pour la classe {classeId?.niveau}{" "}
            {classeId?.nomClasse}
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFichier(e.target.files[0])}
              className="w-full"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Annuler
            </button>
            <button
              disabled={disabled}
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AjouterCoursModal;
