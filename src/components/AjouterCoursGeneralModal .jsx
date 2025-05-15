import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiEnseignant from "../Api/Enseignant";

const AjouterCoursGeneralModal = ({ isOpen, onClose, fetchdata }) => {
  const [disabled, setDisabled] = useState(false);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [fichier, setFichier] = useState(null);
  const [classeId, setClasseId] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(ApiEnseignant.CurrentEnseignant.url, {
          method: "get",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setClasses(data?.result?.classes || []);
        } else {
          toast.error("Erreur lors de la récupération des classes");
        }
      } catch (error) {
        toast.error("Erreur réseau");
        console.error("Erreur en récupérant les classes:", error);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async () => {
    if (!titre || !description || !fichier || !classeId) {
      return toast.error("Veuillez remplir tous les champs");
    }

    setDisabled(true);

    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("classeId", classeId);
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
        fetchdata();
        // Reset
        setTitre("");
        setDescription("");
        setFichier(null);
        setClasseId("");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(response.message || "Erreur inconnue");
        setDisabled(false);
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi du formulaire");
      setDisabled(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <ToastContainer position="top-center" />
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Ajouter un nouveau cours</h2>

        <div className="mb-4">
          <select
            value={classeId}
            onChange={(e) => setClasseId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Sélectionnez une classe</option>
            {classes?.map((classe) => (
              <option key={classe._id} value={classe._id}>
                {classe.niveau} {classe.nomClasse}
              </option>
            ))}
          </select>
        </div>

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
  );
};

export default AjouterCoursGeneralModal;
