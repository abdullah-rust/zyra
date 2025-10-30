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
  IoPersonOutline,
  IoCreateOutline,
} from "react-icons/io5";
import styles from "./SignupPage.module.css";
import { SignupApi } from "../../Api/SingupAPI";
import { alertAtom } from "../../jotai/alertAtom";
import { useSetAtom } from "jotai";

// Framer Motion Variants (Same style for smooth page transitions)
const pageVariants: Variants = {
  initialState: { opacity: 0, x: -100 },
  entry: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween" as const,
      duration: 0.4,
    },
  },
  exitState: {
    opacity: 0,
    x: 100,
    transition: {
      type: "tween" as const,
      duration: 0.3,
    },
  },
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const setAlert = useSetAtom(alertAtom);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const res = await SignupApi(name, username, email, password);
    if (res === true) {
      navigate("/otp", { state: { email: email, typeSubmit: "SignUp" } });
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
      className={styles.signupContainer}
      variants={pageVariants}
      initial="initialState"
      animate="entry"
      exit="exitState"
    >
      {/* Back Button */}
      <motion.button
        className={styles.backButton}
        onClick={() => navigate("/welcome")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Go back to Welcome page"
      >
        <IoArrowBack size={24} />
      </motion.button>

      <h2 className={styles.title}>Create Your Account</h2>
      <p className={styles.subtitle}>Join Zyra and start chatting!</p>

      <motion.form
        className={styles.signupForm}
        onSubmit={handleSignup}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      >
        {/* Name Input */}
        <motion.div className={styles.inputGroup} whileHover={{ x: 3 }}>
          <IoPersonOutline className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
            required
          />
        </motion.div>

        {/* Username Input */}
        <motion.div className={styles.inputGroup} whileHover={{ x: 3 }}>
          <IoCreateOutline className={styles.inputIcon} />
          <input
            type="text"
            placeholder="Username (Unique)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.inputField}
            required
          />
        </motion.div>

        {/* Email Input */}
        <motion.div className={styles.inputGroup} whileHover={{ x: 3 }}>
          <IoMailOutline className={styles.inputIcon} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            required
          />
        </motion.div>

        {/* Password Input with Toggle */}
        <motion.div className={styles.inputGroup} whileHover={{ x: 3 }}>
          <IoLockClosedOutline className={styles.inputIcon} />
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            required
            minLength={8} // Best practice
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

        {/* Signup Button */}
        <motion.button
          type="submit"
          className={styles.signupButton}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 5px 20px rgba(0, 123, 255, 0.5)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <IoCreateOutline size={20} />
          {loading ? "Registering...." : " Register Account"}
        </motion.button>
      </motion.form>

      <p className={styles.loginLink}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </motion.div>
  );
};

export default SignupPage;
