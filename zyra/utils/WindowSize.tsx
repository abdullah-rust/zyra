"use client";
import { useState, useEffect } from "react";

export const useWindowSize = () => {
  // Initial state undefined rakha hai taake SSR (Server Side Rendering) ka masla na ho
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    device: "",
  });

  useEffect(() => {
    // Function jo width check kar ke device ka naam batayega
    const handleResize = () => {
      const width = window.innerWidth;
      let device = "";

      if (width <= 480) {
        device = "Mobile 📱";
      } else if (width > 480 && width <= 768) {
        device = "Tablet 📑";
      } else {
        device = "Desktop 💻";
      }

      setWindowSize({
        width: width,
        device: device,
      });
    };

    // Event listener add karna
    window.addEventListener("resize", handleResize);
    
    // Pehli baar run karna taake initial size mil jaye
    handleResize();

    // Cleanup taake memory leak na ho
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};