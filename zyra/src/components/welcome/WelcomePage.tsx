import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const WelcomePage = () => {
  const [islogin, setIslogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let check = localStorage.getItem("isLogin");
    if (!check) {
      setIslogin(true);
    } else {
      navigate("/", { replace: true });
    }
  });

  if (!islogin) {
    return <></>;
  }

  return (
    <div className={styles.wrapper}>
      {/* App Name with Gradient */}
      <h1 className={styles.gradientText}>Zyra Chat</h1>

      {/* Tagline / Description */}
      <p className={styles.description}>
        Zyra is a modern <span>chat application</span> where you can connect,
        share, and talk with your friends in real time.
      </p>

      {/* Action Buttons */}
      <div className={styles.buttonGroup}>
        <Link to="/login" className={styles.primaryBtn}>
          Login
        </Link>
        <Link to="/signup" className={styles.secondaryBtn}>
          Signup
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
