import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Api from "../Api/Eleve";

function ModalModifierEleve({ isOpen, closeModal, eleve, fetchData }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  useEffect(() => {
    if (eleve) {
      setNom(eleve.nom || "");
      setEmail(eleve.email || "");
    }
  }, [eleve]);

  const handleUpdate = async () => {
    if (!nom.trim()) {
      toast.error("Le nom est  obligatoires.");
      return;
    }

    if (!email.trim()) {
      toast.error("l'email sont obligatoires.");
      return;
    }
    try {
      const response = await fetch(Api.modifierEleve.url, {
        method: Api.modifierEleve.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idEleve: eleve._id,
          nom,
          email,
          motDePasse,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Élève modifié avec succès !");
        fetchData();
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        toast.error("Échec de la modification");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <ToastContainer position="top-center" />
        <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Modifier l'élève
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Nom de l'élève"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
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
              placeholder="Mot de passe (laisser vide pour ne pas changer)"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalModifierEleve;
