import Router from "express";
import Login from "./Login";
import Signup from "./Signup";
import LoginOTP from "./LoginOtp";
import SignUpOTP from "./SignupOtp";

const AuthRoutes = Router();

AuthRoutes.post("/login", Login);
AuthRoutes.post("/signup", Signup);
AuthRoutes.post("/otp", LoginOTP, SignUpOTP);

export default AuthRoutes;
