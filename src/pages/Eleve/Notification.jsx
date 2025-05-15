import React, { useState } from "react";
// Exemple dans React (useEffect)
import { useEffect } from "react";
import socket from "../../utils/socket";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    // Récupérer l'utilisateur connecté depuis localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?._id) {
      // Enregistrer l'utilisateur auprès du serveur socket
      socket.emit("registerUser", user._id);
    }

    // Écouter les notifications envoyées par le serveur
    socket.on("newNotification", (data) => {
      console.log("🔔 Nouvelle notification :", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif, index) => (
            <li
              key={index}
              className="p-4 bg-white rounded-lg shadow border border-gray-200"
            >
              {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
