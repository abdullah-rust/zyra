import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketContext } from "../SocketContext";
import styles from "./ChatPage.module.css";
import {
  ensureObjectStore,
  getMessages,
  addMessage,
  addContact,
} from "../database/db";
import { api } from "../global/api";

interface Message {
  message_id: string;
  sender_username: string | null;
  receiver_username: string;
  content: string;
  content_type: string;
  time_stamp?: string;
  sender_type: string;
  read?: boolean;
  username?: string;
}

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  img_link: string;
}

const ChatPage = () => {
  const location = useLocation();
  const activeUser = location.state.user as UserData; // search se aaya user data
  const socket = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // Scroll bottom jab message aaye
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      if (!activeUser || !username) {
        navigate("/", { replace: true });
        return;
      }

      await ensureObjectStore(activeUser.username);
      const oldMessages: any = await getMessages(activeUser.username);
      setMessages(oldMessages || []);
    };

    init();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket || !activeUser?.username) return;

    const handleMessage = async (msg: any) => {
      if (msg.sender_username === activeUser?.username) {
        // Active chat ke andar message mila
        msg.read = true; // 👈 turant read
        setMessages((prev) => [...prev, msg]);

        await ensureObjectStore(activeUser.username);
        await addMessage(activeUser.username, msg);
      } else {
        // Dusre user ka message
        msg.read = false;
        await ensureObjectStore(msg.sender_username || "unknown");
        await addMessage(msg.sender_username || "unknown", msg);
        let res = await api.post("/search", { username: msg.sender_username });
        if (res.data.users && res.data.users.length > 0) {
          let user = res.data.users[0];
          await addContact(user);
        } else {
          console.warn("⚠️ User not found in search:", msg.sender_username);
        }
      }
    };

    socket.on("chat message", handleMessage);

    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [socket, activeUser?.username]);

  // Send message
  const handleSend = () => {
    if (!newMessage.trim() || !socket) return;

    const msg: any = {
      message_id: Date.now().toString(),
      sender_username: username || null,
      receiver_username: activeUser.username,
      content: newMessage,
      content_type: "text",
      time_stamp: new Date().toISOString(),
      sender_type: "user",
      read: false,
    };

    socket.emit("chat message", msg);

    msg.read = true;

    setMessages((prev) => [...prev, msg]);
    const saveMessage = async () => {
      await ensureObjectStore(activeUser.username);
      await addMessage(activeUser.username, msg);
    };
    saveMessage();
    setNewMessage("");
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.avatar}>
          {activeUser.img_link ? (
            <img src={activeUser.img_link} alt={activeUser.name} />
          ) : (
            <span>{activeUser.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{activeUser.name}</h2>
          <p className={styles.bio}>{"@" + activeUser.username}</p>
        </div>
      </header>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.message_id}
            className={
              msg.sender_username === username ? styles.sent : styles.received
            }
          >
            <p>{msg.content}</p>
            <span className={styles.time}>
              {new Date(msg.time_stamp || "").toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.sendBtn}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
