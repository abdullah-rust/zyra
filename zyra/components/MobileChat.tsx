"use client";
import { useState } from "react";

export default function MobileChat() {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="flex flex-col h-screen bg-[#111b21]">
      {/* Header */}
      <header className="p-4 bg-[#202c33] flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold text-[#aebac1]">Zyra</h1>
        <div className="flex gap-4">
          <span>🔍</span>
          <span>⋮</span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex bg-[#202c33] border-b border-gray-700">
        {["CHATS", "STATUS", "CALLS"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`flex-1 p-3 text-sm font-bold transition-all ${
              activeTab === tab.toLowerCase()
                ? "text-[#00a884] border-b-4 border-[#00a884]"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === "chats" && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex gap-4 items-center border-b border-gray-800 pb-3"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-white">Contact {i}</h3>
                    <span className="text-xs text-gray-500">10:45 PM</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    Bas jani kaam ho gaya hai!
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#00a884] rounded-full shadow-2xl flex items-center justify-center text-2xl">
        💬
      </button>
    </div>
  );
}
