import React from "react";
import { useNavigate } from 'react-router-dom';

const AuthSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Admin",
      description: "Gérer les utilisateurs et les paramètres de la plateforme.",
      color: "bg-red-500",
      link: "/login"
    },
    {
      title: "Élève",
      description: "Accéder aux cours, examens et résultats.",
      color: "bg-green-500",
      link: "/loginEleve"
    },
    {
      title: "Enseignant",
      description: "Gérer les cours et évaluer les élèves.",
      color: "bg-blue-500",
      link: "/loginEnseignant"
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {roles.map((role, index) => (
          <div
            key={index}
            onClick={() => navigate(role.link)} // ✅ Fonction fléchée ici !
            className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${role.color} text-white text-2xl font-bold mb-4`}>
              {role.title.charAt(0)}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{role.title}</h3>
            <p className="text-gray-600 text-center">{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthSelection;
