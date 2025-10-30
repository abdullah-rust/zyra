import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import {
  IoArrowBack,
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoLogIn,
} from "react-icons/io5";
import styles from "./LoginPage.module.css";
import { LoginApi } from "../../Api/LoginAPI";
import { alertAtom } from "../../jotai/alertAtom";
import { useSetAtom } from "jotai";

// Framer Motion Variants (Type Error Fix ke saath)
const pageVariants: Variants = {
  initialState: { opacity: 0, x: 100 },
  entry: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween" as const, // 'as const' se TypeScript ko pata chalta hai ki yeh string fixed hai
      duration: 0.4,
    },
  },
  exitState: {
    opacity: 0,
    x: -100,
    transition: {
      type: "tween" as const,
      duration: 0.3,
    },
  },
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const setAlert = useSetAtom(alertAtom);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const res = await LoginApi(email, password);

    if (res === true) {
      navigate("/otp", { state: { email: email, typeSubmit: "Login" } });
    } else {
      setAlert({
        visible: true,
        message: res || "Something went wrong",
        type: "error",
      });
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <motion.div
      className={styles.loginContainer}
      variants={pageVariants}
      initial="initialState" // Updated variant name
      animate="entry" // Updated variant name
      exit="exitState" // Updated variant name
    >
      {/* Back Button */}
      <motion.button
        className={styles.backButton}
        onClick={() => navigate("/welcome")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoArrowBack size={24} />
      </motion.button>

      <h2 className={styles.title}>Welcome Back!</h2>
      <p className={styles.subtitle}>Sign in to your Zyra account.</p>

      <motion.form
        className={styles.loginForm}
        onSubmit={handleLogin}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      >
        {/* Email Input */}
        <motion.div
          className={styles.inputGroup}
          whileHover={{ x: 3 }} // Thoda subtle animation
        >
          <IoMailOutline className={styles.inputIcon} />
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
          />
        </motion.div>

        {/* Password Input with Toggle */}
        <motion.div
          className={styles.inputGroup}
          whileHover={{ x: 3 }} // Thoda subtle animation
        >
          <IoLockClosedOutline className={styles.inputIcon} />
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
          />
          <motion.button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
            whileTap={{ scale: 0.9 }}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </motion.button>
        </motion.div>

        {/* Forgot Password Link */}
        <p className={styles.forgotPassword}>
          <a href="/forgot-password">Forgot Password?</a>
        </p>

        {/* Login Button */}
        <motion.button
          type="submit"
          className={styles.loginButton}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 5px 20px rgba(0, 123, 255, 0.5)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <IoLogIn size={20} />

          {loading ? "Signing...." : "Sign In"}
        </motion.button>
      </motion.form>

      <p className={styles.signupLink}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </motion.div>
  );
};

export default LoginPage;
