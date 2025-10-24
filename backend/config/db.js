const mongoose = require('mongoose');

// Disable any global mongoose defaults that might cause issues
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Validate MONGO_URI before attempting connection
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    console.log('[Database] Attempting to connect to MongoDB...');
    console.log('[Database] MONGO_URI length:', process.env.MONGO_URI.length);
    
    // Ultra-simple connection with NO options to avoid any deprecated option errors
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`[Database] MongoDB Connection Established: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    console.error('[Database] MONGO_URI value:', process.env.MONGO_URI ? 'EXISTS' : 'UNDEFINED');
    throw error; // Don't exit here, let the retry logic handle it
  }
};

module.exports = connectDB;