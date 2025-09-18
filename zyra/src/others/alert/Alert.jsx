import { useEffect, useState } from "react";
import styles from "./Alert.module.css";

export default function Alert({ message, type }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Jab bhi naya message aaye, alert ko visible karen
    if (message) {
      setVisible(true);

      // 5 seconds ke baad alert ko hide kar den
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      // Jab component unmount ho ya message badle to timer ko clear karen
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  // Agar visible na ho to kuch render na karen
  if (!visible || !message) {
    return null;
  }

  // Type ke hisab se CSS class set karen
  const alertClass = `${styles.alert} ${styles[type]}`;

  return (
    <div className={alertClass}>
      <p className={styles.message}>{message}</p>
      <button className={styles.closeButton} onClick={() => setVisible(false)}>
        &times;
      </button>
    </div>
  );
}
