import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa"; // Import FaTrash for the remove button
import ApiEnseignant from "../Api/Enseignant";
import Apiclasse from "../Api/classe";
import ApiSpecialite from "../Api/Specialite";

function AjouterEnseignant({ isOpen, closeModal, selectedClasse, fetchdata }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [specialites, setSpecialites] = useState([]);
  const [otherClasses, setOtherClasses] = useState([]);
  const [selectedClasseIds, setSelectedClasseIds] = useState([
    selectedClasse._id,
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
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
      const filteredClasses = response?.result?.filter(
        (classe) => classe._id !== selectedClasse._id
      );
      setOtherClasses(filteredClasses || []);
    } catch (error) {
      console.log("errrrr", error);
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
    } catch (error) {
      console.log("Erreur lors de la récupération des specialite", error);
    }
  };

  useEffect(() => {
    getAllClasses();
    getAllSpecialite();
  }, [selectedClasse]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAddClasse = (classeId) => {
    if (selectedClasseIds.includes(classeId)) {
      // If already selected, remove it
      setSelectedClasseIds(selectedClasseIds.filter((id) => id !== classeId));
    } else {
      // Add new class ID
      setSelectedClasseIds([...selectedClasseIds, classeId]);
    }
  };

  const handleRemoveClasse = (classeId) => {
    // Prevent removing the initially selected class
    if (classeId !== selectedClasse._id) {
      setSelectedClasseIds(selectedClasseIds.filter((id) => id !== classeId));
    }
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
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nom: nom,
        email: email,
        motDePasse: motDePasse,
        specialite: specialite,
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

          {/* Formulaire */}
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

          {/* Classe sélectionnée (principale) */}
          <div className="mb-4">
            <label className="block text-gray-700">Classe sélectionnée</label>
            <input
              type="text"
              value={selectedClasse.niveau + " " + selectedClasse.nomClasse}
              disabled
              className="border p-2 w-full rounded-md"
            />
          </div>

          {/* Liste déroulante pour ajouter d'autres classes */}
          <div className="mb-4">
            <label className="block text-gray-700">Ajouter des classes</label>
            <div className="relative">
              <button
                type="button"
                className="border p-2 w-full rounded-md text-left bg-white flex justify-between items-center"
                onClick={toggleDropdown}
              >
                <span>Sélectionner des classes</span>
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {otherClasses.length > 0 ? (
                    otherClasses.map((classe) => (
                      <label
                        key={classe._id}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={classe._id}
                          checked={selectedClasseIds.includes(classe._id)}
                          onChange={() => handleAddClasse(classe._id)}
                          className="mr-2"
                        />
                        {classe.niveau} {classe.nomClasse}
                      </label>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      Aucune classe disponible
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.classes && (
              <p className="text-red-500 text-sm mt-1">{errors.classes}</p>
            )}
          </div>

          {/* Liste des classes ajoutées */}
          {selectedClasseIds.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700">Classes ajoutées :</label>
              <ul className="list-disc pl-5 text-gray-800">
                {selectedClasseIds.map((id) => {
                  const classe =
                    id === selectedClasse._id
                      ? selectedClasse
                      : otherClasses.find((c) => c._id === id);
                  return (
                    classe && (
                      <li
                        key={id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {classe.niveau} {classe.nomClasse}
                        </span>
                        {id !== selectedClasse._id && (
                          <button
                            onClick={() => handleRemoveClasse(id)}
                            className="text-red-500 ml-2 hover:text-red-700"
                            title="Supprimer cette classe"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Spécialité</label>
            <select
              className="border p-2 w-full rounded-md"
              onChange={(e) => setSpecialite(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionner une Spécialité
              </option>
              {specialites?.map((sp) => (
                <option key={sp?._id} value={sp?.label}>
                  {sp?.label}
                </option>
              ))}
            </select>
            {errors.specialite && (
              <p className="text-red-500 text-sm mt-1">{errors.specialite}</p>
            )}
          </div>

          {/* Actions */}
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

export default AjouterEnseignant;
