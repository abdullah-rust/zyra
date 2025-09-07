import styles from "./Alert.module.css";

export default function Alert({ message, type = "info" }) {
  return <div className={`${styles.alert} ${styles[type]}`}>{message}</div>;
}
