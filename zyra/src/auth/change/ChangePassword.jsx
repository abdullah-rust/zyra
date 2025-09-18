import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Fgp.module.css";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    setPasswordMatchError(false);
    setIsLoading(true);

    // Yahan aap backend API ko call karenge password reset ke liye
    // Example: axios.post('your-api-url/reset-password', { email, newPassword });

    // Dummy API call
    setTimeout(() => {
      console.log("Password reset for:", email);
      setIsLoading(false);
      // Success hone par login page par redirect kar sakte hain
    }, 2000);
  };

  return (
    <main className={styles.fgpContainer}>
      <div className={styles.fgpCard}>
        <h1 className={styles.title}>Reset Your Password</h1>
        <p className={styles.subtitle}>
          Enter your email and a new password below.
        </p>

        <form onSubmit={handleReset} className={styles.fgpForm}>
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

          {/* New Password Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {passwordMatchError && (
            <p className={styles.errorMessage}>New passwords do not match.</p>
          )}

          <button
            type="submit"
            className={styles.resetButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.loader}></div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className={styles.loginText}>
          Remember your password?{" "}
          <Link to="/login" replace>
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
