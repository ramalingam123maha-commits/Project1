import { useState, useEffect, useCallback, useRef } from "react";
import { socket } from "../socket";

export function useChat(username) {
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateChats, setPrivateChats] = useState({});
  const [typing, setTyping] = useState([]);
  const [activeRoom, setActiveRoom] = useState("public");
  const [onlineCount, setOnlineCount] = useState(0);
  const [privatePartner, setPrivatePartner] = useState(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);
  const hasJoined = useRef(false);

  // Set up listeners once
  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("users:update", (updatedUsers) => {
      setUsers(updatedUsers.filter((u) => u.id !== socket.id));
    });

    socket.on("online:count", setOnlineCount);

    socket.on("message:new", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("message:private", (msg) => {
      // Only add incoming messages from others (we already add our own locally in sendMessage)
      if (msg.sender.id !== socket.id) {
        setPrivateChats((prev) => ({
          ...prev,
          [msg.sender.id]: [...(prev[msg.sender.id] || []), msg],
        }));
      }
    });

    socket.on("typing:update", (names) => {
      setTyping(names.filter((n) => n !== username));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users:update");
      socket.off("online:count");
      socket.off("message:new");
      socket.off("message:private");
      socket.off("typing:update");
      socket.disconnect();
    };
  }, []);

  // Keep typing filter in sync with username changes
  useEffect(() => {
    socket.off("typing:update");
    socket.on("typing:update", (names) => {
      setTyping(names.filter((n) => n !== username));
    });
  }, [username]);

  const join = useCallback(() => {
    if (hasJoined.current) return;
    socket.connect();
    // Small delay to let connection establish then join
    const doJoin = () => {
      socket.emit("user:join", username);
      hasJoined.current = true;
    };
    if (socket.connected) {
      doJoin();
    } else {
      socket.once("connect", doJoin);
    }
  }, [username]);

  const sendMessage = useCallback(
    (content) => {
      if (activeRoom === "public") {
        socket.emit("message:send", { content, room: "public" });
      } else {
        socket.emit("message:private", { to: activeRoom, content });
        setPrivateChats((prev) => ({
          ...prev,
          [activeRoom]: [
            ...(prev[activeRoom] || []),
            {
              id: Date.now().toString(36),
              type: "private",
              sender: { id: socket.id, username },
              content,
              timestamp: Date.now(),
            },
          ],
        }));
      }
    },
    [activeRoom, username]
  );

  const startPrivateChat = useCallback(
    (userId) => {
      const user = users.find((u) => u.id === userId);
      setActiveRoom(userId);
      setPrivatePartner(user || null);
      socket.emit("private:join", userId);
    },
    [users]
  );

  const goToPublic = useCallback(() => {
    setActiveRoom("public");
    setPrivatePartner(null);
  }, []);

  const startTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      if (activeRoom === "public") {
        socket.emit("typing:start", { room: "public" });
      } else {
        socket.emit("typing:start", { recipientId: activeRoom });
      }
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => stopTyping(), 2000);
  }, [activeRoom]);

  const stopTyping = useCallback(() => {
    isTypingRef.current = false;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (activeRoom === "public") {
      socket.emit("typing:stop", { room: "public" });
    } else {
      socket.emit("typing:stop", { recipientId: activeRoom });
    }
  }, [activeRoom]);

  return {
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
  };
}