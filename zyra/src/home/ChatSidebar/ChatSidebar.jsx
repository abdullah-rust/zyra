import styles from "./ChatSidebar.module.css";
import { useState, useEffect } from "react";
import { api } from "../../global/api";
import profileIcon from "../../assets/profile.png";
import {
  ensureObjectStore,
  getMessages,
  addMessage,
  getUnreadMessageCount,
  markAllRead, // markAllRead ko import kiya gaya hai
} from "../../database/db";

export default function ChatSidebar({ onSelectUser, messageRecievedTrigger }) {
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const objectName = "mysidebaar";

  useEffect(() => {
    const init = async () => {
      await ensureObjectStore(objectName);
      const users = await getMessages(objectName);

      // Har user ke liye unread count fetch karen
      const usersWithUnreadCount = await Promise.all(
        users.map(async (user) => {
          const count = await getUnreadMessageCount(user.username);
          return { ...user, unreadCount: count }; // unreadCount ko object mein add karen
        })
      );
      setAllUsers(usersWithUnreadCount);
    };
    init();
  }, [messageRecievedTrigger]);

  const handleChatClick = async (user) => {
    setActiveChatId(user.username);

    // Check if the user already exists in the sidebar list
    const exists = allUsers.find((u) => u.username === user.username);
    if (!exists) {
      // If not, add them to the IndexedDB and the state
      await addMessage(objectName, user);
    }

    // Yahan tabdeeli hai: selected user ke liye saare messages read mark karen
    await markAllRead(user.username);

    // Ab allUsers state ko update karen taake count zero ho jaye
    setAllUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.username === user.username ? { ...u, unreadCount: 0 } : u
      )
    );

    // Inform the parent component (Home.js) about the selected user
    onSelectUser(user);

    // Reset search state
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      try {
        const res = await api.post("/search", {
          username: term.toLocaleLowerCase(),
        });
        setSearchResults(res.data.users);
      } catch (error) {
        console.error("Search API error:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const renderChatItems = (users) => {
    return users.map((user) => (
      <ChatItem
        key={user.id}
        name={user.username}
        isActive={activeChatId === user.username}
        onClick={() => handleChatClick(user)}
        unreadCount={user.unreadCount}
      />
    ));
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Chats</h2>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search by usernames"
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className={styles.chatList}>
        {searchTerm.length > 0
          ? renderChatItems(searchResults)
          : renderChatItems(allUsers)}
      </div>
    </div>
  );
}

function ChatItem({ name, onClick, isActive, img_link, unreadCount }) {
  return (
    <div
      className={`${styles.chatItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.profileIcon}>
        <img src={img_link || profileIcon} alt="" className={styles.img} />
      </div>
      <div className={styles.chatInfo}>
        <span className={styles.chatName}>{name}</span>
        <p className={unreadCount > 0 ? styles.newMessage : ""}>
          {unreadCount > 0 ? unreadCount : ""}
        </p>
      </div>
    </div>
  );
}
