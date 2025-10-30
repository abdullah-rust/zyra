import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  IoChatbubbleEllipsesOutline,
  IoLogIn,
  IoPersonAdd,
} from "react-icons/io5"; // react-icons ka istemaal
import styles from "./WelcomePage.module.css";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.welcomeContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Logo aur Title Section */}
      <motion.div className={styles.header} variants={itemVariants}>
        <motion.div
          className={styles.iconCircle}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <IoChatbubbleEllipsesOutline size={48} className={styles.icon} />
        </motion.div>
        <h1 className={styles.title}>Zyra Chat</h1>
      </motion.div>

      {/* 2. Description Section */}
      <motion.p className={styles.tagline} variants={itemVariants}>
        **Real-time messaging, redefined.** <br />
        Connect with speed, security, and style.
      </motion.p>

      {/* 3. Action Buttons Section */}
      <motion.div className={styles.actions} variants={itemVariants}>
        {/* Login Button (Filled/Primary) */}
        <motion.button
          className={`${styles.authButton} ${styles.loginBtn}`}
          onClick={() => navigate("/login")}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(0, 123, 255, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <IoLogIn size={20} /> Login
        </motion.button>

        {/* Signup Button (Outline/Secondary) */}
        <motion.button
          className={`${styles.authButton} ${styles.signupBtn}`}
          onClick={() => navigate("/signup")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoPersonAdd size={20} /> Sign Up
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomePage;
