import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { deconnecte } from "../../utils/auth";
const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);

  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center relative">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>

        <div className="flex items-center space-x-4">
          {/* Bouton menu mobile */}
          <button onClick={toggleMenu} className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Icône profil avec menu déroulant */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* Menu déroulant profil */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/admin/profil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profil
                </Link>
                <p
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                  onClick={() => {
                    deconnecte();
                    navigate("/");
                  }}
                >
                  Déconnexion
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-gray-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
        >
          <nav>
            <Link
              to="/admin/dashboard/classes"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                isActive("/admin/dashboard/classes")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              Liste des classes
            </Link>

            <Link
              to="/admin/dashboard/specialites"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                isActive("/admin/dashboard/specialites")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              Liste des spécialités
            </Link>
            <Link
              to="/admin/dashboard/eleves"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                isActive("/admin/dashboard/eleves")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              Liste des élèves
            </Link>
            <Link
              to="/admin/dashboard/enseignants"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                isActive("/admin/dashboard/enseignants")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              Liste des enseignants
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Admin Dashboard. Tous droits réservés.
      </footer>
    </div>
  );
};

export default DashboardAdmin;
