import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import api from "../../global/api";
import Alert from "../../others/alert/Alert";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_login");
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username.trim() || !name.trim() || !email.trim() || !password.trim()) {
      setAlert({ message: "Please fill the All input", type: "error" });
      return;
    }

    try {
      await api.post("/auth/signup", {
        name,
        username,
        email,
        password,
      });

      navigate("/otp", { state: { email: email, type: "signup" } });
    } catch (err) {
      setAlert({
        message: err.response.data.message || err.response.data.error,
        type: "error",
      });
      console.error("Error:", err.response?.data || err.message);
    }

    setTimeout(() => {
      console.log("Signing up with:", { name, username, email, password });
      setIsLoading(false);
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className={styles.signupContainer}>
      <Alert message={alert.message} type={alert.type} />

      <div className={styles.signupCard}>
        <h1 className={styles.title}>Join Zyra Today</h1>
        <p className={styles.subtitle}>Create your account to get started</p>

        <form onSubmit={handleSignup} className={styles.signupForm}>
          {/* Name Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Username Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
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

          {/* Password Input with Hide/Unhide */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.signupButton}
            disabled={isLoading}
          >
            {isLoading ? <div className={styles.loader}></div> : "Sign Up"}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" replace={true}>
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
