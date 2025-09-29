import { useEffect, useState } from "react";
import { api } from "../global/api";
import styles from "./ProfilePage.module.css";
import profileIcon from "/account.png";

interface UserProfile {
  username: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
        setFormData(res.data);
        localStorage.setItem("username", res.data.username);
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file as any });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      if (formData.name) form.append("name", formData.name);
      if (formData.bio) form.append("bio", formData.bio);
      if (formData.image) form.append("image", formData.image as any);

      const res = await api.post("/profile/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setEditMode(false);
      setImagePreview(null);
    } catch (err) {
      console.error("Profile update error", err);
    }
  };

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Profile Image */}
        <div className={styles.imageWrapper}>
          <img
            src={imagePreview || profile?.image || profileIcon}
            alt="profile"
            className={styles.image}
          />
          {editMode && (
            <input type="file" accept="image/*" onChange={handleImageChange} />
          )}
        </div>

        {/* User Info */}
        {!editMode ? (
          <>
            <h2 className={styles.name}>{profile?.name}</h2>
            <p className={styles.username}>@{profile?.username}</p>
            <p className={styles.bio}>{profile?.bio || "No bio yet..."}</p>
            <button className={styles.button} onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <div className={styles.form}>
            <input
              name="name"
              placeholder="Your name"
              value={formData.name || ""}
              onChange={handleChange}
              className={styles.input}
            />
            <textarea
              name="bio"
              placeholder="Write your bio..."
              value={formData.bio || ""}
              onChange={handleChange}
              className={styles.textarea}
            />
            <div className={styles.actions}>
              <button className={styles.button} onClick={handleSave}>
                Save
              </button>
              <button
                className={styles.buttonOutline}
                onClick={() => {
                  setEditMode(false);
                  setFormData(profile || {});
                  setImagePreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
