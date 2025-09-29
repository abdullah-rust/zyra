import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import profileIcon from "/account.png";

// Hum yahan ek dummy profile icon istemal kar rahe hain, aap baad mein isko replace kar sakte hain
const ProfileIcon = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.profileIcon} onClick={() => navigate("/profile")}>
      {/* Yahan aap user ki DP/Avatar laga sakte hain */}
      <span role="img" aria-label="profile">
        <img src={profileIcon} alt="profile" className={styles.profileIcon} />
      </span>
    </div>
  );
};

const Header = () => {
  return (
    // headerWrapper mein background color aur shadow hoga
    <header className={styles.headerWrapper}>
      {/* Left side: Profile Icon */}
      <ProfileIcon />

      {/* Center: App Name with Gradient */}
      <div className={styles.appName}>
        {/* Gradient-text class se text mein gradient aayega */}
        <h1 className={styles.gradientText}>Zyra</h1>
      </div>

      {/* Right side: Yahan hum search/options icon add kar sakte hain, abhi khaali rakhte hain */}
      <div className={styles.spacer}></div>
    </header>
  );
};

export default Header;
