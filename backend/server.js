const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http'); // Import http
const path = require('path');
const { Server } = require("socket.io"); // Import Server from socket.io

// Import your models for the chat
const Message = require('./models/Message');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server from our Express app

// Create a Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? [process.env.FRONTEND_URL || "https://your-app-name.railway.app"]
            : "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || "https://your-app-name.railway.app"]
        : "*"
}));
app.use(express.json());

// Your existing API Routes from the Gist
app.use('/api/auth', require('./routes/auth'));
app.use('/api/missions', require('./routes/missions'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/shop', require('./routes/shop'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/user', require('./routes/user'));
app.use('/api/stats', require('./routes/stats'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html')));

// --- ADD THE CHAT LOGIC ---
const onlineUsers = new Set();

io.on('connection', (socket) => {
    // Clients may register their userId after connecting so server can target private messages
    socket.on('register', (userId) => {
        if (userId) {
            socket.userId = userId;
            onlineUsers.add(userId);
            socket.broadcast.emit('userOnline', userId);
            // Send current online users to the newly connected user
            socket.emit('onlineUsers', Array.from(onlineUsers));
        }
    });

    // Accept messages; if payload includes recipientId, treat as private
    socket.on('sendMessage', async ({ userId, username, text, recipientId }) => {
        try {
            const messageData = { user: { id: userId, username }, text };
            if (recipientId) messageData.recipientId = recipientId;

            const message = new Message(messageData);
            await message.save();

            // Populate equippedTitle, equippedEffects, and equippedChatEffect for the message
            await message.populate('user.id', 'username equippedTitle equippedEffects equippedChatEffect');

            if (recipientId) {
                // Send to recipient socket(s) and sender only
                const recipientSockets = Array.from(io.sockets.sockets.values()).filter(s => s.userId && s.userId.toString() === recipientId.toString());
                recipientSockets.forEach(s => s.emit('privateMessage', message));
                socket.emit('privateMessage', message);
            } else {
                io.emit('newMessage', message);
            }
        } catch (error) {
            console.error('[Socket.IO] Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            socket.broadcast.emit('userOffline', socket.userId);
        }
    });
});

const PORT = process.env.PORT || 5001;
// IMPORTANT: We now listen on the 'server' object, not the 'app' object
server.listen(PORT, () => console.log(`[System] Backend server active on port ${PORT}`));