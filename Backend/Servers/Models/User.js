 // User schema (creators, admins)
// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// Sub-schema for Personal Information
const personalInfoSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'] // E.164 format
  },
  dateOfBirth: { type: Date },
  country: { type: String, required: true, trim: true },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true }
  }
});

// Sub-schema for Platform Information
const platformInfoSchema = new Schema({
  platforms: [{
    name: { type: String, enum: ['YouTube', 'TikTok', 'Instagram', 'X', 'Facebook', 'Other'], required: true },
    username: { type: String, required: true, trim: true },
    profileUrl: { type: String, trim: true },
    audienceSize: { type: Number, min: 0, default: 0 }, // e.g., subscribers/followers
    contentType: { type: String, trim: true }, // e.g., "Gaming", "Lifestyle"
    riskHistory: [{
      violationType: { type: String, trim: true }, // e.g., "Demonetization", "Suspension"
      date: { type: Date, default: Date.now },
      description: { type: String, trim: true }
    }]
  }]
});

// Sub-schema for Financial Information
const financialInfoSchema = new Schema({
  monthlyEarnings: { type: Number, min: 0, default: 0 }, // Base for premium calculation
  currency: { type: String, default: 'USD', trim: true },
  paymentMethod: {
    type: { type: String, enum: ['Bank', 'MobileMoney', 'PayPal', 'Other'], default: 'Bank' },
    details: {
      accountNumber: { type: String, trim: true },
      bankName: { type: String, trim: true },
      mobileNumber: { type: String, trim: true }
    }
  },
  premium: {
    amount: { type: Number, min: 0, default: 0 },
    lastCalculated: { type: Date },
    discountApplied: { type: Boolean, default: false } // For preventive services
  }
});

// Sub-schema for Claim History
const claimHistorySchema = new Schema({
  claims: [{
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim' }, // Reference to Claim model
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    dateSubmitted: { type: Date, default: Date.now },
    payoutAmount: { type: Number, min: 0 }
  }]
});

// Main User Schema
const userSchema = new Schema({
  personalInfo: { type: personalInfoSchema, required: true },
  platformInfo: { type: platformInfoSchema, required: true },
  financialInfo: { type: financialInfoSchema, required: true },
  claimHistory: { type: claimHistorySchema, default: () => ({ claims: [] }) },
  auth: {
    password: { type: String, required: true, select: false }, // Hidden by default
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
  },
  role: { type: String, enum: ['Creator', 'Admin'], default: 'Creator' },
  isVerified: { type: Boolean, default: false }, // Email/phone verification
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically updates createdAt and updatedAt
});

// Indexes for performance
userSchema.index({ 'personalInfo.email': 1 }); // Fast lookup by email
userSchema.index({ 'platformInfo.platforms.name': 1 }); // Query by platform
userSchema.index({ 'claimHistory.claims.status': 1 }); // Filter active claims

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('auth.password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.auth.password = await bcrypt.hash(this.auth.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.auth.password);
};

const User = mongoose.model('User', userSchema);

export default User;