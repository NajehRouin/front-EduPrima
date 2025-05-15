import React, { useEffect, useRef, useState } from "react";

import Apiconverstaion from "../../Api/Conversation";
import ApiEnseignant from "../../Api/Enseignant";
import { io } from "socket.io-client";
import notificationSound from "../../assets/sound/notificationenseignant.wav";
const SOCKET_URL = "http://localhost:5000";

function SidebarEleves({ classesGroupées, onSelect, selectedId }) {
  return (
    <aside className="w-64 bg-white border-r h-screen overflow-y-auto">
      <h3 className="text-lg font-bold p-4 border-b">Élèves</h3>
      {classesGroupées.map((classe) => (
        <div key={classe._id} className="border-b px-4 py-2">
          <p className="font-semibold mb-2">
            {classe.niveau} - {classe.nomClasse}
          </p>
          <ul>
            {classe?.eleves?.map((eleve) => (
              <li
                key={eleve._id}
                className={`pl-4 pr-2 py-1 cursor-pointer hover:bg-gray-100 rounded ${
                  selectedId === eleve._id ? "bg-blue-100" : ""
                }`}
                onClick={() => onSelect(eleve)}
              >
                <p className="font-medium">{eleve.nom}</p>
                <p className="text-sm text-gray-500">{eleve.email}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

// Composant de chat avec l'enseignant sélectionné
function ChatWindow({ eleve }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const [enseignant, SetEnseignant] = useState();

  const restorEnseignant = async () => {
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) SetEnseignant(user);
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  useEffect(() => {
    restorEnseignant();
  }, []);

  useEffect(() => {
    if (!eleve) return;

    const { url, method } = Apiconverstaion.getConversationByEleve;

    fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idEleve: eleve._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Si les messages sont présents
        if (data?.messages) {
          setMessages(data.messages);
        }
        // Si la réponse est null, réessaye de charger à nouveau
        else if (data === null || (data.result && data.result.messages)) {
          setMessages([]); // réinitialise les messages si nécessaire
          // Possibilité de recharger ou faire un traitement ici si data === null

          console.log("Pas de messages, tentative de recharger...");
        }
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des messages :", err)
      );
  }, [eleve]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!enseignant) return;

    const socket = io(SOCKET_URL, {
      query: {
        userId: enseignant?._id,
        userModel: "Enseignant",
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connection", () => {
      console.log("Socket connecté", socket.id);
    });

    // Écoute du message reçu via socket
    socket.on("newMessage", (newMsg) => {
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [enseignant, eleve]);

  const handleSend = async () => {
    if (!newMessage.trim() || !enseignant) return;

    try {
      const response = await fetch(Apiconverstaion.send.url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: eleve._id,
          receiverModel: "Eleve",
          message: newMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, data]); // affiche le message directement
        setNewMessage("");
      } else {
        console.error("Erreur:", data.error);
      }
    } catch (err) {
      console.error("Erreur d'envoi :", err);
    }
  };

  if (!eleve) {
    return (
      <div className="flex-1 p-6">
        <p className="text-gray-500">
          Sélectionnez un enseignant pour commencer la conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chat avec {eleve.nom}</h2>

      {/* Zone des messages */}
      <div
        ref={scrollRef}
        className="bg-gray-100 rounded p-4 h-96 overflow-y-auto flex-1 space-y-2"
      >
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isEleve = msg.senderModel === "Eleve";
            return (
              <div
                key={msg._id}
                className={`flex ${
                  isEleve ? " justify-start " : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                    isEleve
                      ? "bg-gray-800 rounded-bl-none"
                      : "bg-blue-600 rounded-br-none"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 italic">Aucun message pour le moment.</p>
        )}
      </div>

      {/* Champ d'envoi */}
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

function Chat() {
  const [classesGroupées, setClassesGroupées] = useState([]);
  const [selectedEleve, setSelectedEleve] = useState(null);

  useEffect(() => {
    fetch(ApiEnseignant.getclasseEnseignant.url, {
      method: ApiEnseignant.getclasseEnseignant.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.classesGroupées) {
          setClassesGroupées(data.classesGroupées);
        }
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des classes :", err)
      );
  }, []);

  return (
    <div className="flex h-screen">
      <SidebarEleves
        classesGroupées={classesGroupées}
        onSelect={setSelectedEleve}
        selectedId={selectedEleve?._id}
      />
      <ChatWindow eleve={selectedEleve} />
    </div>
  );
}

export default Chat;
