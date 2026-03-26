"use client";
import { useState } from "react";

// Mock Data for demonstration
const mockContacts = [
  {
    id: 1,
    name: "Jani Dev 🚀",
    lastMessage: "Oye code check kar lia?",
    time: "10:30 PM",
    avatarColor: "bg-emerald-500",
    status: "online",
  },
  {
    id: 2,
    name: "Database Guru 📊",
    lastMessage: "Postgres schema done.",
    time: "9:15 PM",
    avatarColor: "bg-sky-500",
    status: "offline",
  },
  {
    id: 3,
    name: "Socket Wizard ⚡",
    lastMessage: "Ping/pong working fine.",
    time: "Yesterday",
    avatarColor: "bg-violet-500",
    status: "online",
  },
];

export default function DesktopChat() {
  const [selectedContact, setSelectedContact] = useState<
    (typeof mockContacts)[0] | null
  >(null);

  return (
    <div className="flex h-screen w-full bg-[#111b21] overflow-hidden antialiased">
      {/* 1. Sidebar */}
      <aside className="w-[30%] min-w-[320px] max-w-[420px] border-r border-gray-700/50 flex flex-col bg-[#111b21]">
        {/* Sidebar Header */}
        <header className="h-[64px] px-4 flex items-center justify-between bg-[#202c33] border-b border-gray-700/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-lg text-white">
              Y
            </div>
            <h1 className="text-xl font-bold text-white">Zyra</h1>
          </div>
          <div className="flex items-center gap-4 text-gray-400 text-xl">
            <button className="hover:text-white">💬</button>
            <button className="hover:text-white">⋮</button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-3 bg-[#111b21]">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full p-2.5 pl-5 bg-[#202c33] rounded-lg outline-none text-white text-sm placeholder:text-gray-500"
          />
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {mockContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-3.5 hover:bg-[#2a3942] rounded-lg cursor-pointer flex gap-4 transition-colors ${selectedContact?.id === contact.id ? "bg-[#2a3942]" : ""}`}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`w-14 h-14 rounded-full ${contact.avatarColor} flex items-center justify-center font-bold text-2xl text-white`}
                >
                  {contact.name[0]}
                </div>
                {contact.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-[#111b21]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-white truncate">
                    {contact.name}
                  </h3>
                  <span
                    className={`text-xs ${selectedContact?.id === contact.id ? "text-white" : "text-gray-500"}`}
                  >
                    {contact.time}
                  </span>
                </div>
                <p
                  className={`text-sm ${selectedContact?.id === contact.id ? "text-gray-100" : "text-gray-400"} truncate`}
                >
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Main Chat Area */}
      {selectedContact ? (
        <section className="flex-1 flex flex-col bg-[#0b141a]">
          {/* Chat Header */}
          <header className="h-[64px] px-6 py-3 flex items-center justify-between bg-[#202c33] border-b border-gray-700/50 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full ${selectedContact.avatarColor} flex items-center justify-center font-bold text-2xl text-white`}
              >
                {selectedContact.name[0]}
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">
                  {selectedContact.name}
                </h2>
                <p className="text-xs text-green-400">
                  {selectedContact.status === "online" ? "online" : `offline`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-gray-400 text-xl">
              <button className="hover:text-white">🔍</button>
              <button className="hover:text-white">📎</button>
              <button className="hover:text-white">⋮</button>
            </div>
          </header>

          {/* Messages Area (Empty State or Messages) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-[0.05]">
            {/* Messages would go here. For now, empty space */}
            <div className="text-gray-600 text-center py-10">
              No messages yet.
            </div>
          </div>

          {/* Chat Input */}
          <footer className="p-4 bg-[#202c33] border-t border-gray-700/50">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-3.5 px-6 bg-[#2a3942] rounded-lg outline-none text-white text-md shadow-inner placeholder:text-gray-500"
            />
          </footer>
        </section>
      ) : (
        <section className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-center p-10 border-l border-gray-700/50">
          <div
            className="w-[300px] h-[300px] bg-no-repeat bg-center opacity-[0.02]"
            style={{
              backgroundImage:
                "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            }}
          ></div>
          <h2 className="text-4xl font-light text-white mt-10">Zyra Web</h2>
          <p className="text-gray-400 mt-4 max-w-[500px]">
            Send and receive messages without keeping your phone online. Zyra
            uses end-to-end encryption to protect your privacy.
          </p>
          <p className="text-xs text-gray-600 mt-20 flex items-center gap-1">
            🔒 End-to-end encrypted
          </p>
        </section>
      )}
    </div>
  );
}
