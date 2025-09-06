"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useCheckAuth(redirectTo = "/dashboard") {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push(redirectTo); // token hai toh redirect
    }
  }, [router, redirectTo]);
}
