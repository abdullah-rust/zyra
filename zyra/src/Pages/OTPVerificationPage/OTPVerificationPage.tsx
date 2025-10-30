import React, { useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { IoArrowBack, IoShieldCheckmarkOutline } from "react-icons/io5";
import styles from "./OTPVerificationPage.module.css";
import { alertAtom } from "../../jotai/alertAtom";
import { useSetAtom } from "jotai";
import { OTPApi } from "../../Api/OTPAPI";
import { setItem } from "../../Utils/localForageUtils";
import { SetMyDataApi } from "../../Api/SetMydataAPI";

// Framer Motion Variants
const pageVariants: Variants = {
  initialState: { opacity: 0, scale: 0.9 },
  entry: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const, // Thoda bouncy feel
      stiffness: 100,
      damping: 10,
    },
  },
  exitState: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
    },
  },
};

const OTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const typeSubmit = location.state?.typeSubmit;
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const setAlert = useSetAtom(alertAtom);
  const [loading, setLoading] = useState(false);
  // Array of motion variants for each OTP box
  const boxVariants = useMemo(
    () => ({
      initial: { scale: 0.5, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
    }),
    []
  );

  const handleOTPChange = (e: any, index: number) => {
    const value = e.target.value;

    if (/[^0-9]/.test(value) && value !== "") return; // Sirf numbers allowed

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Sirf last digit lo
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-focus previous input on backspace/delete
    if (
      value === "" &&
      index > 0 &&
      e.nativeEvent.inputType === "deleteContentBackward"
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setAlert({
        message: "Please enter the full 6-digit code.",
        visible: true,
        type: "error",
      });
      return;
    }

    const res = await OTPApi(email, fullOtp, typeSubmit);
    const res2 = await SetMyDataApi();

    if (res === true) {
      if (typeof res2 == "string") {
        setAlert({
          visible: true,
          message: res2 || "Something went wrong",
          type: "error",
        });
      } else {
        await setItem("isLogin", true);
        await setItem("userId", res2.data?.profile.id);
        window.location.replace("/");
      }
      // ✅ cleaner redirect
    } else {
      setAlert({
        visible: true,
        message: res || "Something went wrong",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <motion.div
      className={styles.otpContainer}
      variants={pageVariants}
      initial="initialState"
      animate="entry"
      exit="exitState"
    >
      {/* Back Button */}
      <motion.button
        className={styles.backButton}
        onClick={() => navigate(-1)} // Pichle page par wapas
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoArrowBack size={24} />
      </motion.button>

      <IoShieldCheckmarkOutline size={60} className={styles.headerIcon} />
      <h2 className={styles.title}>Verify Account</h2>
      <p className={styles.subtitle}>
        We sent a 6-digit code to your email.
        <h1>{email}</h1>
        <br /> Please enter it below.
      </p>

      <motion.form
        className={styles.otpForm}
        onSubmit={handleVerify}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
      >
        {/* OTP Inputs */}
        <motion.div
          className={styles.otpInputs}
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.05 }} // Ek-ek karke box aaye
        >
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(e, index)}
              className={styles.otpInputBox}
              variants={boxVariants}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>

        {/* Verify Button */}
        <motion.button
          type="submit"
          className={styles.verifyButton}
          disabled={otp.join("").length !== 6} // Agar 6 digits complete na ho toh disabled
          whileHover={{
            scale: 1.02,
            boxShadow: "0 5px 20px rgba(0, 123, 255, 0.5)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Verifying...." : "Verify Code"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default OTPVerificationPage;
