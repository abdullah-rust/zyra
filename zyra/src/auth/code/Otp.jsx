"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./OTPVerificationPage.module.css";
import axios from "axios";
import Alert from "../AlertMassage";

const OTPVerificationPage = () => {
  const location = useLocation();
  const state = location.state;
  const type = state.type;
  const decodedEmail = state.email;
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const [checking, setChecking] = useState(true); // flag

  const [alertMsg, setAlertMsg] = useState("");
  const [alerType, setAlertType] = useState("");

  const apiKey = import.meta.env.VITE_API_NODEJS;

  //   async function getemail() {
  //     let email = await props.params;
  //     setEmail(email.email);
  //     setType(email.type);
  //   }

  useEffect(() => {
    const token = localStorage.getItem("token_zyra");
    if (token) {
      navigate("/", { replace: true }); // direct replace taake history me na jaye
    } else {
      setChecking(false); // ab render karna safe hai
    }
    // getemail();
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      // setCanResend(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // const handleResend = () => {
  //   setTimer(60);
  //   setCanResend(false);
  //   setOtp(new Array(6).fill(""));
  //   // Yahan tumhara resend code API call jayega
  //   alert("OTP code has been resent!");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlertMsg("");
    setAlertType("");

    const enteredOtp = otp.join("");
    // Yahan tumhari verification logic jayegi
    console.log("Verifying OTP:", enteredOtp);

    if (type == "signin" || type == "signup") {
      try {
        console.log(decodedEmail, type);

        let res = await axios.post(`${apiKey}/api/auth/${type}/code`, {
          email: decodedEmail.trim(),
          code: `${enteredOtp}`.trim(),
        });

        localStorage.setItem("token_zyra", res.data.token);

        navigate("/", { state: true });
      } catch (err) {
        setAlertMsg(err.response.data.message);
        setAlertType("error");
        console.error("Error:", err.response?.data || err.message);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      navigate("/", { replace: true });
    }
  };

  if (checking) {
    // jab tak check ho raha hai kuch bhi mat dikhayo
    return null;
  }

  return (
    <div className={styles.container}>
      <Alert message={alertMsg} type={alerType} />
      <div className={styles.card}>
        <h2 className={styles.title}>Verify Your Account</h2>
        <p className={styles.subtitle}>
          We have sent a 6-digit code to your email.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpInputGroup}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className={styles.otpInput}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          <button
            type="submit"
            className={styles.verifyBtn}
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? (
              <div className={styles.loader}>
                <div className={styles.loaderDot}></div>
                <div className={styles.loaderDot}></div>
                <div className={styles.loaderDot}></div>
              </div>
            ) : (
              "Verify"
            )}
          </button>
        </form>

        {/* <p className={styles.resendText}>
          Didn't receive the code?{" "}
          {canResend ? (
            <span onClick={handleResend} className={styles.resendLink}>
              Resend Code
            </span>
          ) : (
            <span className={styles.timerText}>Resend in {timer}s</span>
          )}
        </p> */}
      </div>
    </div>
  );
};

export default OTPVerificationPage;
