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
    accountLink: { type: String, trim: true , require : true}, // Link to profiles or channels
    audienceSize: { type: Number, min: 0, default: 0 }, // For premium calculation
    contentType: { type: String, trim: true }, // e.g., "Gaming", "Lifestyle"
    riskHistory: [{
      violationType: { type: String, trim: true }, // e.g., "Demonetization"
      date: { type: Date, default: Date.now },
      description: { type: String, trim: true }
    }]
  }]
});

// Sub-schema for Financial Information
const financialInfoSchema = new Schema({
  monthlyEarnings: { type: Number, min: 0, default: 0 }, // Base for premium calculation
  currency: { type: String, default: 'Ksh', trim: true },
  paymentMethod: {
    type: { type: String, enum: ['Bank', 'Mpesa', 'PayPal', 'Other'], default: 'Mpesa' },
    details: {
      accountNumber: { type: String, trim: true },
      bankName: { type: String, trim: true },
      mobileNumber: { type: String, trim: true }
    }
  },
  premium: {
    amount: { type: Number, min: 0, default: 0 },
    lastCalculated: { type: Date },
    discountApplied: { type: Boolean, default: false }, // For preventive services
    insuranceId: { type: Schema.Types.ObjectId, ref: 'Premium' } // Link to Premium document
  }
});

// Sub-schema for Claim History
const claimHistorySchema = new Schema({
  claims: [{
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    dateSubmitted: { type: Date, default: Date.now },
    payoutAmount: { type: Number, min: 0 }
  }]
});

// Sub-schema for Insurance Status
const insuranceStatusSchema = new Schema({
  status: {
    type: String,
    enum: ['NotApplied', 'Pending', 'Approved', 'Rejected', 'Surrendered'],
    default: 'NotApplied' // Default state before application
  },
  appliedAt: { type: Date },
  approvedAt: { type: Date },
  surrenderedAt: { type: Date },
  rejectionReason: { type: String, trim: true },
  policyStartDate: { type: Date }, // When insurance becomes active
  policyEndDate: { type: Date } // When surrendered or expires
});

// Main User Schema
const userSchema = new Schema({
  personalInfo: { type: personalInfoSchema, required: true },
  platformInfo: { type: platformInfoSchema, required: true },
  financialInfo: { type: financialInfoSchema, required: true },
  claimHistory: { type: claimHistorySchema, default: () => ({ claims: [] }) },
  insuranceStatus: { type: insuranceStatusSchema, default: () => ({}) }, // Added insurance status
  auth: {
    password: { type: String, required: true, select: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
  },
  role: { type: String, enum: ['Creator', 'Admin'], default: 'Creator' },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ 'personalInfo.email': 1 });
userSchema.index({ 'platformInfo.platforms.name': 1 });
userSchema.index({ 'claimHistory.claims.status': 1 });
userSchema.index({ 'insuranceStatus.status': 1 }); // For quick status queries

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