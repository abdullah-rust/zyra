"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "true") {
      router.replace("/");
    }
    setShow(true);
  }, []);

  return (
    show && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8E2DE2] via-[#4A00E0] to-[#00d2ff] p-4">
        {/* Container for glassmorphism effect */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-white/20">
          {/* Zyra Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
              <Image
                src="/icon.png"
                alt="Zyra Icon"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-4xl font-bold text-white mb-2">Zyra</h1>
          <p className="text-white/80 mb-10 text-sm font-medium">
            Real-time chat, real-time life.
          </p>

          {/* Buttons Section */}
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              className="w-full py-3 bg-white text-[#4A00E0] font-bold rounded-xl hover:bg-opacity-90 transition-all active:scale-95 shadow-lg"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="w-full py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#4A00E0] transition-all active:scale-95"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-8 text-white/50 text-xs">Built with ❤️ by Abdullah</p>
      </div>
    )
  );
}
