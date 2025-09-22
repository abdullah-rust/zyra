import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { api } from "../../global/api";
import Alert from "../../others/alert/Alert";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_login");
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  //////////////////////////////
  // handle login
  //////////////////////////////

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Button ko loading state mein laayein

    if (!email.trim() || !password.trim()) {
      setAlert({ message: "Please fill the All input", type: "error" });
      return;
    }

    try {
      await api.post("/auth/login", {
        email: email,
        password: password,
      });

      navigate("/otp", { state: { email: email, type: "login" } });
    } catch (err) {
      message: err.response.data.message || err.response.data.error,
        console.error("Error:", err.response?.data || err.message);
    }

    setTimeout(() => {
      setIsLoading(false); // Response aane ke baad loading state khatam
    }, 2000); // 2 seconds ka dummy wait
  };

  //////////////////////////////
  // handle render
  //////////////////////////////

  return (
    <main className={styles.loginContainer}>
      <Alert message={alert.message} type={alert.type} />
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to continue your journey</p>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/changepsw" className={styles.forgotPassword}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? <div className={styles.loader}></div> : "Log In"}
          </button>
        </form>

        <p className={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup" replace={true}>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
