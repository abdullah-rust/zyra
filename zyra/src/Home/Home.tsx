import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import searchicon from "/search.png";
import { useSocketContext } from "../SocketContext";
import { addMessage, ensureObjectStore, addContact } from "../database/db";
import ChatList from "./ChatList";
import { api } from "../global/api";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 👈 refresh trigger
  const navigate = useNavigate();
  const socket = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = async (msg: any) => {
      await ensureObjectStore(msg.sender_username || "unknown");
      await addMessage(msg.sender_username || "unknown", msg);

      let res = await api.post("/search", { username: msg.sender_username });
      if (res.data.users && res.data.users.length > 0) {
        let user = res.data.users[0];
        await addContact(user);
      } else {
        console.warn("⚠️ User not found in search:", msg.sender_username);
      }

      // 👇 jab bhi naya message aaye refresh trigger kar do
      setRefreshKey((prev) => prev + 1);
    };

    socket.on("chat message", handleMessage);

    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    const check = localStorage.getItem("isLogin");
    if (check) {
      setIsLogin(true);
    } else {
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);

  if (!isLogin) {
    return null;
  }

  return (
    <main>
      <Header />
      {/* 👇 refreshKey change hone par ChatList dubara render hoga */}
      <ChatList key={refreshKey} />
      <div className={styles.searchButton} onClick={() => navigate("/search")}>
        <img src={searchicon} alt="search" className={styles.searchIcon} />
      </div>
    </main>
  );
}
