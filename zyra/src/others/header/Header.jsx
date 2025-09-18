import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../assets/profile.png";
export default function Header() {
  const navigate = useNavigate();
  const img_link = localStorage.getItem("img_link");
  return (
    <header className={styles.header}>
      <div className={styles.appTitle}>Zyra</div>

      <div className={styles.icons}>
        <span className={styles.icon}>🔔</span>
        <span onClick={() => navigate("/profile")}>
          <img
            src={img_link || profileIcon}
            alt=""
            className={styles.profileIcon}
          />
        </span>
      </div>
    </header>
  );
}
