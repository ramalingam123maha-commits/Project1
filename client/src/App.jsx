import { useState, useEffect, useRef } from "react";
import Login from "./components/Login";
import UserList from "./components/UserList";
import ChatArea from "./components/ChatArea";
import { useChat } from "./hooks/useChat";

export default function App() {
  const [username, setUsername] = useState(null);
  const hasJoinedRef = useRef(false);

  const {
    connected,
    users,
    messages,
    privateChats,
    typing,
    activeRoom,
    onlineCount,
    privatePartner,
    join,
    sendMessage,
    startPrivateChat,
    goToPublic,
    startTyping,
    stopTyping,
  } = useChat(username);

  const handleLogin = (name) => {
    setUsername(name);
  };

  // Trigger join when username is set
  useEffect(() => {
    if (username && !hasJoinedRef.current) {
      hasJoinedRef.current = true;
      join();
    }
  }, [username, join]);

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  if (!connected) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <UserList
        users={users}
        onlineCount={onlineCount}
        activeRoom={activeRoom}
        onStartChat={startPrivateChat}
        onGoToPublic={goToPublic}
        privateChats={privateChats}
        privatePartner={privatePartner}
      />
      <ChatArea
        messages={messages}
        privateChats={privateChats}
        activeRoom={activeRoom}
        privatePartner={privatePartner}
        username={username}
        typing={typing}
        onSend={sendMessage}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
      />
    </div>
  );
}