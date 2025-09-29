import { useState, useEffect } from "react";
import styles from "./OtpVerify.module.css";
import AlertMessage from "../../components/AlertMessage/AlertMessage";
import { api } from "../../global/api";
import { useLocation, useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setdata] = useState<any>(null);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (!location.state) {
      console.log("No state found, navigating to login page.");
      navigate("/login", { replace: true });
    } else {
      setdata(location.state);
    }

    let check = localStorage.getItem("isLogin");
    if (check) {
      navigate("/", { replace: true });
    }
  }, [location.state]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input automatically
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    try {
      await api.post("/auth/code", {
        email: data.email,
        code: otpCode,
        typesubmit: data.type,
      });
      localStorage.setItem("isLogin", "true");
      navigate("/", { replace: true });
    } catch (err: any) {
      setAlert({
        message: err.response.data.message || err.response.data.error,
        type: "error",
      });
    }

    // yahan backend call karna hoga
  };
  const handleAlertClose = () => {
    setAlert(null);
  };

  return (
    <div>
      {alert && (
        <AlertMessage
          message={alert.message}
          type={alert.type}
          onClose={handleAlertClose}
        />
      )}
      <div className={styles.otpWrapper}>
        <h2 className={styles.title}>Verify OTP</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className={styles.otpInput}
              />
            ))}
          </div>
          <button type="submit" className={styles.verifyBtn}>
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;

// 462389;
