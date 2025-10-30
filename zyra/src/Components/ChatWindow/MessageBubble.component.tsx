// components/MessageBubble/MessageBubble.component.tsx
import React from "react";
import { motion } from "motion/react";
import styles from "./ChatWindow.module.css";

interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  content_type: "text" | "image" | "file" | "video" | "audio";
  timestamp: string;
  status: "sent" | "delivered" | "seen" | "failed";
  metadata?: Record<string, any>;
}

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  let statusDisplay = "";
  if (isMe) {
    switch (message.status) {
      case "sent":
        statusDisplay = "✓";
        break;
      case "delivered":
        statusDisplay = "✓✓";
        break;
      case "seen":
        statusDisplay = "✓✓✔";
        break;
      case "failed":
        statusDisplay = "❌";
        break;
    }
  }

  return (
    <motion.div
      key={message.message_id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`${styles.message} ${
        isMe ? styles.myMessage : styles.theirMessage
      }`}
    >
      <p>{message.content}</p>
      <div className={styles.messageMeta}>
        <span className={styles.time}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {isMe && <span className={styles.status}>{statusDisplay}</span>}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
