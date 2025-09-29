import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import WelcomePage from "./components/welcome/WelcomePage";
import LoginPage from "./auth/login/LoginPage";
import SignupPage from "./auth/signup/SignupPage";
import OtpVerify from "./auth/otp/OtpVerify";
import SearchPage from "./search/SearchPage";
import { SocketProvider } from "./SocketContext";
import ChatPage from "./chat/ChatPage";
import ProfilePage from "./profile/ProfilePage";
import { useEffect, useState } from "react";
import { addContact, addMessage, ensureObjectStore } from "./database/db";
import { api, api2 } from "./global/api";

function App() {
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    const init = async () => {
      let offlineData = await fetchOfflineMessages();

      if (offlineData && Array.isArray(offlineData.messages)) {
        const grouped = offlineData.messages.reduce((acc: any, msg: any) => {
          const uname = msg.sender_username;
          if (!acc[uname]) {
            acc[uname] = [];
          }
          acc[uname].push(msg);
          return acc;
        }, {} as Record<string, any[]>);

        for (const [uname, msgs] of Object.entries(grouped as any)) {
          await ensureObjectStore(uname);
          for (const msg of msgs as any[]) {
            await addMessage(uname, msg);
          }

          // 👇 unknown ko bhi contact me add karna
          let res = await api.post("/search", { username: uname });
          if (res.data.users && res.data.users.length > 0) {
            let user = res.data.users[0];
            await addContact(user);
          } else {
            console.warn("⚠️ User not found in search:", uname);
          }
        }
      } else {
        console.log("⚡ No offline messages for this user");
      }

      setInitDone(true); // ✅ sync complete hone ke baad true
    };

    init();
  }, []);

  const fetchOfflineMessages = async () => {
    try {
      let res = await api2.get("/offlinemsg");
      return res.data;
    } catch (e) {
      console.error("Error fetching offline messages:", e);
      return { messages: [] };
    }
  };

  if (!initDone) {
    // 👇 sync hone tak loading dikhayenge
    return <div>Loading...</div>;
  }

  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;
