//Environment variables (e.g., PORT, JWT_SECRET)
// config/config.js
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    // Server settings
    PORT: process.env.PORT || 5000,

    // MongoDB connection string
    MONGODB_URI: process.env.MONGODB_URI,

    // JWT secret for authentication (used in auth routes)
    JWT_SECRET: process.env.JWT_SECRET , // Replace with a secure key in production

    // Environment flag
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Optional: Payment gateway API keys (e.g., for premium payments)
    PAYMENT_API_KEY: process.env.PAYMENT_API_KEY || '',

    // Optional: Email service credentials (e.g., for claim notifications)
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

export default config;