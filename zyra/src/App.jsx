import "./App.css";
import { Routes, Route } from "react-router-dom";
import Welcome from "./welcome/Welcome";
import Home from "./Home";
import NotFound from "./NoteFound";
import OTPVerificationPage from "./auth/code/Otp";
import SignInPage from "./auth/signin/Signin";
import SignUpPage from "./auth/signup/Signup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/auth/signin" element={<SignInPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/auth/code" element={<OTPVerificationPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

// useContext

// Props drilling avoid karne ke liye.

// Example: dark mode toggle, user auth data pura app me share karna.

// useRef

// DOM element ko directly access karne ke liye (jaise input focus karna).

// Ya phir re-renders ke beghair values hold karne ke liye.

// useMemo

// Performance optimization (jab heavy calculation ho aur unnecessary re-run na ho).

// useCallback

// Functions ko unnecessary re-creation se bachata hai → especially jab tu props me functions pass kare.

// useReducer (
