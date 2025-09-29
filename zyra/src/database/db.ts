const DB_NAME = "ZyraDB";

let dbInstance: IDBDatabase | null = null;

// Message interface
export interface Message {
  id?: string;
  message_id?: string;
  sender_username?: string;
  receiver_username?: string;
  content?: string;
  content_type?: string;
  time_stamp?: string;
  sender_type?: string;
  read?: boolean;
  username?: string;
  created_at?: string;
}

// Contact interface
export interface Contact {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  img_link: string;
}

export async function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log("Database created/upgraded successfully.");
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "id" });
        console.log("Contacts store created");
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      console.log("Database opened successfully");
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error(
        "Database error:",
        (event.target as IDBOpenDBRequest).error
      );
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// ---------------- Messages Logic ----------------

export async function ensureObjectStore(
  username: string
): Promise<IDBDatabase> {
  const db = await getDB();
  if (db.objectStoreNames.contains(username)) return db;

  const newVersion = db.version + 1;
  db.close();
  dbInstance = null;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, newVersion);

    request.onupgradeneeded = (event) => {
      const newDb = (event.target as IDBOpenDBRequest).result;
      if (!newDb.objectStoreNames.contains(username)) {
        newDb.createObjectStore(username, { keyPath: "id" });
        console.log(`Object store created: ${username}`);
      }
      if (!newDb.objectStoreNames.contains("contacts")) {
        newDb.createObjectStore("contacts", { keyPath: "id" });
        console.log("Contacts store created");
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) =>
      reject((event.target as IDBOpenDBRequest).error);
  });
}

export async function addMessage(
  username: string,
  message: Message
): Promise<void> {
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
    tx.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}

export async function updateMessages(
  username: string,
  messages: Message[]
): Promise<void> {
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
    tx.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}

export async function markAllRead(username: string): Promise<string[]> {
  const all = await getMessages(username);
  const unread = all.filter((m) => !m.read);

  if (unread.length === 0) return [];

  const updated = all.map((m) => (m.read ? m : { ...m, read: true }));
  await updateMessages(username, updated);

  return unread.map((m) => m.id!) as string[];
}

export async function getMessages(username: string): Promise<Message[]> {
  const db = await getDB();
  if (!db.objectStoreNames.contains(username)) return [];

  const tx = db.transaction(username, "readonly");
  const store = tx.objectStore(username);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = (e) => {
      const result = (e.target as IDBRequest<Message[]>).result;
      const sorted = result.sort(
        (a, b) =>
          new Date(a.created_at || "").getTime() -
          new Date(b.created_at || "").getTime()
      );
      resolve(sorted);
    };
    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

export async function getUnreadMessageCount(username: string): Promise<number> {
  const allMessages = await getMessages(username);
  const unreadMessages = allMessages.filter((message) => !message.read);
  return unreadMessages.length;
}

export async function getLastMessageWithTime(
  username: string
): Promise<{ message: string; time: string } | null> {
  const messages = await getMessages(username);
  if (messages.length === 0) return null;

  const lastMsg = messages[messages.length - 1];

  return {
    message: lastMsg.content || "",
    time: lastMsg.time_stamp || lastMsg.created_at || "",
  };
}

// ---------------- Contacts Logic ----------------

export async function ensureContactsStore(): Promise<IDBDatabase> {
  const db = await getDB();
  if (db.objectStoreNames.contains("contacts")) return db;

  const newVersion = db.version + 1;
  db.close();
  dbInstance = null;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, newVersion);

    request.onupgradeneeded = (event) => {
      const newDb = (event.target as IDBOpenDBRequest).result;
      if (!newDb.objectStoreNames.contains("contacts")) {
        newDb.createObjectStore("contacts", { keyPath: "id" });
        console.log("Contacts store created");
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) =>
      reject((event.target as IDBOpenDBRequest).error);
  });
}

export async function addContact(contact: Contact): Promise<void> {
  const db = await ensureContactsStore();
  const tx = db.transaction("contacts", "readwrite");
  const store = tx.objectStore("contacts");

  return new Promise((resolve, reject) => {
    const getReq = store.get(contact.username); // 👈 maan lo keyPath "username" hai
    getReq.onsuccess = () => {
      if (!getReq.result) {
        store.put(contact); // sirf tabhi add karega jab pehle se exist na kare
      }
      resolve();
    };
    getReq.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}

export async function getContacts(): Promise<Contact[]> {
  const db = await ensureContactsStore();
  const tx = db.transaction("contacts", "readonly");
  const store = tx.objectStore("contacts");
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = (e) =>
      resolve((e.target as IDBRequest<Contact[]>).result);
    request.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}

export async function markMessageRead(username: string, messageId: string) {
  const db = await ensureObjectStore(username);
  const tx = db.transaction(username, "readwrite");
  const store = tx.objectStore(username);
  const msg = await store.get(messageId);

  return new Promise((resolve, reject) => {
    msg.onsuccess = () => {
      const message = msg.result;
      if (message) {
        message.read = true;
        store.put(message);
      }
    };
    tx.oncomplete = () => resolve(true);
    tx.onerror = (e) => reject((e.target as IDBRequest).error);
  });
}
