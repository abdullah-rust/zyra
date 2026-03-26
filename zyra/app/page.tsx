"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/utils/WindowSize";
import DesktopChat from "@/components/DesktopChat";
import MobileChat from "@/components/MobileChat";

export default function Home() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { width } = useWindowSize(); // Humne width extract kar li

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "false" || !isLogin) {
      router.replace("/welcome");
    } else {
      setShow(true);
    }
  }, [router]);

  if (!show) return null; // Hydration error se bachne ke liye

  // Check karrein ke screen size kya hai
  const isMobile = width <= 768;

  return (
    <main className="min-h-screen bg-[#0b0e11] text-white">
      {isMobile ? <MobileChat /> : <DesktopChat />}
    </main>
  );
}
