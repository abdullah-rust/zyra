import styles from "./Header.module.css";
import { motion } from "motion/react";
import { FaUserCircle } from "react-icons/fa";
import { useAtom } from "jotai";
import { isProfileModalVisibleAtom } from "../../jotai/profileAtoms";

const Header = () => {
  const [, setIsProfileModalVisible] = useAtom(isProfileModalVisibleAtom);

  const handleProfileClick = () => {
    setIsProfileModalVisible(true);
  };

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.logo}>
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Zyra
        </motion.span>
      </div>

      <motion.div
        className={styles.profile}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
      >
        <FaUserCircle className={styles.icon} />
        <span className={styles.username}>Profile</span>
      </motion.div>
    </motion.header>
  );
};

export default Header;
