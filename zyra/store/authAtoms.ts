import { atom } from "jotai";

/**
 * 1. Temporary Email Atom
 * Maqsad: Signup ya Forgot Password ke waqt email ko next route (OTP/Reset)
 * tak le kar jana bina URL ganda kiye.
 */
export const authEmailAtom = atom<{
  email: string;
  type: "login" | "signup" | "forgotPassword";
  token?: string;
}>();

/**
 * 2. OTP Verification Status Atom
 * Maqsad: Check karna ke kya user ne OTP verify kar liya hai?
 * Isay tum conditional rendering ke liye use kar sakte ho.
 */
export const isOtpVerifiedAtom = atom<boolean>(false);

/**
 * 3. Auth Loading Atom
 * Maqsad: Global loading state handle karne ke liye (Optional).
 */
export const isAuthLoadingAtom = atom<boolean>(false);
