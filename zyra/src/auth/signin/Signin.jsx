"use client";

import React, { useState, useEffect } from "react";
import styles from "./SignInPage.module.css";
import Alert from "../AlertMassage";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignInPage = () => {
  const [checking, setChecking] = useState(true); // flag
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [type, settype] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_API_NODEJS;

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSignin(e) {
    e.preventDefault();
    setAlertMsg("");
    settype("");

    setIsLoading(true);
    if (!email.trim() || !password.trim()) {
      setAlertMsg("Please fill all fields.");
      settype("error");
      return;
    }

    try {
      const res = await axios.post(`${apiKey}/api/auth/signin`, {
        email: email,
        password: password,
      });

      setAlertMsg(res.data.message);
      settype("info");

      navigate("/auth/code", { state: { email: email, type: "signin" } });
    } catch (err) {
      setAlertMsg(err.response.data.message);
      settype("error");
      console.error("Error:", err.response?.data || err.message);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div className={styles.container}>
      <Alert message={alertMsg} type={type} />
      <div className={styles.card}>
        <h2 className={styles.title}>Sign In to Zyra</h2>
        <p className={styles.subtitle}>
          Welcome back! Please enter your details.
        </p>
        <form className={styles.form} onSubmit={handleSignin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles.passwordInput}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={togglePasswordVisibility}
                className={styles.passwordToggle}
              >
                {/* SVG for eye icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.024 10024 0 0112 21c-4.97 0-9-3.582-9-8s4.03-8 9-8c1.928 0 3.791.56 5.375 1.625M17.875 18.825L21 21m-3.125-2.175L13.875 18.825m0 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  )}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={styles.signUpBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.loader}>
                <div className={styles.loaderDot}></div>
                <div className={styles.loaderDot}></div>
                <div className={styles.loaderDot}></div>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
