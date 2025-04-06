// MongoDB connection setup
// config/db.js
import mongoose from 'mongoose';// Assuming a logger utility for debugging
import config from "./config.js"; // Configuration file for environment variables
import logger from "../Utilities/Logger.js"

const connectDB = async () => {
    try {
        // MongoDB connection options for performance and reliability
        const conn = await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s if server unavailable
            autoIndex: true, // Automatically build indexes defined in schemas
        });

        logger.info(`MongoDB Connected ✔✔`);
    } catch (error) {
        logger.error(`MongoDB Connection Error: ${error.message}`);
        // Retry connection after 5 seconds if it fails
        setTimeout(connectDB, 5000);
    }
};

// Handle disconnection events
mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB Disconnected. Attempting to reconnect...');
    connectDB();
});

// Export the connection function
export default connectDB;