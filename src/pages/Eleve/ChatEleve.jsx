import React, { useEffect, useRef, useState } from "react";
import ApiEnseignant from "../../Api/Enseignant";
import Apiconverstaion from "../../Api/Conversation";
import notificationSound from "../../assets/sound/notificationeleve.wav";
import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:5000";

function Sidebar({ teachers, onSelect, selectedId }) {
  return (
    <aside className="w-64 bg-white border-r h-screen overflow-y-auto">
      <h3 className="text-lg font-bold p-4 border-b">Enseignants</h3>
      <ul>
        {teachers.map((teacher) => (
          <li
            key={teacher._id}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedId === teacher._id ? "bg-blue-100" : ""
            }`}
            onClick={() => onSelect(teacher)}
          >
            <p className="font-medium">{teacher.nom}</p>
            <p className="text-sm text-gray-500">{teacher.specialite}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Composant de chat avec l'enseignant sélectionné
function ChatWindow({ teacher }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const [eleve, SetEleve] = useState();

  const restorEleve = async () => {
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) SetEleve(user);
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  useEffect(() => {
    restorEleve();
  }, []);

  useEffect(() => {
    if (!teacher) return;

    const { url, method } = Apiconverstaion.getConversationByEnseignant;

    fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idEnseignant: teacher._id,
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
  }, [teacher]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!eleve) return;

    const socket = io(SOCKET_URL, {
      query: {
        userId: eleve?._id,
        userModel: "Eleve",
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
  }, [teacher, eleve]);

  const handleSend = async () => {
    if (!newMessage.trim() || !teacher) return;

    try {
      const response = await fetch(Apiconverstaion.send.url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: teacher._id,
          receiverModel: "Enseignant",
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

  if (!teacher) {
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
      <h2 className="text-xl font-bold mb-4">Chat avec {teacher.nom}</h2>

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
                className={`flex ${isEleve ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                    isEleve
                      ? "bg-blue-600 rounded-br-none"
                      : "bg-gray-800 rounded-bl-none"
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

function ChatEleve() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    fetch(ApiEnseignant.getEnseignantsiedBar.url, {
      method: ApiEnseignant.getEnseignantsiedBar.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) setTeachers(data.result);
      })
      .catch((err) =>
        console.error("Erreur de chargement des enseignants:", err)
      );
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        teachers={teachers}
        onSelect={setSelectedTeacher}
        selectedId={selectedTeacher?._id}
      />
      <ChatWindow teacher={selectedTeacher} />
    </div>
  );
}

export default ChatEleve;
