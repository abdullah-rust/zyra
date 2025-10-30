// ChatWindow.component.tsx
import React, { useEffect } from "react";
import { motion } from "motion/react";
import styles from "./ChatWindow.module.css";
import { useSocketContext } from "../../Utils/SocketContext";
import { db } from "../../global/db";
import { useLiveQuery } from "dexie-react-hooks";

// Components
import MessageList from "./MessageList.component";
import ChatInput from "./ChatInput.component";

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

interface ChatWindowProps {
  selectedUser?: {
    id: string;
    name: string;
    username: string;
  };
  currentUserId: string;
  message?: Message | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  currentUserId,
  message,
}) => {
  const socket = useSocketContext();

  // ---------------- Live Query for messages ----------------
  const messages =
    useLiveQuery(
      () =>
        selectedUser
          ? db.messages
              .where("receiver_id")
              .equals(selectedUser.id)
              .or("sender_id")
              .equals(selectedUser.id)
              .toArray()
          : [],
      [selectedUser?.id]
    ) || [];

  // Handle incoming socket messages
  useEffect(() => {
    if (!message) return;

    // Prevent duplicate insertion
    db.messages.get(message.message_id).then((existing) => {
      if (!existing) db.messages.put(message);
    });
  }, [message]);

  // ---------------- Send Message ----------------
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedUser) return;

    const newMsg: Message = {
      message_id: Date.now().toString(),
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      content: content,
      content_type: "text",
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    await db.messages.put(newMsg);

    if (socket && socket.connected) {
      socket.emit(
        "chat_message",
        newMsg,
        async (ack: { status: "delivered" | "failed" }) => {
          await db.messages.update(newMsg.message_id, { status: ack.status });
        }
      );
    } else {
      await db.messages.update(newMsg.message_id, { status: "failed" });
    }
  };

  return (
    <motion.div
      className={styles.chatWindow}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className={styles.header}>
        {selectedUser ? (
          <>
            <div className={styles.avatar}>{selectedUser.name.charAt(0)}</div>
            <div>
              <h3 className={styles.name}>{selectedUser.name}</h3>
              <span className={styles.username}>@{selectedUser.username}</span>
            </div>
          </>
        ) : (
          <p className={styles.noUser}>Select a contact to start chatting 💬</p>
        )}
      </div>

      {/* Messages List */}
      <MessageList messages={messages} currentUserId={currentUserId} />

      {/* Input */}
      {selectedUser && (
        <ChatInput onSendMessage={handleSendMessage} disabled={!selectedUser} />
      )}
    </motion.div>
  );
};

export default ChatWindow;
