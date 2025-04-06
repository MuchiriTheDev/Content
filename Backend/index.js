// server.js
import app from './App.js'; // Import the configured Express app
import connectDB from './Servers/Config/db.js'; // Import MongoDB connection
import config from './Servers/Config/config.js'; // Import environment config
import logger from './Servers/Utilities/Logger.js'; // Assuming a logger utility

connectDB()
// Start the server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});