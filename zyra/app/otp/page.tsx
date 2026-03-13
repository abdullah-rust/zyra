"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { authEmailAtom } from "@/store/authAtoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import api from "@/global/api1";
import Swal from "sweetalert2";

export default function OTPPage() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [authEmail, setAuthEmail] = useAtom(authEmailAtom);
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (!authEmail) {
      router.back();
      return;
    }

    // 1. Validation (6 digits lazmi hain)
    if (finalOtp.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Code",
        text: "Jani, please enter the full 6-digit code sent to your email.",
        confirmButtonColor: "#4A00E0",
        background: "rgba(255, 255, 255, 0.9)",
        customClass: { popup: "rounded-[2rem]" },
      });
      return;
    }

    // 2. Loading State (Zyra Theme)
    Swal.fire({
      title: "Verifying Code...",
      text: "Just a second, checking your OTP",
      color: "#fff",
      background: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
        false;
      },
      customClass: { popup: "rounded-[2.5rem] shadow-2xl" },
    });

    try {
      const res = await api.post("/auth/otp", {
        email: authEmail?.email,
        code: finalOtp,
        otpType: authEmail?.type, // "login" ya "forgot" jo tumne store kiya tha
      });

      // 3. Success Feedback
      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: "Your account has been successfully verified.",
        timer: 2000,
        showConfirmButton: false,
        iconColor: "#fff",
        color: "#fff",
        background: "linear-gradient(135deg, #4A00E0 0%, #00d2ff 100%)",
        customClass: { popup: "rounded-[2.5rem]" },
      });

      // 4. Logic Based Navigation
      setTimeout(() => {
        if (authEmail.type === "forgotPassword") {
          authEmail.token = res.data.resetToken;
          setAuthEmail(authEmail);
          router.push("/change-password");
        } else {
          localStorage.setItem("isLogin", "true");
          router.replace("/");
        }
      }, 2000);
    } catch (err: any) {
      // 5. Smart Error Handling
      const errorMessage =
        err.response?.data?.message ||
        "Invalid or expired OTP. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errorMessage,
        confirmButtonColor: "#E22D2D",
        background: "#fff",
        customClass: { popup: "rounded-[2rem]" },
      });
    }
  };

  useEffect(() => {
    if (!authEmail) {
      router.replace("/welcome");
    }
    const islogin = localStorage.getItem("isLogin");
    if (islogin === "true") {
      router.replace("/");
    }
    setShow(true);
  }, [authEmail]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    // Allow only numbers
    const value = element.value.replace(/[^0-9]/g, "");
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value[value.length - 1]; // Take only the last character if multiple are pasted
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    // Handle left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle right arrow
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/[^0-9]/g, "").slice(0, 6);

    if (pastedNumbers.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedNumbers.length; i++) {
        newOtp[i] = pastedNumbers[i];
      }
      setOtp(newOtp);

      // Focus the next empty input or last input
      const nextIndex = Math.min(pastedNumbers.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    show && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff] p-4">
        <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] shadow-2xl w-full max-w-[450px] border border-white/20 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-white/20 rounded-full animate-pulse">
              <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-sans">
            Verify Identity
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mb-8">
            6-digit code has been sent to your email
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fixed: Removed flex-wrap and added fixed width container */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 w-full">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-14 sm:w-14 sm:h-16 bg-white/10 border border-white/20 rounded-xl text-center text-xl sm:text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-4 bg-white text-[#4A00E0] font-bold rounded-2xl hover:shadow-lg transition-all active:scale-95 text-base sm:text-lg"
            >
              Verify & Proceed
            </button>
          </form>
        </div>
      </div>
    )
  );
}
