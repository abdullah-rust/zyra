import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// import "./global.css";

const rootElement = document.getElementById("root");
const loadingScreen = document.getElementById("loading-screen");

// Sabse pehle app ko render kar den
createRoot(rootElement).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);

// // Aur phir loading screen ko hatane ke liye timeout laga den
// if (loadingScreen) {
//   setTimeout(() => {
//
//   }, 1000); // 2 seconds ka delay
// }

loadingScreen.remove();
