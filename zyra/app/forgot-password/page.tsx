"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/global/api1";
import Swal from "sweetalert2";
import { useSetAtom } from "jotai";
import { authEmailAtom } from "@/store/authAtoms";
import { useRouter } from "next/navigation";

export default function ForgotPasswordEmailPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  // 1. Jotai atom import karo taake email save ho sake
  const setAuthEmail = useSetAtom(authEmailAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address to receive a recovery code.",
        confirmButtonColor: "#4A00E0",
        customClass: { popup: "rounded-[2rem]" },
      });
      return;
    }

    // Premium Loading State (Zyra Theme)
    Swal.fire({
      title: "Searching Account...",
      text: "Checking if this email is registered with Zyra",
      color: "#fff",
      background: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: { popup: "rounded-[2.5rem] shadow-2xl" },
    });

    try {
      const res = await api.post("/auth/forgot-password", { email });

      // 2. Save Email & Type in Jotai
      // Hum "type" bhej rahe hain taake OTP page ko pata chale kahan navigate karna hai
      setAuthEmail({
        email: email,
        type: "forgotPassword",
      });

      // 3. Success Feedback
      Swal.fire({
        icon: "success",
        title: "Code Sent!",
        text: "A password reset code has been sent to your inbox.",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
        color: "#fff",
        background: "linear-gradient(135deg, #4A00E0 0%, #00d2ff 100%)",
        customClass: { popup: "rounded-[2.5rem]" },
      });

      // 4. Navigate to OTP
      setTimeout(() => {
        router.push("/otp");
      }, 2500);
    } catch (err: any) {
      // 5. Error Handling
      const errorMessage =
        err.response?.data?.message || "Account not found or server error.";

      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: errorMessage,
        confirmButtonColor: "#E22D2D",
        background: "#fff",
        customClass: { popup: "rounded-[2rem]" },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff] p-6">
      {/* Recovery Card */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-[420px] border border-white/20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Recover Account
          </h2>
          <p className="text-white/60 text-sm">
            Enter your email address and we'll send you a code to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all font-medium"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group w-full py-4 bg-white text-[#4A00E0] font-bold rounded-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all active:scale-95 text-lg flex items-center justify-center gap-2"
          >
            Send Code
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-white/50 text-sm hover:text-white transition-colors font-medium"
          >
            Remembered password?{" "}
            <span className="text-white underline ml-1">Login</span>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-white/30 text-[10px] uppercase tracking-widest font-mono">
        Zyra Account Recovery System
      </p>
    </div>
  );
}
