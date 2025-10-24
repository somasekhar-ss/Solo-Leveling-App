const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Production-ready options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('[Database] MongoDB reconnected');
    });
    
    console.log(`[Database] MongoDB Connection Established: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    throw error; // Don't exit here, let the retry logic handle it
  }
};

module.exports = connectDB;