import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAtom, useSetAtom } from "jotai";
import styles from "./ProfileModal.module.css";
import { FiX, FiEdit, FiMail } from "react-icons/fi";
import {
  isProfileModalVisibleAtom,
  userProfileAtom,
  isEditProfileModalVisibleAtom,
} from "../../jotai/profileAtoms";
import { FetchProfileApi } from "../../Api/FetchProfileAPI";
import { alertAtom } from "../../jotai/alertAtom";

const ProfileModal: React.FC = () => {
  const [isVisible, setIsVisible] = useAtom(isProfileModalVisibleAtom);
  const [user, setUser] = useAtom(userProfileAtom);
  const [_, setEditModalVisible] = useAtom(isEditProfileModalVisibleAtom);
  const setAlert = useSetAtom(alertAtom);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleEditClick = () => {
    setIsVisible(false);
    setEditModalVisible(true);
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const init = async () => {
      let res = await FetchProfileApi();

      if (typeof res === "string") {
        setAlert({
          visible: true,
          type: "error",
          message: res,
        });
      } else {
        // ✅ API data ko userProfileAtom main set karo
        const apiData = res.data.profile;
        setUser({
          id: apiData.id,
          name: apiData.name,
          username: apiData.username,
          email: apiData.email,
          bio: apiData.bio,
          img_link: apiData.img_link || undefined, // ✅ Agar empty string hai toh undefined karo
        });
      }
    };

    // ✅ Sirf tab fetch karo jab modal visible ho
    if (isVisible) {
      init();
    }
  }, [isVisible, setUser, setAlert]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Close Button */}
            <motion.button
              className={styles.closeButton}
              onClick={handleClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FiX size={20} />
            </motion.button>

            {/* Profile Image */}
            <motion.div
              className={styles.avatarContainer}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {user.img_link ? (
                <img
                  src={user.img_link}
                  alt={user.name}
                  className={styles.avatarImage}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {getInitial(user.name)}
                </div>
              )}
            </motion.div>

            {/* User Info */}
            <motion.div
              className={styles.userInfo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.username}>@{user.username}</p>

              {/* ✅ Email Field */}
              <motion.div
                className={styles.emailSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <FiMail className={styles.emailIcon} />
                <span className={styles.email}>{user.email}</span>
              </motion.div>

              {user.bio &&
                user.bio !== "Available" && ( // ✅ "Available" show na kare
                  <motion.p
                    className={styles.bio}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {user.bio}
                  </motion.p>
                )}
            </motion.div>

            {/* Edit Profile Button */}
            <motion.button
              className={styles.editButton}
              onClick={handleEditClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FiEdit className={styles.editIcon} />
              Edit Profile
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
