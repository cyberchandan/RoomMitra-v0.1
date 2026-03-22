const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Main HTTP server + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

/////
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
/////

// Pass io object to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chat', chatRoutes);


let onlineUsers = {};
let lastSeen = {};
// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);
  
  // ✅ Join personal room
  socket.on('join_chat', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });
// ✅ USER ONLINE TRACK
socket.on("userOnline", (userId) => {
  onlineUsers[userId] = socket.id;

  console.log("User online:", userId);

  io.emit("user_status", {
    userId,
    status: "online"
  });
});
  // ✅ Send message (already working)
  socket.on('send_message', (data) => {
    io.to(data.receiver).emit('receive_message', data);
  });

  // ===========================
  // 🔥 NEW: TYPING FEATURE
  // ===========================

  socket.on("typing", ({ sender, receiver }) => {
    socket.to(receiver).emit("typing", { sender });
  });

  socket.on("stop_typing", ({ sender, receiver }) => {
    socket.to(receiver).emit("stop_typing", { sender });
  });

  // ===========================
  // 🔥 NEW: SEEN FEATURE
  // ===========================

  socket.on("mark_seen", async ({ sender, receiver }) => {
    try {
      const Message = require('./models/Message');
  
      await Message.updateMany(
        { sender, receiver, readStatus: false },
        { readStatus: true }
      );
  
      io.to(sender).emit("messages_seen", { receiver });
  
    } catch (err) {
      console.error("Error updating read status:", err);
    }
  });
  // ===========================

  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  
    let disconnectedUser = null;
  
    // find userId
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        disconnectedUser = userId;
        delete onlineUsers[userId];
        break;
      }
    }
  
    if (disconnectedUser) {
      lastSeen[disconnectedUser] = new Date();
  
      console.log("User offline:", disconnectedUser);
  
      io.emit("user_status", {
        userId: disconnectedUser,
        status: "offline",
        lastSeen: lastSeen[disconnectedUser]
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
