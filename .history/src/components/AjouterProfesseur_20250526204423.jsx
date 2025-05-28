import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiEnseignant from "../Api/Enseignant";
import Apiclasse from "../Api/classe";
import { FaTrash } from "react-icons/fa";
import ApiSpecialite from "../Api/Specialite";
function AjouterProfesseur({ isOpen, closeModal, fetchdata }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [specialites, setSpecialites] = useState("");

  const [motDePasse, setMotDePasse] = useState("");
  const [specialite, setSpecialite] = useState("");

  const [otherClasses, setOtherClasses] = useState([]);
  const [selectedClasseIds, setSelectedClasseIds] = useState([]);
  const [errors, setErrors] = useState({});
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
      const allClasses = response?.result;
      setOtherClasses(allClasses || []);
    } catch (error) {
      console.log("Erreur lors de la récupération des classes", error);
    }
  };
  const getAllSpecialite = async () => {
    try {
      const dataResponse = await fetch(ApiSpecialite.getAllSpecialite.url, {
        method: ApiSpecialite.getAllSpecialite.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await dataResponse.json();

      setSpecialites(response?.result || []);
      console.log("response?.result", response?.result);
    } catch (error) {
      console.log("Erreur lors de la récupération des specialite", error);
    }
  };

  useEffect(() => {
    getAllClasses();
  }, []);

  const handleAddClasse = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !selectedClasseIds.includes(selectedId)) {
      setSelectedClasseIds([...selectedClasseIds, selectedId]);
    }
  };

  const handleRemoveClasse = (id) => {
    const updatedSelectedIds = selectedClasseIds.filter((cid) => cid !== id);
    setSelectedClasseIds(updatedSelectedIds);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!nom) newErrors.nom = "Champ obligatoire";
    if (!email) newErrors.email = "Champ obligatoire";
    if (!motDePasse) newErrors.motDePasse = "Champ obligatoire";
    if (!specialite) newErrors.specialite = "Champ obligatoire";
    if (selectedClasseIds.length === 0) newErrors.classes = "Champ obligatoire";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    const dataResponse = await fetch(ApiEnseignant.AjouterEnseignant.url, {
      method: ApiEnseignant.AjouterEnseignant.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom,
        email,
        motDePasse,
        specialite,
        classes: selectedClasseIds,
      }),
    });

    const response = await dataResponse.json();
    if (response.success) {
      toast.success(response.msg);
      fetchdata();
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
        <div className="bg-white p-6 rounded-md shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl text-center font-semibold mb-4">
            Ajouter un Enseignant
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Nom"
            />
            {errors.nom && (
              <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
            {errors.motDePasse && (
              <p className="text-red-500 text-sm mt-1">{errors.motDePasse}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Ajouter des classes</label>
            <select
              className="border p-2 w-full rounded-md"
              onChange={handleAddClasse}
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionner une classe
              </option>
              {otherClasses.map((classe) => (
                <option key={classe._id} value={classe._id}>
                  {classe.niveau} {classe.nomClasse}
                </option>
              ))}
            </select>
            {errors.classes && (
              <p className="text-red-500 text-sm mt-1">{errors.classes}</p>
            )}
          </div>

          {selectedClasseIds.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700">Classes ajoutées :</label>
              <ul className="list-disc pl-5 text-gray-800">
                {selectedClasseIds.map((id) => {
                  const classe = otherClasses.find((c) => c._id === id);
                  return (
                    classe && (
                      <li
                        key={id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {classe.niveau} {classe.nomClasse}
                        </span>
                        <button
                          onClick={() => handleRemoveClasse(id)}
                          className="text-red-500 ml-2 hover:text-red-700"
                          title="Supprimer cette classe"
                        >
                          <FaTrash />
                        </button>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Spécialité</label>
            <input
              type="text"
              value={specialite}
              onChange={(e) => setSpecialite(e.target.value)}
              className="border p-2 w-full rounded-md"
              placeholder="Spécialité"
            />
            {errors.specialite && (
              <p className="text-red-500 text-sm mt-1">{errors.specialite}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default AjouterProfesseur;
