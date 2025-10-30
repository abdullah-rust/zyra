import React from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import styles from "./AppLoader.module.css";

// --- Framer Motion Configuration ---

// Container variants: Staggered animation shuru karne ke liye
const containerVariants: Variants = {
  initial: {
    transition: {
      staggerChildren: 0.1, // Har dot 0.1 seconds ke baad shuru hoga
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Dot variants: Har dot ki movement define karta hai
const dotVariants: Variants = {
  initial: {
    y: "0%", // Shuru mein center mein
  },
  animate: {
    y: "100%", // Neeche jaana (jisse upar uthta hua feel ho)
    backgroundColor: ["#00BFA5", "#007bff", "#00BFA5"], // Color transition bhi add kar di
    transition: {
      duration: 0.4,
      repeat: Infinity, // Loop
      repeatType: "reverse", // Upar jaakar wapas aana
      ease: "easeInOut",
      repeatDelay: 0.2, // Har loop ke beech ka delay
    },
  },
};

const AppLoader: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <motion.div
        className={styles.dotContainer}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div className={styles.dot} variants={dotVariants} />
        <motion.div className={styles.dot} variants={dotVariants} />
        <motion.div className={styles.dot} variants={dotVariants} />
      </motion.div>
      <p className={styles.loadingText}>Zyra is connecting...</p>
    </div>
  );
};

export default AppLoader;
