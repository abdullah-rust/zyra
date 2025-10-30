import React, { useEffect, useState, useRef } from "react";
import styles from "./Home.module.css";
import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
import ChatWindow from "../../Components/ChatWindow/ChatWindow";
import { getItem } from "../../Utils/localForageUtils";
import { useSocketContext } from "../../Utils/SocketContext";
import { api } from "../../global/api";
import { db } from "../../global/db";

interface User {
  id: string;
  name: string;
  username: string;
}

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

export interface MessageStatus {
  message_id: string;
  receiver_id: string;
  status: "delivered" | "seen";
}

const Home: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const socket = useSocketContext();

  // Ref for current selected user to avoid race conditions
  const selectedUserRef = useRef<User | null>(null);

  // Keep ref updated with current selected user
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Clear message when user changes
  useEffect(() => {
    setMessage(null);
  }, [selectedUser?.id]);

  // Get current user ID on component mount
  useEffect(() => {
    getUserId();
  }, []);

  // Socket message handler
  useEffect(() => {
    if (!socket) return;

    const handleMessage = async (msg: Message) => {
      try {
        msg.status = "delivered";

        const currentSelectedUser = selectedUserRef.current;

        const sendStatus: MessageStatus = {
          message_id: msg.message_id,
          receiver_id: msg.sender_id,
          status: "delivered",
        };
        socket.emit("message_status", sendStatus);
        // If message is from currently selected user
        if (currentSelectedUser && currentSelectedUser.id === msg.sender_id) {
          setMessage(msg); // Update UI immediately
          const SendStatusSeen: MessageStatus = {
            message_id: msg.message_id,
            receiver_id: msg.sender_id,
            status: "seen",
          };
          socket.emit("message_status", SendStatusSeen);

          await db.messages.update(msg.message_id, {
            status: "seen",
          });
        } else {
          // Handle background message (from other users)
          await handleBackgroundMessage(msg);
        }
      } catch (error) {
        console.error("Error handling incoming message:", error);
      }
    };

    const handleBackgroundMessage = async (msg: Message) => {
      const savedContact = await db.contacts.get(msg.sender_id);

      if (savedContact) {
        // Update existing contact with new message
        await Promise.all([
          db.messages.put(msg),
          db.contacts.update(msg.sender_id, {
            lastMessage: msg.content,
            lastUpdated: new Date().toISOString(),
            unreadCount: (savedContact.unreadCount || 0) + 1,
          }),
        ]);
      } else {
        // Fetch contact info and save
        await fetchAndSaveContact(msg);
      }
    };

    const fetchAndSaveContact = async (msg: Message) => {
      try {
        const fetchContact = await api.get(
          `/search?q=${encodeURIComponent(msg.sender_id)}`
        );

        if (fetchContact.status === 200 && fetchContact.data.users?.[0]) {
          const contact = fetchContact.data.users[0];

          await Promise.all([
            db.contacts.add({
              id: contact.id,
              name: contact.name,
              username: contact.username,
              lastMessage: msg.content,
              unreadCount: 1,
              lastUpdated: new Date().toISOString(),
            }),
            db.messages.put(msg),
          ]);
        } else {
          // If contact not found, still save the message
          await db.messages.put(msg);
        }
      } catch (error) {
        console.error("Failed to fetch contact:", error);
        // Save message anyway
        await db.messages.put(msg);
      }
    };

    async function HandleStatus(msg: MessageStatus) {
      console.log(msg.status);

      await db.messages.update(msg.message_id, {
        status: msg.status,
      });
    }

    socket.on("chat_message", handleMessage);
    socket.on("message_status", HandleStatus);

    return () => {
      socket.off("chat_message", handleMessage);
      socket.off("message_status", HandleStatus);
    };
  }, [socket]); // Only depend on socket

  const getUserId = async () => {
    try {
      const id = await getItem("userId");
      if (!id) {
        console.error("User ID not found in storage");
        // Here you can redirect to login if needed
        return;
      }
      setCurrentUserId(id);
    } catch (error) {
      console.error("Failed to get user ID from storage:", error);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);

    // Reset unread count when user is selected
    if (user) {
      db.contacts.update(user.id, { unreadCount: 0 });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}></div>

      <div className={styles.mainScreen}>
        <Header />

        <div className={styles.body}>
          <Sidebar onSelectUser={handleUserSelect} />
          <ChatWindow
            selectedUser={selectedUser || undefined}
            currentUserId={currentUserId}
            message={message}
          />
        </div>

        <div className={styles.floatingElement1}></div>
        <div className={styles.floatingElement2}></div>
      </div>
    </div>
  );
};

export default Home;
