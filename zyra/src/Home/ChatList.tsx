import profileIcon from "/account.png";
import styles from "./ChatList.module.css";
import {
  getContacts,
  getLastMessageWithTime,
  getUnreadMessageCount,
  markAllRead,
} from "../database/db";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ChatItem {
  id: string;
  name: string;
  username: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  img_link?: string;
}

export default function ChatList() {
  const [contactsList, setContactsList] = useState<ChatItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      const contacts: any[] = await getContacts();

      // Har contact ka last message aur unread count fetch karo
      const enrichedContacts = await Promise.all(
        contacts.map(async (contact) => {
          const lastMsg: any = await getLastMessageWithTime(contact.username);
          const unread: any = await getUnreadMessageCount(contact.username);

          return {
            ...contact,
            lastMessage: lastMsg?.message || "No messages yet",
            time: lastMsg?.time || "",
            unreadCount: unread || 0,
          };
        })
      );

      setContactsList(enrichedContacts);
    };

    fetchContacts();
  }, []);

  async function handleClick(user: any) {
    await markAllRead(user.username);
    navigate("/chat", { state: { user: user } });
  }

  return (
    <div className={styles.chatList}>
      {contactsList.map((chat) => (
        <div
          key={chat.id}
          className={styles.chatItem}
          onClick={() => handleClick(chat)}
        >
          <img
            src={
              chat.img_link && chat.img_link.trim() !== ""
                ? chat.img_link
                : profileIcon
            }
            alt={chat.name || "User"}
            className={styles.avatar}
          />
          <div className={styles.chatInfo}>
            <div className={styles.chatTop}>
              <span className={styles.name}>{chat.name}</span>
              {chat.time && (
                <span className={styles.time}>{formatTime(chat.time)}</span>
              )}
            </div>
            <div className={styles.chatBottom}>
              <span className={styles.lastMessage}>{chat.lastMessage}</span>
              {chat.unreadCount && chat.unreadCount > 0 ? (
                <span className={styles.unread}>{chat.unreadCount}</span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  // Agar same din ka message hai → sirf time dikhado
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // 10:45 AM
  }

  // Agar kal ka message hai → "Yesterday"
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  // Otherwise → Date dikhado (e.g. "Sep 25")
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
