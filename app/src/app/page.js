"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
export default function Home() {
  const [checking, setChecking] = useState(true); // flag
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token_zyra");
    if (!token) {
      router.replace("/welcome"); // direct replace taake history me na jaye
    } else {
      setChecking(false); // ab render karna safe hai
    }
  }, [router]);

  if (checking) {
    // jab tak check ho raha hai kuch bhi mat dikhayo
    return null;
  }

  return (
    <div className={styles.page}>
      <h1>Hello wrold</h1>
    </div>
  );
}
