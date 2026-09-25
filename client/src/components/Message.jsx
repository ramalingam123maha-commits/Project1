export default function Message({ msg, isOwn }) {
  if (msg.type === "system") {
    return (
      <div className="system-message">
        <span>{msg.content}</span>
      </div>
    );
  }

  return (
    <div className={`message ${isOwn ? "own" : "other"}`}>
      {!isOwn && msg.sender && (
        <div className="message-sender">{msg.sender.username}</div>
      )}
      <div className="message-bubble">
        <span className="message-text">{msg.content}</span>
        <span className="message-time">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}