const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Validate MONGO_URI before attempting connection
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    console.log('[Database] Attempting to connect to MongoDB...');
    console.log('[Database] MONGO_URI length:', process.env.MONGO_URI.length);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Production-ready options (updated for latest Mongoose)
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
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
    console.error('[Database] MONGO_URI value:', process.env.MONGO_URI ? 'EXISTS' : 'UNDEFINED');
    throw error; // Don't exit here, let the retry logic handle it
  }
};

module.exports = connectDB;