import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAtom } from "jotai";
import styles from "./EditProfileModal.module.css";
import { FiX, FiUpload, FiSave, FiUser, FiMail } from "react-icons/fi";
import {
  isEditProfileModalVisibleAtom,
  userProfileAtom,
  editProfileDataAtom,
} from "../../jotai/profileAtoms";

const EditProfileModal: React.FC = () => {
  const [isVisible, setIsVisible] = useAtom(isEditProfileModalVisibleAtom);
  const [user, setUser] = useAtom(userProfileAtom);
  const [editData, setEditData] = useAtom(editProfileDataAtom);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit data when modal opens
  React.useEffect(() => {
    if (isVisible) {
      setEditData(user);
    }
  }, [isVisible, user, setEditData]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);

      // Simulate upload process
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setEditData((prev) => ({
            ...prev,
            img_link: e.target?.result as string, // ✅ img_link use karo
          }));
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditData((prev) => ({
      ...prev,
      bio: e.target.value,
    }));
  };

  const handleSave = () => {
    // Update main user profile with edited data
    setUser(editData);
    setIsVisible(false);
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleRemoveImage = () => {
    setEditData((prev) => ({
      ...prev,
      img_link: undefined, // ✅ img_link use karo
    }));
  };

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

            <h2 className={styles.title}>Edit Profile</h2>

            {/* Profile Image Upload */}
            <div className={styles.imageSection}>
              <motion.div
                className={styles.avatarContainer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImageClick}
              >
                {editData.img_link ? ( // ✅ img_link check karo
                  <div className={styles.imageWrapper}>
                    <img
                      src={editData.img_link} // ✅ img_link use karo
                      alt={editData.name}
                      className={styles.avatarImage}
                    />
                    <div className={styles.uploadOverlay}>
                      <FiUpload size={24} />
                    </div>
                  </div>
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {isUploading ? (
                      <div className={styles.loadingSpinner}></div>
                    ) : (
                      <>
                        <FiUser size={32} />
                        <span className={styles.uploadText}>Upload Photo</span>
                      </>
                    )}
                  </div>
                )}
              </motion.div>

              {editData.img_link && ( // ✅ img_link check karo
                <button
                  className={styles.removeImageBtn}
                  onClick={handleRemoveImage}
                >
                  Remove Photo
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className={styles.fileInput}
              />
            </div>

            {/* ✅ Email Display (Read-only) */}
            <div className={styles.emailSection}>
              <label className={styles.label}>Email</label>
              <div className={styles.emailDisplay}>
                <FiMail className={styles.emailIcon} />
                <span className={styles.emailText}>{editData.email}</span>
                <span className={styles.emailNote}>(Cannot be changed)</span>
              </div>
            </div>

            {/* Bio Textarea */}
            <div className={styles.bioSection}>
              <label className={styles.label}>Bio</label>
              <textarea
                value={editData.bio || ""}
                onChange={handleBioChange}
                placeholder="Tell everyone about yourself..."
                className={styles.bioTextarea}
                maxLength={150}
                rows={4}
              />
              <div className={styles.charCount}>
                {editData.bio?.length || 0}/150
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              className={styles.saveButton}
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isUploading}
            >
              <FiSave className={styles.saveIcon} />
              Save Changes
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
