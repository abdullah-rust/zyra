import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// imports pages
import WelcomePage from "./Pages/WelcomePage/WelcomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import SignupPage from "./Pages/SignupPage/SignupPage";
import OTPVerificationPage from "./Pages/OTPVerificationPage/OTPVerificationPage";
import HomePage from "./Pages/HomePage/HomePage";
import AlertMessage from "./Components/AlertMessage/AlertMessage";
import { getItem } from "./Utils/localForageUtils";

// Import the new AppLoader component
import AppLoader from "./Components/AppLoader/AppLoader";
import { SocketProvider } from "./Utils/SocketContext";

// Import ProfileModal
import ProfileModal from "./Components/ProfileModal/ProfileModal";
import EditProfileModal from "./Components/EditProfileModal/EditProfileModal";

function App() {
  const [login, setLogin] = useState<boolean | null>(null); // null = checking auth

  useEffect(() => {
    const checkLogin = async () => {
      // Simulate network delay for a moment to show off the cool loader
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const data = await getItem("isLogin");
      setLogin(data === true); // true ya false dono handle
    };
    checkLogin();
  }, []);

  if (login === null) {
    // AB YAHAN HUMARA MAST LOADER CHALEGA!
    return <AppLoader />;
  }

  return (
    <>
      <AlertMessage />

      {/* Global Profile Modal - Har page pe available rahega */}
      <ProfileModal />
      <EditProfileModal />
      <Routes>
        <Route
          path="/"
          element={
            login ? (
              <SocketProvider>
                {" "}
                <HomePage />
              </SocketProvider>
            ) : (
              <WelcomePage />
            )
          }
        />
        <Route
          path="login"
          element={login ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="signup"
          element={login ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route
          path="otp"
          element={login ? <Navigate to="/" /> : <OTPVerificationPage />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
