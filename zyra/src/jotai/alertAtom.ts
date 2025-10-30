import type { AlertData } from "../Types/Types";
import { atom } from "jotai";

/* ────────────────────────────────
   ⚠️ ALERT / NOTIFICATION SYSTEM
──────────────────────────────── */
export const alertAtom = atom<AlertData>({
  message: "",
  type: "info",
  visible: false,
});
