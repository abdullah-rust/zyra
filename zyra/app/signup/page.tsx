"use client";

import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/global/api1";
import Swal from "sweetalert2";
import { authEmailAtom } from "@/store/authAtoms";
import { useSetAtom } from "jotai";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "true") {
      router.replace("/");
    }
    setShow(true);
  }, []);

  // Inside your SignupPage component:
  const setAuthEmail = useSetAtom(authEmailAtom);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Basic Client-side Validation
    if (!fullName || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Details Required",
        text: "Jani, please fill in all the fielduseEffects to create your account.",
        confirmButtonColor: "#4A00E0",
        customClass: { popup: "rounded-[2rem]" },
      });
      return;
    }

    // 2. Premium Loading State (Zyra Style)
    Swal.fire({
      title: "Creating Account...",
      text: "Setting up your Zyra profile, please wait",
      color: "#fff",
      background: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "rounded-[2.5rem] shadow-2xl shadow-purple-500/20",
      },
    });

    try {
      const res = await api.post("/auth/signup", {
        name: fullName,
        email,
        password,
      });

      setAuthEmail({
        email,
        type: "signup",
      });

      // 4. Success Alert
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "A 6-digit verification code has been sent to your email.",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
        color: "#fff",
        background: "linear-gradient(135deg, #4A00E0 0%, #00d2ff 100%)",
        customClass: { popup: "rounded-[2.5rem]" },
      });

      // 5. Navigate to OTP Page
      setTimeout(() => {
        router.push("/otp");
      }, 3000);
    } catch (err: any) {
      // 6. Error Handling (Email already exists, etc.)
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again later.";

      Swal.fire({
        icon: "error",
        title: "Signup Error",
        text: errorMessage,
        confirmButtonColor: "#E22D2D",
        background: "#fff",
        customClass: { popup: "rounded-[2rem] shadow-xl" },
      });

      console.error("Signup Error:", errorMessage);
    }
  };
  return (
    show && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff] p-6">
        {/* Signup Card */}
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-[420px] border border-white/20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-white/60 text-sm">
              Join Zyra and start chatting with style
            </p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all"
                required
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Create Password"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full py-4 bg-white text-[#4A00E0] font-bold rounded-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all active:scale-95 text-lg mt-4"
            >
              Get Started
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              Already have an account?
              <Link
                href="/login"
                className="ml-2 text-white font-bold hover:underline"
              >
                LogIn
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-10 text-white/30 text-[10px] font-mono uppercase tracking-[0.2em]">
          Zyra Secure Registration
        </p>
      </div>
    )
  );
}
