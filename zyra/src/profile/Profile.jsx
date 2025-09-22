import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { api } from "../global/api";
import profileIcon from "../assets/profile.png";
export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/profile");

        console.log(res.data);

        const data = await res.data;
        setUserData(data);
        localStorage.setItem("username", data.username);
        localStorage.setItem("id", data.id);
        localStorage.setItem("img_link", data.img_link);
      } catch (err) {
        console.error(err);
        setError("Data fetch karne mein masla hua.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <main className={styles.profileContainer}>
        <p className={styles.loadingText}>Profile loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.profileContainer}>
        <p className={styles.errorText}>{error}</p>
      </main>
    );
  }

  const isCurrentUserProfile = userData.id;

  const handleEditClick = () => {
    console.log("Edit button click ho gaya!");
  };

  return (
    <main className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {isCurrentUserProfile && (
          <button onClick={handleEditClick} className={styles.editButton}>
            Edit Profile
          </button>
        )}
        <img
          src={userData.img_link || profileIcon}
          alt={`${userData.username}'s profile`}
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h1 className={styles.username}>@{userData.username}</h1>
          <p className={styles.name}>{userData.name}</p>
          <p className={styles.email}>{userData.email}</p>
          <hr className={styles.divider} />
          <p className={styles.bio}>{userData.bio}</p>
        </div>
      </div>
    </main>
  );
}

// const response = await new Promise((resolve) => {
//           setTimeout(() => {
//             const dummyData = {
//               username: "AbdullahRust",
//               name: "Abdullah",
//               email: "abdullah@example.com",
//               bio: "Jani, Rust meri favourite language hai. Backend, blockchain aur system programming mein mazza aata hai.",
//               imageUrl: "https://via.placeholder.com/150",
//               id: "24682012-e583-48d1-b263-844498d6fd73", // User ID add kar diya
//             };
//             resolve({ ok: true, json: () => dummyData });
//           }, 1500);
