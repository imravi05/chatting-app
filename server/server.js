const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');

// 1. Load Config & Connect DB
dotenv.config();
connectDB();

// 2. Initialize App
const app = express();
app.use(express.json()); // Allow JSON data in req.body
app.use(cors());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// 3. Create HTTP Server (needed for Socket.io)
const server = http.createServer(app);

// 4. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow React Frontend
    methods: ["GET", "POST"],
  },
});

// 5. Basic Socket Test (We will move this later)
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  // 1. When a user logs in, map their User ID to this Socket ID
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online.`);
  });

  // 2. When sending a message
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to); // Get receiver's socket ID
    
    if (sendUserSocket) {
      // If user is online, emit the message to them instantly
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
// 6. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});