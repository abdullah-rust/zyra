import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";
import { api } from "../../global/api";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setError("Sab fields bharna zaroori hain.");
      return false;
    }
    if (username.length < 8) {
      setError("Username kam az kam 8 characters ka hona chahiye.");
      return false;
    }

    if (password.length < 6) {
      setError("Password kam az kam 6 characters ka hona chahiye.");
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
      await api.post("/auth/signup", {
        name,
        username,
        email,
        password,
      });

      navigate("/otp", { state: { email, type: "signup" } });
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
    <div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Create Account</h2>

          <p className={styles.sub}>
            Join <span className={styles.brand}>Zyra Chat</span> and start
            connecting instantly.
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.label}>
              <span className={styles.fieldLabel}>Full Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="John Doe"
                required
              />
            </label>

            <label className={styles.label}>
              <span className={styles.fieldLabel}>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="johndoe"
                required
              />
            </label>

            <label className={styles.label}>
              <span className={styles.fieldLabel}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@example.com"
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
                required
              />
            </label>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <div className={styles.footer}>
            <span>Already have an account?</span>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
