import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../others/header/Header";
import ChatSidebar from "./ChatSidebar/ChatSidebar";
import ChatWindow from "./ChatWindow/ChatWindow";
import sound from "../assets/notification-sound.mp3";
import sound2 from "../assets/new-notification.mp3";
import sound3 from "../assets/message-send.mp3";
import { api2 } from "../global/api";
import { addMessage, ensureObjectStore } from "../database/db";

export default function Home({ socket }) {
  const navigate = useNavigate();
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [reciveMessage, setReciveMessage] = useState(null); // Variable name fix kiya
  const [messageRecievedTrigger, setMessageRecievedTrigger] = useState(0);
  const handleUserSelect = (userData) => {
    setActiveChatUser(userData);
    // console.log(userData);
  };

  function handleMessageSend(data) {
    console.log(data);
    socket.emit("chat message", data);
    const audio = new Audio(sound3);
    audio.play();
  }

  const fetchOfflineMessages = async () => {
    try {
      let res = await api2.get("/offlinemsg");
      console.log(res.data);
      return res.data; // ye data return karega
    } catch (e) {
      console.error("Error fetching offline messages:", e);
      return { messages: [] }; // fallback
    }
  };

  useEffect(() => {
    const init = async () => {
      let offlineData = await fetchOfflineMessages();

      // Agar offlineData exist nahi karta ya messages nahi hain to seedha return
      if (!offlineData || !Array.isArray(offlineData.messages)) {
        console.log("⚡ No offline messages for this user");
        return;
      }

      const grouped = offlineData.messages.reduce((acc, msg) => {
        const uname = msg.sender_username;
        if (!acc[uname]) {
          acc[uname] = [];
        }
        // ✅ sender_type ko "other" kar diya
        acc[uname].push({ ...msg, sender_type: "other" });
        return acc;
      }, {});

      for (const [uname, msgs] of Object.entries(grouped)) {
        await ensureObjectStore(uname);
        for (const msg of msgs) {
          await addMessage(uname, msg);
        }
      }
    };
    init();
  }, [navigate]);

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
          activeChatUser?.username === msg.sender_username;

        // Agar active chat wahi hai to reciveMessage state update karo
        if (isCurrentlyActiveUser) {
          setReciveMessage(msg);
          const audio = new Audio(sound2);
          audio.play();
        } else {
          // Agar chat active nahi hai to database mein save karo as unread

          setMessageRecievedTrigger((prev) => prev + 1);

          const showMessage = {
            message_id: msg.message_id,
            message_status: msg.message_status,
            sender_username: msg.sender_username,
            receiver_username: msg.receiver_username,
            content: msg.content,
            content_type: msg.content_type,
            sender_type: "other",
            time_stamp: new Date().toISOString(),
            read: false,
          };
          await ensureObjectStore(msg.sender_username);
          await addMessage(msg.sender_username, showMessage);
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
