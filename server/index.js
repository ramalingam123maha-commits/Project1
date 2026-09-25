const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// In-memory state
const onlineUsers = new Map(); // socketId -> { id, username }
const typingUsers = new Map(); // "room:username" -> timeout

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // --- Join / Register ---
  socket.on("user:join", (username) => {
    const user = { id: socket.id, username };
    onlineUsers.set(socket.id, user);
    socket.data.user = user;

    // Join public room automatically
    socket.join("public");
    socket.emit("room:joined", { room: "public", name: "General" });

    // Broadcast updated user list to everyone in public
    io.to("public").emit("users:update", getPublicUsers());
    socket.broadcast.emit("online:count", onlineUsers.size);
    socket.emit("online:count", onlineUsers.size);

    // Notify others
    socket.broadcast.to("public").emit("message:new", {
      id: genId(),
      type: "system",
      content: `${username} joined the chat`,
      room: "public",
      timestamp: Date.now(),
    });

    console.log(`${username} joined (${socket.id})`);
  });

  // --- Public messaging ---
  socket.on("message:send", ({ content, room }) => {
    const user = socket.data.user;
    if (!user || !content || !room) return;
    const r = room || "public";

    const msg = {
      id: genId(),
      type: "user",
      room: r,
      sender: { id: socket.id, username: user.username },
      content,
      timestamp: Date.now(),
    };

    io.to(r).emit("message:new", msg);

    // Clear typing for this user in this room
    clearTyping(user.username, r);
    io.to(r).emit("typing:update", getTypingForRoom(r));
  });

  // --- Private messaging ---
  socket.on("message:private", ({ to, content }) => {
    const from = socket.data.user;
    if (!from || !to || !content) return;

    const privateRoom = getPrivateRoom(socket.id, to);

    // Join both users to the room first
    socket.join(privateRoom);
    const recipientSocket = io.sockets.sockets.get(to);
    if (recipientSocket) {
      recipientSocket.join(privateRoom);
    }

    const msg = {
      id: genId(),
      type: "private",
      sender: { id: socket.id, username: from.username },
      recipientId: to,
      content,
      timestamp: Date.now(),
    };

    // Send to both participants via the private room
    io.to(privateRoom).emit("message:private", msg);
  });

  // --- Private room join request ---
  socket.on("private:join", (targetUserId) => {
    const user = socket.data.user;
    if (!user || !targetUserId) return;

    const privateRoom = getPrivateRoom(socket.id, targetUserId);
    socket.join(privateRoom);

    const targetSocket = io.sockets.sockets.get(targetUserId);
    if (targetSocket) {
      targetSocket.join(privateRoom);
    }
  });

  // --- Typing indicators ---
  socket.on("typing:start", ({ room, recipientId }) => {
    const user = socket.data.user;
    if (!user) return;
    const key = recipientId ? `private:${getPrivateRoom(socket.id, recipientId)}` : `room:${room || "public"}`;
    setTyping(user.username, key);
    if (recipientId) {
      const privateRoom = getPrivateRoom(socket.id, recipientId);
      io.to(privateRoom).emit("typing:update", [user.username]);
    } else {
      io.to(room || "public").emit("typing:update", getTypingForRoom(key));
    }
  });

  socket.on("typing:stop", ({ room, recipientId }) => {
    const user = socket.data.user;
    if (!user) return;
    const key = recipientId ? `private:${getPrivateRoom(socket.id, recipientId)}` : `room:${room || "public"}`;
    clearTyping(user.username, key);
    if (recipientId) {
      const privateRoom = getPrivateRoom(socket.id, recipientId);
      io.to(privateRoom).emit("typing:update", []);
    } else {
      io.to(room || "public").emit("typing:update", getTypingForRoom(key));
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    const user = socket.data.user;
    if (user) {
      onlineUsers.delete(socket.id);
      io.to("public").emit("users:update", getPublicUsers());
      socket.broadcast.emit("online:count", onlineUsers.size);
      socket.broadcast.to("public").emit("message:new", {
        id: genId(),
        type: "system",
        content: `${user.username} left the chat`,
        room: "public",
        timestamp: Date.now(),
      });

      // Clear any lingering typing indicators
      clearTyping(user.username, "room:public");
      io.to("public").emit("typing:update", getTypingForRoom("room:public"));
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- Helpers ---
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function getPublicUsers() {
  const users = [];
  for (const [, u] of onlineUsers) {
    users.push({ id: u.id, username: u.username });
  }
  return users;
}

function getPrivateRoom(idA, idB) {
  return [idA, idB].sort().join("::");
}

function setTyping(username, key) {
  typingUsers.set(`${key}:${username}`, Date.now());
}

function clearTyping(username, key) {
  typingUsers.delete(`${key}:${username}`);
}

function getTypingForRoom(key) {
  const names = [];
  const now = Date.now();
  for (const [k, ts] of typingUsers) {
    if (now - ts > 5000) {
      typingUsers.delete(k);
      continue;
    }
    if (k.startsWith(`${key}:`)) {
      names.push(k.slice(key.length + 1));
    }
  }
  return names;
}

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});