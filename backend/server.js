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

// Load fallback environment variables if Railway env vars are missing
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.log('[Config] Loading fallback environment variables...');
    const fallbackEnv = require('./config/env-fallback');
    Object.keys(fallbackEnv).forEach(key => {
        if (!process.env[key]) {
            process.env[key] = fallbackEnv[key];
        }
    });
}

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('[Config] Missing required environment variables:', missingEnvVars);
    console.error('[Config] Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('JWT')));
    process.exit(1);
}

console.log('[Config] Environment variables loaded successfully');
console.log('[Config] MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('[Config] JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Direct MongoDB connection to bypass any config issues
const mongoose = require('mongoose');

const initializeDatabase = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            console.log('[Database] Attempting direct MongoDB connection...');
            // Direct connection with absolutely no options
            await mongoose.connect(process.env.MONGO_URI);
            console.log('[Database] Successfully connected to MongoDB');
            break;
        } catch (error) {
            console.error(`[Database] Connection failed. Retries left: ${retries - 1}`);
            console.error('[Database] Error:', error.message);
            retries--;
            if (retries === 0) {
                console.error('[Database] Failed to connect after 5 attempts. Exiting...');
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        }
    }
};

initializeDatabase();

const app = express();
const server = http.createServer(app); // Create an HTTP server from our Express app

// Create a Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? [process.env.FRONTEND_URL || "https://solo-leveling.up.railway.app"]
            : "*",
        methods: ["GET", "POST"]
    },
    // Production optimizations
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6, // 1MB
    allowEIO3: true
});

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || "https://solo-leveling.up.railway.app"]
        : "*"
}));

// Security and performance middleware
app.use(express.json({ limit: '10mb' })); // Limit request size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request timeout middleware
app.use((req, res, next) => {
    res.setTimeout(30000, () => {
        console.error('[Timeout] Request timeout:', req.url);
        res.status(408).json({ error: 'Request timeout' });
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

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
    console.log(`[Socket.IO] Client connected: ${socket.id}`);
    
    // Error handling for socket
    socket.on('error', (error) => {
        console.error(`[Socket.IO] Socket error for ${socket.id}:`, error);
    });
    
    // Clients may register their userId after connecting so server can target private messages
    socket.on('register', (userId) => {
        try {
            if (userId) {
                socket.userId = userId;
                onlineUsers.add(userId);
                socket.broadcast.emit('userOnline', userId);
                // Send current online users to the newly connected user
                socket.emit('onlineUsers', Array.from(onlineUsers));
                console.log(`[Socket.IO] User registered: ${userId}`);
            }
        } catch (error) {
            console.error('[Socket.IO] Error in register:', error);
        }
    });

    // Accept messages; if payload includes recipientId, treat as private
    socket.on('sendMessage', async (data) => {
        try {
            const { userId, username, text, recipientId } = data || {};
            
            if (!userId || !username || !text) {
                console.error('[Socket.IO] Invalid message data:', data);
                return;
            }
            
            const messageData = { user: { id: userId, username }, text };
            if (recipientId) messageData.recipientId = recipientId;

            const message = new Message(messageData);
            await message.save();

            // Populate equippedTitle, equippedEffects, and equippedChatEffect for the message
            await message.populate('user.id', 'username equippedTitle equippedEffects equippedChatEffect');

            if (recipientId) {
                // Send to recipient socket(s) and sender only
                const recipientSockets = Array.from(io.sockets.sockets.values()).filter(s => s.userId && s.userId.toString() === recipientId.toString());
                recipientSockets.forEach(s => {
                    try {
                        s.emit('privateMessage', message);
                    } catch (err) {
                        console.error('[Socket.IO] Error sending to recipient:', err);
                    }
                });
                socket.emit('privateMessage', message);
            } else {
                io.emit('newMessage', message);
            }
        } catch (error) {
            console.error('[Socket.IO] Error saving message:', error);
            socket.emit('messageError', { error: 'Failed to send message' });
        }
    });

    socket.on('disconnect', (reason) => {
        try {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}, reason: ${reason}`);
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                socket.broadcast.emit('userOffline', socket.userId);
            }
        } catch (error) {
            console.error('[Socket.IO] Error in disconnect:', error);
        }
    });
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('[CRITICAL] Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[System] SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('[System] Process terminated');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`[System] Backend server active on port ${PORT}`);
    console.log(`[System] Environment: ${process.env.NODE_ENV || 'development'}`);
});