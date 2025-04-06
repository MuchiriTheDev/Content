// Claim schema (for payout requests)
// models/Claim.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Sub-schema for Claim Details
const claimDetailsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  platform: {
    type: String,
    enum: ['YouTube', 'TikTok', 'Instagram', 'X', 'Facebook', 'Other'],
    required: true
  },
  incidentType: {
    type: String,
    enum: ['Demonetization', 'Suspension', 'Ban', 'Content Removal', 'Other'],
    required: true
  },
  incidentDate: { type: Date, required: true },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  reportedEarningsLoss: { type: Number, min: 0, required: true }, // Creator-reported loss
  currency: { type: String, default: 'USD', trim: true }
});

// Sub-schema for Evidence
const evidenceSchema = new Schema({
  files: [{
    url: { type: String, required: true }, // URL to uploaded file (e.g., S3, local storage)
    type: { type: String, enum: ['Screenshot', 'Video', 'Document', 'Other'], required: true },
    description: { type: String, trim: true, maxlength: 500 }
  }],
  additionalNotes: { type: String, trim: true, maxlength: 1000 }
});

// Sub-schema for Evaluation
const evaluationSchema = new Schema({
  verifiedEarningsLoss: { type: Number, min: 0 }, // Calculated by CCI
  aiAnalysis: {
    isValid: { type: Boolean, default: null }, // True/False after AI review
    confidenceScore: { type: Number, min: 0, max: 100 }, // % confidence in validity
    reasons: [{ type: String, trim: true }] // e.g., "Matches platform policy violation"
  },
  manualReview: {
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' }, // Admin who reviewed
    notes: { type: String, trim: true, maxlength: 1000 },
    isValid: { type: Boolean, default: null } // Manual override
  },
  payoutAmount: { type: Number, min: 0 }, // Final approved amount
  evaluationDate: { type: Date }
});

// Sub-schema for Status History
const statusHistorySchema = new Schema({
  history: [{
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'AI Reviewed', 'Manual Review', 'Approved', 'Rejected', 'Paid'],
      required: true
    },
    date: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // User or system
    notes: { type: String, trim: true, maxlength: 500 }
  }]
});

// Main Claim Schema
const claimSchema = new Schema({
  claimDetails: { type: claimDetailsSchema, required: true },
  evidence: { type: evidenceSchema, required: true },
  evaluation: { type: evaluationSchema, default: () => ({}) },
  statusHistory: { type: statusHistorySchema, default: () => ({ history: [{ status: 'Submitted' }] }) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolutionDeadline: { type: Date } // 72-hour deadline
}, {
  timestamps: true // Automatically updates createdAt and updatedAt
});

// Indexes for performance
claimSchema.index({ 'claimDetails.userId': 1, createdAt: -1 }); // Fast lookup by user and recency
claimSchema.index({ 'statusHistory.history.status': 1 }); // Query by current status
claimSchema.index({ resolutionDeadline: 1 }); // Track claims nearing deadline

// Pre-save hook to set resolution deadline (72 hours from creation)
claimSchema.pre('save', function (next) {
  if (this.isNew) {
    this.resolutionDeadline = new Date(this.createdAt.getTime() + 72 * 60 * 60 * 1000);
  }
  next();
});

// Method to update status
claimSchema.methods.updateStatus = async function (newStatus, updatedBy, notes = '') {
  this.statusHistory.history.push({
    status: newStatus,
    updatedBy,
    notes
  });
  await this.save();
};

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;