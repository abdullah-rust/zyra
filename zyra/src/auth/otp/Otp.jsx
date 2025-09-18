import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Otp.module.css";
import api from "../../global/api";
import Alert from "../../others/alert/Alert";

export default function Otp() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [data, setdata] = useState("");
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: "",
    type: "",
  });

  useEffect(() => {
    if (!location.state) {
      console.log("No state found, navigating to login page.");
      navigate("/login", { replace: true });
    } else {
      setdata(location.state);
    }

    const isLoggedIn = localStorage.getItem("is_login");
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const fullOtp = otp.join("");

    try {
      const res = await api.post("/auth/code", {
        email: data.email,
        code: fullOtp,
        typesubmit: data.type,
      });

      localStorage.setItem("is_login", true);
      navigate("/", { replace: true });
    } catch (err) {
      setAlert({
        message: err.response.data.message || err.response.data.error,
        type: "error",
      });
      console.error("Error:", err.response?.data || err.message);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <main className={styles.otpContainer}>
      <Alert message={alert.message} type={alert.type} />

      <div className={styles.otpCard}>
        <h1 className={styles.title}>OTP Verification</h1>
        <p className={styles.subtitle}>
          Please enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleVerify}>
          <div className={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className={styles.otpInput}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          <button
            type="submit"
            className={styles.verifyButton}
            disabled={isLoading}
          >
            {isLoading ? <div className={styles.loader}></div> : "Verify"}
          </button>
        </form>
      </div>
    </main>
  );
}
