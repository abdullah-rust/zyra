"use client";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/global/api1";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { authEmailAtom } from "@/store/authAtoms";
import { useSetAtom } from "jotai";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();
  // Inside your LoginPage component:
  const setAuthEmail = useSetAtom(authEmailAtom);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "true") {
      router.replace("/");
    }
    setShow(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1. Validation
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Credentials",
        text: "Please enter both your email and password.",
        confirmButtonColor: "#4A00E0",
        background: "rgba(255, 255, 255, 0.9)",
        backdrop: `rgba(74, 0, 224, 0.2)`,
        customClass: {
          popup:
            "rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-md",
        },
      });
      return;
    }

    // 2. Premium Loading State
    Swal.fire({
      title: "Authenticating...",
      text: "Verifying your Zyra account",
      color: "#fff",
      background: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup:
          "rounded-[2.5rem] border border-white/20 shadow-2xl shadow-purple-500/20",
      },
    });

    try {
      const res = await api.post("/auth/login", { email, password });

      // Jotai update (Professional way to pass state)
      setAuthEmail({ email, type: "login" });

      // 3. Info Alert (OTP Required)
      Swal.fire({
        icon: "info",
        title: "Verification Required",
        text: "Your account is not verified. Redirecting to OTP verification...",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
        iconColor: "#fff",
        color: "#fff",
        background: "linear-gradient(135deg, #4A00E0 0%, #00d2ff 100%)",
        customClass: {
          popup: "rounded-[2.5rem] border border-white/20 shadow-2xl",
          timerProgressBar: "bg-white/50",
        },
      });

      setTimeout(() => {
        router.push("/otp");
      }, 2500);
    } catch (err: any) {
      // 4. Error Handling
      const errorMessage =
        err.response?.data?.message || "Invalid credentials, please try again.";

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#E22D2D",
        background: "#fff",
        customClass: {
          popup: "rounded-[2rem] border border-red-100 shadow-xl",
        },
      });
    }
  }
  return (
    show && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff] p-6">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-[420px] border border-white/20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/60 text-sm">
              Login to continue your chats on Zyra
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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

            {/* Password Input Group */}
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Forgot Password Link - Right Aligned */}
              <div className="flex justify-end px-2">
                <Link
                  href="/forgot-password"
                  className="text-xs text-white/60 hover:text-white transition-colors font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 bg-white text-[#4A00E0] font-bold rounded-2xl hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all active:scale-95 text-lg mt-2"
            >
              Sign In
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-white/50 text-sm">
              Don't have an account?
              <Link
                href="/signup"
                className="ml-2 text-white font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>
            <Link
              href="/"
              className="block text-white/30 text-xs hover:text-white transition-colors pt-4"
            >
              ← Back to Welcome
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
