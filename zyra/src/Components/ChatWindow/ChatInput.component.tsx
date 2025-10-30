// components/ChatInput/ChatInput.component.tsx
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import styles from "./ChatWindow.module.css";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [input, setInput] = useState<string>("");

  const handleSend = () => {
    if (!input.trim() || disabled) return;

    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputBox}>
      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button onClick={handleSend} disabled={disabled}>
        <FiSend size={18} />
      </button>
    </div>
  );
};

export default ChatInput;
