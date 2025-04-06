// app.js
import express from 'express';
// import contentRoutes from './routes/content.js';
// import premiumRoutes from './routes/premiums.js';
import errorHandler from './Servers/Middlewares/ErrorHandler.js';
import logger from './Servers/Utilities/Logger.js';
import AuthRouter from './Servers/Routes/AuthenticationRoutes.js';
import claimsRouter from './Servers/Routes/ClaimsRoutes.js';
import config from './Servers/config/config.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', AuthRouter);
app.use('/api/claims', claimsRouter);
// app.use('/api/content', contentRoutes);
// app.use('/api/premiums', premiumRoutes);

// Root route (health check)
app.get('/', (req, res) => {
  res.json({ message: 'Content Creators Insurance API', environment: config.NODE_ENV });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;