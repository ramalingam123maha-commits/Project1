export default function UserList({ users, onlineCount, activeRoom, onStartChat, onGoToPublic, privateChats, privatePartner }) {
  const hasUnread = (userId) => {
    return privateChats[userId] && privateChats[userId].length > 0;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <span className="online-badge">{onlineCount} online</span>
      </div>

      <div className="room-list">
        <div
          className={`room-item ${activeRoom === "public" ? "active" : ""}`}
          onClick={onGoToPublic}
        >
          <span className="room-icon">#</span>
          <span className="room-name">General</span>
          <span className="room-meta">public</span>
        </div>

        {users.length > 0 && (
          <>
            <div className="section-label">Direct Messages</div>
            {users.map((user) => (
              <div
                key={user.id}
                className={`room-item ${
                  activeRoom === user.id ? "active" : ""
                } ${hasUnread(user.id) ? "has-unread" : ""}`}
                onClick={() => onStartChat(user.id)}
              >
                <span className="room-icon user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="room-name">{user.username}</span>
                <span className={`status-dot ${
                  privatePartner && privatePartner.id === user.id && activeRoom === user.id
                    ? "status-active"
                    : "status-online"
                }`} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}