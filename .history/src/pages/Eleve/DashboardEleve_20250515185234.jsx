import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { deconnecte } from "../../utils/auth";
import { FiBell } from "react-icons/fi";
import socket from "../../utils/socket";
import Api from "../../Api/Eleve";

function DashboardEleve() {
  let user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const location = useLocation();

  // Toggle menu mobile
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setNotificationCount(0);
  };

  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    fetch(Api.notification.url, {
      method: Api.notification.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setNotificationCount(data.length);
      })
      .catch((err) => console.error("Erreur fetch notifications :", err));
  }, []);

  useEffect(() => {
    // Enregistrer l'utilisateur auprès du serveur socket
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }

    // Écouter les notifications envoyées par le serveur
    socket.on("newNotification", (data) => {
      console.log("🔔 Nouvelle notification :", data);
      setNotifications((prev) => [data, ...prev]);
      setNotificationCount((count) => count + 1);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center relative">
        <h1 className="text-lg font-bold">
          Espace élève Bonjour {user?.email}{" "}
        </h1>

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

          {/* Icône notification */}
          <div className="relative cursor-pointer">
            <FiBell
              className="w-6 h-6 text-white"
              onClick={toggleNotifications}
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1">
              {notificationCount}
            </span>
          </div>

          {/* Menu profil */}
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
                <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer">
                  {user?.nom}
                </p>
                <Link
                  to="/eleve/profil"
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
      {/* Menu Notifications */}
      {isNotificationsOpen && (
        <div className="absolute right-12 mt-16  bg-white rounded-md shadow-lg py-1 z-50">
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Notifications
            </h2>
            {/* Close button */}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-2 text-sm text-gray-500">
              Aucune notification.
            </p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {notifications.map((notif, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => navigate("/eleve/dashboard/cours")}
                >
                  <div className="flex justify-between items-end">
                    <span>{notif.message}</span>
                    <span className="text-xs text-gray-500 ml-4">
                      {new Date(notif.date || Date.now()).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-gray-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
        >
          <nav>
            <Link
              to="/eleve/dashboard"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                isActive("/eleve/dashboard")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              Liste des cours
            </Link>

            <Link
              to="/eleve/dashboard/chat"
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                isActive("/eleve/dashboard/chat")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              Message
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
        &copy; {new Date().getFullYear()} Student Dashboard. Tous droits
        réservés.
      </footer>
    </div>
  );
}

export default DashboardEleve;
