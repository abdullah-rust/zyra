import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import Welcome from "./welcome/Welcome";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";
import Otp from "./auth/otp/Otp";
import ForgetPassword from "./auth/change/ChangePassword";
import Profile from "./profile/Profile";
import { useSocket } from "./global/useSocket";

function App() {
  const socket = useSocket();

  return (
    <Routes>
      <Route path="/" element={<Home socket={socket} />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/changepsw" element={<ForgetPassword />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
