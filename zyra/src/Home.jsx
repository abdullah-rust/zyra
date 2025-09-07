import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [checking, setChecking] = useState(true); // flag
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token_zyra");
    if (!token) {
      navigate("/welcome", { replace: true }); // direct replace taake history me na jaye
    } else {
      setChecking(false); // ab render karna safe hai
    }
  }, [navigate]);

  if (checking) {
    // jab tak check ho raha hai kuch bhi mat dikhayo
    return null;
  }

  return <h1>Hello world</h1>;
}
