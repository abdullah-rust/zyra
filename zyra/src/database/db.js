const DB_NAME = "ZyraDB";

let dbInstance = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log("Database created/upgraded successfully.");
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      console.log("Database opened successfully");
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      reject(event.target.error);
    };
  });
}

export async function ensureObjectStore(username) {
  let db = await getDB();
  if (db.objectStoreNames.contains(username)) return db;

  const newVersion = db.version + 1;
  db.close();
  dbInstance = null; // dbInstance ko null kiya gaya

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, newVersion);

    request.onupgradeneeded = (event) => {
      const newDb = event.target.result;
      if (!newDb.objectStoreNames.contains(username)) {
        newDb.createObjectStore(username, { keyPath: "id" });
        console.log(`Object store created: ${username}`);
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

export async function addMessage(username, message) {
  const db = await ensureObjectStore(username);

  const tx = db.transaction(username, "readwrite");
  const store = tx.objectStore(username);

  if (!message.id) {
    message.id = `${Date.now()}-${Math.random()}`;
  }
  message.created_at = message.created_at || new Date().toISOString();
  if (typeof message.read === "undefined") message.read = false;

  store.put(message);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = (event) => reject(event.target.error);
  });
}

export async function updateMessages(username, messages) {
  const db = await ensureObjectStore(username);

  const tx = db.transaction(username, "readwrite");
  const store = tx.objectStore(username);

  messages.forEach((m) => {
    if (!m.id) m.id = `${Date.now()}-${Math.random()}`;
    m.created_at = m.created_at || new Date().toISOString();
    store.put(m);
  });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = (event) => reject(event.target.error);
  });
}

export async function markAllRead(username) {
  const all = await getMessages(username);
  const unread = all.filter((m) => !m.read);

  if (unread.length === 0) return [];

  const updated = all.map((m) => (m.read ? m : { ...m, read: true }));
  await updateMessages(username, updated);

  return unread.map((m) => m.id);
}

export async function getMessages(username) {
  const db = await getDB();
  if (!db.objectStoreNames.contains(username)) return [];

  const tx = db.transaction(username, "readonly");
  const store = tx.objectStore(username);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = (e) => {
      const sorted = e.target.result.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      resolve(sorted);
    };
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function getUnreadMessageCount(username) {
  // Pehle saare messages fetch karenge
  const allMessages = await getMessages(username);

  // Phir un messages ko filter karenge jo read nahi hue hain (read: false)
  const unreadMessages = allMessages.filter((message) => !message.read);

  // Aur unka count return kar denge
  return unreadMessages.length;
}
