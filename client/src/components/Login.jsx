import { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    onLogin(trimmed);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">💬</div>
        <h1>Join Chat</h1>
        <p>Enter your display name to start chatting</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <button type="submit" disabled={name.trim().length < 2}>
            Join
          </button>
        </form>
      </div>
    </div>
  );
}