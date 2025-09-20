import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Header from "../others/header/Header";
import ChatSidebar from "./ChatSidebar/ChatSidebar";
import ChatWindow from "./ChatWindow/ChatWindow";
import sound from "../assets/notification-sound.mp3";
import sound2 from "../assets/new-notification.mp3";
import sound3 from "../assets/message-send.mp3";

import { addMessage, ensureObjectStore } from "../database/db";

export default function Home({ socket }) {
  const navigate = useNavigate();
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [reciveMessage, setReciveMessage] = useState(null); // Variable name fix kiya
  const [messageRecievedTrigger, setMessageRecievedTrigger] = useState(0);
  const handleUserSelect = (userData) => {
    setActiveChatUser(userData);
  };

  function handleMessageSend(data) {
    console.log(data);
    socket.emit("chat message", data);
    const audio = new Audio(sound3);
    audio.play();
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_login");
    if (!isLoggedIn) {
      navigate("/welcome");
      return;
    }

    if (socket) {
      const handleChatMessage = async (msg) => {
        console.log("New message received:", msg);

        const isCurrentlyActiveUser =
          activeChatUser?.username === msg.fromUsername;

        // Agar active chat wahi hai to reciveMessage state update karo
        if (isCurrentlyActiveUser) {
          setReciveMessage(msg);
          const audio = new Audio(sound2);
          audio.play();
        } else {
          // Agar chat active nahi hai to database mein save karo as unread

          setMessageRecievedTrigger((prev) => prev + 1);

          const showMessage = {
            id: uuidv4(),
            content: msg.content,
            sender: "other",
            created_at: new Date().toISOString(),
            read: false,
          };
          await ensureObjectStore(msg.fromUsername);
          await addMessage(msg.fromUsername, showMessage);
          const audio = new Audio(sound);
          audio.play();
        }
      };

      socket.on("chat message", handleChatMessage);

      return () => {
        socket.off("chat message", handleChatMessage);
      };
    }
  }, [navigate, socket, activeChatUser]);

  return (
    <main>
      <Header />
      <ChatSidebar
        onSelectUser={handleUserSelect}
        messageRecievedTrigger={messageRecievedTrigger}
      />
      <ChatWindow
        activeUser={activeChatUser}
        sendmessage={handleMessageSend}
        reciveMessages={reciveMessage}
      />
    </main>
  );
}
