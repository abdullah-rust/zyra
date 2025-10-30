// components/MessageList/MessageList.component.tsx
import React, { useRef, useEffect } from "react";
import styles from "./ChatWindow.module.css";
import MessageBubble from "./MessageBubble.component";

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

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sortedMessages = messages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className={styles.messages}>
      {sortedMessages.map((msg) => (
        <MessageBubble
          key={msg.message_id}
          message={msg}
          isMe={msg.sender_id === currentUserId}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
