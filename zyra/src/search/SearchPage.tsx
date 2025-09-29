import { useState, useEffect } from "react";
import styles from "./SearchPage.module.css";
import { api } from "../global/api";
import { useNavigate } from "react-router-dom";
import { addContact } from "../database/db";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  img_link: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/search", { username: query });
      setUsers(res.data.users || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  async function handleClick(user: User) {
    await addContact(user);
    navigate("/chat", { state: { user: user } });
  }

  useEffect(() => {
    const check = localStorage.getItem("isLogin");
    if (check) {
      setIsLogin(true);
    } else {
      navigate("/welcome", { replace: true });
    }
  }, [navigate]);

  if (!isLogin) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Search Users</h2>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e);
          }}
          className={styles.input}
        />
        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.results}>
        {users.map((user) => (
          <div
            key={user.id}
            className={styles.userCard}
            onClick={() => handleClick(user)}
          >
            <div className={styles.avatar}>
              {user.img_link ? (
                <img src={user.img_link} alt={user.name} />
              ) : (
                <span className={styles.placeholder}>
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{user.name}</h3>
              <p className={styles.username}>@{user.username}</p>
              <p className={styles.bio}>{user.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
