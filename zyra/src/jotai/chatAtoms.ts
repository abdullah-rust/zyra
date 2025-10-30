// atoms/chatAtoms.ts
import { atom } from "jotai";

// Search state
export const searchQueryAtom = atom<string>("");
export const searchResultsAtom = atom<any[]>([]);

// Contacts/Chats
export const contactsAtom = atom<any[]>([]);

// Active chat
export const activeChatAtom = atom<string | null>(null);

// Messages
export const messagesAtom = atom<Record<string, any[]>>({});
