"use client";

import { useEffect, useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authEmailAtom } from "@/store/authAtoms";
import { useAtom } from "jotai";
import api from "@/global/api1";
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authEmail, setAuthEmail] = useAtom(authEmailAtom); // Simple useAtom like useState
  const [show, setShow] = useState(false);
  const router = useRouter();

  // 1. Security Check: Agar token nahi hai toh login pe bhej do
  useEffect(() => {
    if (!authEmail?.token) {
      router.push("/login");
    } else {
      setShow(true);
    }
  }, [authEmail, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Client-side Validations
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Match Error",
        text: "Passwords do not match, jani! Check again.",
        confirmButtonColor: "#E22D2D",
        customClass: { popup: "rounded-[2rem]" },
      });
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Security Alert",
        text: "Password must be at least 8 characters long.",
        confirmButtonColor: "#4A00E0",
        customClass: { popup: "rounded-[2rem]" },
      });
      return;
    }

    // 3. Loading State
    Swal.fire({
      title: "Updating Password...",
      text: "Securing your Zyra account",
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
      await api.post("/auth/change-password", {
        email: authEmail?.email,
        newpassword: password,
        resettoken: authEmail?.token,
      });

      // 4. Success Alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Password updated! Redirecting to login...",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
        background: "linear-gradient(135deg, #4A00E0 0%, #00d2ff 100%)",
        color: "#fff",
        customClass: { popup: "rounded-[2.5rem]" },
      });

      // 5. Cleanup & Navigate
      setTimeout(() => {
        setAuthEmail(undefined);
        router.replace("/login");
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid or expired token.";
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: msg,
        confirmButtonColor: "#E22D2D",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff] p-6">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-[420px] border border-white/20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">New Password</h2>
          <p className="text-white/60 text-sm">
            Create a strong password for Zyra
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <CheckCircle2 className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white text-[#4A00E0] font-bold rounded-2xl hover:shadow-xl transition-all active:scale-95 text-lg mt-4"
          >
            Update Password
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="text-white/50 text-sm hover:text-white transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
