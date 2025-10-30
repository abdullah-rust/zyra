import Dexie, { type Table } from "dexie";

// ─── Message Interface ─────────────────────────────
export interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  content_type: "text" | "image" | "file" | "video" | "audio";
  timestamp: string;
  status: "sent" | "delivered" | "seen" | "failed";
  metadata?: Record<string, any>;
}

// ─── Contact Interface ─────────────────────────────
export interface Contact {
  id: string; // unique user ID
  username: string; // unique username
  name: string; // display name
  lastMessage?: string;
  unreadCount?: number;
  lastUpdated?: string;
}

// ─── Dexie Database ────────────────────────────────
export class ChatDB extends Dexie {
  messages!: Table<Message, string>;
  contacts!: Table<Contact, string>;

  constructor() {
    super("ZyraChatDB");

    this.version(3).stores({
      messages: "message_id, sender_id, receiver_id, timestamp, status",
      contacts: "id, username, name, lastUpdated", // Fixed: id instead of contact_id
    });
  }
}

// ─── Export Instance ───────────────────────────────
export const db = new ChatDB();
