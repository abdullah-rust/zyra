import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { api } from "../../global/api";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const check = localStorage.getItem("isLogin");
    if (check) {
      setIsLogin(true);
    } else {
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);

  const validate = () => {
    if (!email.trim() || !password) {
      setError("Donon fields bharna zaroori hain.");
      return false;
    }
    // basic email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Sahi email format darj karein.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password });
      navigate("/otp", { state: { email: email, type: "login" } });
    } catch (err: any) {
      setError(err.response.data.message || err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLogin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>

        <p className={styles.sub}>
          Login to <span className={styles.brand}>Zyra Chat</span> and start
          chatting with friends.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label}>
            <span className={styles.fieldLabel}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
              aria-label="Email"
              required
            />
          </label>

          <label className={styles.label}>
            <span className={styles.fieldLabel}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              aria-label="Password"
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <span>New here?</span>
          <Link to="/signup" className={styles.link}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
