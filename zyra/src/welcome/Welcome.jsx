import React, { useEffect, useState } from "react";
// WelcomePage.module.css se styles import karein
import styles from "./WelcomePage.module.css";
import { useNavigate } from "react-router-dom";

// Main App component jo entry point ke roop mein kaam karta hai
// Ab yeh CSS modules ka use karke component-specific styling ko handle karta hai.
const Welcome = () => {
  const [checking, setChecking] = useState(true); // flag
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token_zyra");
    if (token) {
      navigate("/", { replace: true }); // direct replace taake history me na jaye
    } else {
      setChecking(false); // ab render karna safe hai
    }
  }, [navigate]);

  if (checking) {
    // jab tak check ho raha hai kuch bhi mat dikhayo
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Zyra</h1>

        <p className={styles.description}>
          A superior chat application designed for your needs, featuring secure
          and end-to-end encrypted messaging, file sharing, and high-quality
          audio/video calls.
        </p>

        {/* Professional look ke liye icons ke saath features list */}
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.794a8.966 8.966 0 01-.937-4.254c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Chat</span>
          </div>
          <div className={styles.featureItem}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure</span>
          </div>
          <div className={styles.featureItem}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Audio/Video</span>
          </div>
        </div>

        {/* Sign In aur Sign Up ke liye buttons */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.signInBtn} ${styles.button}`}
            onClick={() => {
              navigate("/auth/signin");
            }}
          >
            Sign In
          </button>
          <button
            className={`${styles.signUpBtn} ${styles.button}`}
            onClick={() => {
              navigate("/auth/signup");
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
