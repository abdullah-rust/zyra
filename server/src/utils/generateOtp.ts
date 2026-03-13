import crypto from "crypto";

/**
 * 6-Digit Secure OTP Generate karne ka function
 */
export const generateOTP = (): string => {
  // crypto.randomInt use karna professional standard hai
  // Ye 100,000 se 999,999 ke darmiyan number generate karega
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};
