import { useState, useRef, useEffect } from "react";
import Message from "./Message";

export default function ChatArea({
  messages,
  privateChats,
  activeRoom,
  privatePartner,
  username,
  typing,
  onSend,
  onStartTyping,
  onStopTyping,
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const currentMessages =
    activeRoom === "public"
      ? messages
      : privateChats[activeRoom] || [];

  const isPrivate = activeRoom !== "public";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, typing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
    onStopTyping();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.trim()) {
      onStartTyping();
    } else {
      onStopTyping();
    }
  };

  const headerTitle = isPrivate
    ? privatePartner
      ? `@ ${privatePartner.username}`
      : "Private Chat"
    : "# General";

  const typingText =
    typing.length > 0
      ? typing.length === 1
        ? `${typing[0]} is typing...`
        : `${typing.join(", ")} are typing...`
      : null;

  return (
    <div className="chat-area">
      <div className="chat-header">
        <h3>{headerTitle}</h3>
        {isPrivate && (
          <span className="private-badge">private</span>
        )}
      </div>

      <div className="messages-container">
        {currentMessages.length === 0 && (
          <div className="empty-chat">
            {isPrivate
              ? "No messages yet. Say hello!"
              : "Welcome to General! Start chatting."}
          </div>
        )}
        {currentMessages.map((msg) => (
          <Message
            key={msg.id}
            msg={msg}
            isOwn={
              msg.type === "system"
                ? false
                : msg.sender && msg.sender.username === username
            }
          />
        ))}
        {typingText && <div className="typing-indicator">{typingText}</div>}
        <div ref={bottomRef} />
      </div>

      <form className="input-area" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={
            isPrivate
              ? `Message ${privatePartner?.username || "user"}...`
              : "Message #general..."
          }
          value={input}
          onChange={handleInputChange}
          autoFocus
        />
        <button type="submit" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}