import React, { useState } from "react";
import Api from "../Api/Eleve";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ModalAjoutEleve({ isOpen, closeModal, selectedClasse, fetchdata }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const handleSubmit = async () => {
    const formData = {
      nom,
      email,
      motDePasse,
      classe: selectedClasse._id,
    };

    const dataResponse = await fetch(Api.AjouterEleve.url, {
      method: Api.AjouterEleve.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nom: nom,
        email: email,
        motDePasse: motDePasse,
        classe: selectedClasse._id,
      }),
    });
    const response = await dataResponse.json();
    if (response.success) {
      toast.success(response.msg);
      fetchdata();
      // Après 2 secondes (2000ms), on ferme le modal
      setTimeout(() => {
        closeModal();
      }, 2000);
    } else {
      toast.error(response.msg);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <ToastContainer position="top-center" />
        <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
          <h2 className="text-xl font-semibold mb-4">Ajouter un élève</h2>
          <div className="mb-4">
            <label className="block text-gray-700">calsse</label>
            <input
              type="text"
              value={selectedClasse.nomClasse}
              disabled
              className="border p-2 w-full rounded-md"
              placeholder="Nom de classe"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Nom && Prénom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Nom de l'élève"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Identifiant</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Email de l'élève"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Mot de passe"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalAjoutEleve;
