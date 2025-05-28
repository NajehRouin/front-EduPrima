import React, { useEffect, useState } from "react";
import Api from "../Api/Eleve";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apiclasse from "../Api/classe";

function AjouterEleve({ isOpen, closeModal, fetchdata }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [classe, SetClasse] = useState("");
  const [otherClasses, setOtherClasses] = useState([]);

  const getAllClasses = async () => {
    try {
      const dataResponse = await fetch(Apiclasse.getAllClasse.url, {
        method: Apiclasse.getAllClasse.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await dataResponse.json();

      setOtherClasses(response?.result || []);
    } catch (error) {
      console.log("errrrr", error);
    }
  };

  const handleAddClasse = (e) => {
    SetClasse(e.target.value);
  };
  useEffect(() => {
    getAllClasses();
  }, []);

  const handleSubmit = async () => {
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
        classe: classe,
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
            <label className="block text-gray-700">Nom et Prénom</label>
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

          {/* Liste déroulante pour ajouter d'autres classes */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Ajouter d'autres classes
            </label>
            <select
              className="border p-2 w-full rounded-md"
              onChange={handleAddClasse}
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionner une classe
              </option>
              {otherClasses?.map((classe) => (
                <option key={classe._id} value={classe._id}>
                  {classe.niveau} {classe.nomClasse}
                </option>
              ))}
            </select>
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

export default AjouterEleve;
