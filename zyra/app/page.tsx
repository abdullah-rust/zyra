"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "false" || !isLogin) {
      router.replace("/welcome");
    }
    setShow(true);
  }, []);
  return (
    <div>
      {show && (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
          <h1 className="text-5xl font-bold text-white">Welcome to Zyra!</h1>
        </div>
      )}
    </div>
  );
}
