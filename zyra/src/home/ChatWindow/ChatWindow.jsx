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
import sendDound from "../../assets/message-send.mp3";
export default function ChatWindow({
  activeUser,
  sendmessage,
  reciveMessages,
}) {
  dayjs.extend(relativeTime);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [content_type, setContent_type] = useState("message");
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
      activeUser?.username === reciveMessages?.sender_username
    ) {
      const showMessage = {
        message_id: reciveMessages.message_id,
        message_status: reciveMessages.message_status,
        sender_username: reciveMessages.sender_username,
        receiver_username: reciveMessages.receiver_username,
        content: reciveMessages.content,
        content_type: reciveMessages.content_type,
        sender_type: "other",
        time_stamp: new Date().toISOString(),
        read: true,
      };

      setMessages((prev) => [...prev, showMessage]);

      const save = async () =>
        await addMessage(activeUser.username, showMessage);
      save();
    }

    reciveMessages = "";
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
    const MyUsername = localStorage.getItem("username");
    const message_id = uuidv4();
    const newMessage = {
      message_id: message_id,
      message_status: "sent",
      sender_username: MyUsername,
      receiver_username: activeUser.username,
      content: messageInput,
      content_type: content_type,
      sender_type: "user",
    };

    sendmessage(newMessage);
    const showMessage = {
      message_id: message_id,
      message_status: "sent",
      sender_username: MyUsername,
      receiver_username: activeUser.username,
      content: messageInput,
      content_type: content_type,
      sender_type: "user",
      time_stamp: new Date().toISOString(),
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
                key={msg.message_id}
                className={`${styles.messageItem} ${
                  msg.sender_type === "user"
                    ? styles.userMessage
                    : styles.otherMessage
                }`}
              >
                <p>{msg.content}</p>
                <span className={styles.date}>
                  {dayjs(msg.time_stamp).fromNow()}
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
