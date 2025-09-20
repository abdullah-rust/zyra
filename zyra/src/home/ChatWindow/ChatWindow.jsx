import { useState, useEffect, useRef } from "react";
import styles from "./ChatWindow.module.css";
import { v4 as uuidv4 } from "uuid";
import {
  ensureObjectStore,
  getMessages,
  addMessage,
  markAllRead,
} from "../../database/db";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function ChatWindow({
  activeUser,
  sendmessage,
  reciveMessages,
}) {
  dayjs.extend(relativeTime);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    // Jab activeUser change ho, to messages list ko reset karo
    setMessages([]);
  }, [activeUser]);

  useEffect(() => {
    // Jab bhi messages state update ho, scroll down karo
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Jab reciveMessages receive ho, to list mein add karo
    if (
      reciveMessages?.content &&
      activeUser?.username === reciveMessages?.fromUsername
    ) {
      const showMessage = {
        id: uuidv4(),
        content: reciveMessages.content,
        sender: "other",
        created_at: new Date().toISOString(),
        read: true,
      };
      setMessages((prev) => [...prev, showMessage]);

      const save = async () =>
        await addMessage(activeUser.username, showMessage);
      save();
    }
  }, [reciveMessages, activeUser]); // Dependencies updated

  useEffect(() => {
    const init = async () => {
      if (!activeUser?.username) return;
      await ensureObjectStore(activeUser.username);
      const oldMessageData = await getMessages(activeUser.username);
      if (oldMessageData?.length) setMessages(oldMessageData);

      await markAllRead(activeUser.username);
    };
    init();
  }, [activeUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;
    const me = localStorage.getItem("username");

    const newMessage = {
      toUsername: activeUser.username,
      fromUsername: me,
      content: messageInput,
    };

    sendmessage(newMessage);

    const showMessage = {
      id: uuidv4(),
      content: messageInput,
      sender: "user",
      created_at: new Date().toISOString(),
      read: true,
    };

    setMessages((prev) => [...prev, showMessage]);
    setMessageInput("");
    await addMessage(activeUser.username, showMessage);
    scrollToBottom();
  };

  if (!activeUser) {
    return (
      <div className={styles.chatWindowPlaceholder}>
        <p>Please select a chat to start a conversation.</p>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <span className={styles.chatName}>{activeUser.username}</span>
      </div>

      <div className={styles.messageList}>
        {messages
          ? messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageItem} ${
                  msg.sender === "user"
                    ? styles.userMessage
                    : styles.otherMessage
                }`}
              >
                <p>{msg.content}</p>
                <span className={styles.date}>
                  {dayjs(msg.created_at).fromNow()}
                </span>
              </div>
            ))
          : ""}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className={styles.messageInputContainer}
      >
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}
