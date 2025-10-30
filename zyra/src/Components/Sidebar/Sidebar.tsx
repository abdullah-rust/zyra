import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { motion } from "motion/react";
import { FiSearch } from "react-icons/fi";
import { api } from "../../global/api";
import { db } from "../../global/db"; // Import from dexie db
import type { Contact } from "../../global/db"; // Import from dexie db
import { useLiveQuery } from "dexie-react-hooks";
import { useSocketContext } from "../../Utils/SocketContext";
import type { MessageStatus } from "../../Pages/HomePage/HomePage";

interface User {
  id: string;
  name: string;
  username: string;
}

interface SidebarProps {
  onSelectUser: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectUser }) => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocketContext();

  // Live Query for contacts from Dexie
  const selectedUsers = useLiveQuery(() => db.contacts.toArray()) || [];

  // Load contacts from Dexie on mount (backward compatibility)
  useEffect(() => {
    const loadContacts = async () => {
      const contacts = await db.contacts.toArray();
      if (contacts.length === 0) {
        console.log("No contacts found in Dexie");
      }
    };
    loadContacts();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      const data: User[] = res.data.users || [];

      // Filter out already added contacts
      const filtered = data.filter(
        (u) => !selectedUsers.some((contact) => contact.id === u.id)
      );
      setUsers(filtered);
    } catch (err) {
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => handleSearch(search), 400);
    return () => clearTimeout(delay);
  }, [search]);

  const getDeliveredMessageIds = async (selectedUserId: string) => {
    console.log("🔍 getDeliveredMessageIds called for:", selectedUserId);

    try {
      const deliveredMessageIds = await db.messages
        .where("status")
        .equals("delivered")
        .and((msg) => msg.sender_id === selectedUserId)
        .primaryKeys();

      console.log("🆔 Delivered message IDs:", deliveredMessageIds);
      return deliveredMessageIds;
    } catch (error) {
      console.error("💥 ERROR in getDeliveredMessageIds:", error);
      return [];
    }
  };

  const handleSelectUser = async (user: User) => {
    console.log("🚀 handleSelectUser STARTED for user:", user);

    try {
      // Check if contact already exists
      const existingContact = await db.contacts.get(user.id);
      console.log("📞 Existing contact:", existingContact);

      if (!existingContact) {
        console.log("➕ Adding new contact");
        const newContact: Contact = {
          id: user.id,
          username: user.username,
          name: user.name,
          lastMessage: "",
          unreadCount: 0,
          lastUpdated: new Date().toISOString(),
        };
        await db.contacts.add(newContact);
        console.log("✅ Contact added");
      }

      // Reset unread count when user is selected
      if (user) {
        await db.contacts.update(user.id, {
          unreadCount: 0,
          lastUpdated: new Date().toISOString(),
        });
        console.log("✅ Unread count reset");
      }

      if (!socket) {
        console.log("❌ Socket is null - returning early");
        // Phir bhi user select karo
        onSelectUser(user);
        setSearch("");
        setUsers([]);
        return;
      }

      console.log("🔌 Socket available, getting delivered messages...");
      const messagesId = await getDeliveredMessageIds(user.id);
      console.log("📨 Delivered message IDs:", messagesId);
      console.log("🔢 Number of messages:", messagesId?.length);

      if (messagesId && messagesId.length > 0) {
        console.log("🔄 Updating messages to 'seen' in database...");

        // Database update
        const updatedCount = await db.messages
          .where("message_id")
          .anyOf(messagesId)
          .modify({ status: "seen" });

        console.log("✅ Database updated count:", updatedCount);

        // Socket emit
        console.log("📡 Sending seen status via socket...");
        for (const msgId of messagesId) {
          const setStatus: MessageStatus = {
            message_id: msgId,
            receiver_id: user.id,
            status: "seen",
          };
          console.log("➡️ Emitting status for message:", msgId);
          socket.emit("message_status", setStatus);
        }
        console.log("✅ All statuses emitted");
      } else {
        console.log("ℹ️ No delivered messages found to mark as seen");
      }

      console.log("👤 Calling onSelectUser callback...");
      onSelectUser(user);

      setSearch("");
      setUsers([]);
      console.log("🎉 handleSelectUser COMPLETED successfully");
    } catch (error) {
      console.error("💥 ERROR in handleSelectUser:", error);
      // Error mein bhi user select karo
      onSelectUser(user);
      setSearch("");
      setUsers([]);
    }
  };

  const renderUserCard = (contact: Contact) => {
    return (
      <motion.div
        key={contact.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={styles.userCard}
        onClick={() =>
          handleSelectUser({
            // ✅ FIXED: handleSelectUser call karo
            id: contact.id,
            name: contact.name,
            username: contact.username,
          })
        }
      >
        <div className={styles.avatar}>
          {contact.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{contact.name}</p>
          <span className={styles.username}>@{contact.username}</span>
          {contact.lastMessage && (
            <p className={styles.lastMessage}>{contact.lastMessage}</p>
          )}
        </div>
        {contact.unreadCount && contact.unreadCount > 0 && (
          <div className={styles.unreadBadge}>{contact.unreadCount}</div>
        )}
      </motion.div>
    );
  };

  const renderSearchResultCard = (user: User) => {
    return (
      <motion.div
        key={user.id}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={styles.userCard}
        onClick={() => handleSelectUser(user)} // ✅ CORRECT: handleSelectUser call karo
      >
        <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user.name}</p>
          <span className={styles.username}>@{user.username}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className={styles.sidebar}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search */}
      <div className={styles.searchBox}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className={styles.status}>Searching...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* User List */}
      <div className={styles.userList}>
        {/* Contacts from Dexie */}
        {selectedUsers.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Chats</h4>
            {selectedUsers.map((contact) => renderUserCard(contact))}
          </div>
        )}

        {/* Search Results */}
        {search && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Results</h4>
            {users.map((user) => renderSearchResultCard(user))}
            {!loading && !users.length && search && (
              <p className={styles.noResults}>No users found 👀</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
