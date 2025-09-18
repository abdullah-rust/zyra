import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Welcome.module.css";

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // LocalStorage mein 'is_login' key ko check kar rahe hain
    const isLoggedIn = localStorage.getItem("is_login");
    if (isLoggedIn) {
      // Agar user login hai, to use home page par redirect kar denge
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <main className={styles.welcomeContainer}>
      <h1 className={styles.welcomeTitle}>Welcome to Zyra</h1>
      <p className={styles.appDescription}>
        Zyra is a modern communication platform designed for seamless and secure
        interactions. Our app provides real-time chat, high-quality audio and
        video calls, and effortless file sharing, all within a professional and
        user-friendly interface.
      </p>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => navigate("/login")}>
          Log In
        </button>
        <button className={styles.button} onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </main>
  );
}
