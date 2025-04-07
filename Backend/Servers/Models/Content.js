// Content schema (for review/risk analysis)
// models/Content.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Sub-schema for Content Details
const contentDetailsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  platform: {
    type: String,
    enum: ['YouTube', 'TikTok', 'Instagram', 'X', 'Facebook', 'Other'],
    required: true
  },
  contentType: { type: String, trim: true, required: true }, // e.g., "Gaming", "Lifestyle"
  title: { type: String, trim: true, required: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000 },
  url: { type: String, trim: true, required: true }, // Link to content (e.g., YouTube video URL)
  uploadDate: { type: Date, required: true },
  mediaFiles: [{
    url: { type: String, required: true }, // Cloudinary URL
    type: { type: String, enum: ['Image', 'Video', 'Document'], required: true },
    description: { type: String, trim: true, maxlength: 500 }
  }]
});

// Sub-schema for Review History
const reviewHistorySchema = new Schema({
  reviews: [{
    date: { type: Date, default: Date.now },
    reviewerType: { type: String, enum: ['AI', 'Manual'], required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' }, // For manual reviews
    notes: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Flagged', 'Approved'],
      default: 'Pending'
    }
  }]
});

// Sub-schema for Risk Assessment
const riskAssessmentSchema = new Schema({
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  confidenceScore: { type: Number, min: 0, max: 100 }, // % confidence from AI
  potentialViolations: [{
    type: { type: String, trim: true }, // e.g., "Copyright", "Community Guidelines"
    description: { type: String, trim: true, maxlength: 500 },
    severity: { type: String, enum: ['Minor', 'Moderate', 'Severe'] }
  }],
  lastAssessed: { type: Date },
  recommendations: [{ type: String, trim: true }] // e.g., "Remove copyrighted music"
});

// Main Content Schema
const contentSchema = new Schema({
  contentDetails: { type: contentDetailsSchema, required: true },
  reviewHistory: { type: reviewHistorySchema, default: () => ({ reviews: [{ reviewerType: 'AI', status: 'Pending' }] }) },
  riskAssessment: { type: riskAssessmentSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reviewDeadline: { type: Date } // Optional deadline for review
}, {
  timestamps: true
});

// Indexes for performance
contentSchema.index({ 'contentDetails.userId': 1, createdAt: -1 }); // Fast lookup by user and recency
contentSchema.index({ 'reviewHistory.reviews.status': 1 }); // Query by review status
contentSchema.index({ 'riskAssessment.riskLevel': 1 }); // Filter by risk level

// Pre-save hook to set review deadline (e.g., 7 days from creation)
contentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.reviewDeadline = new Date(this.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }
  next();
});

// Method to update review status
contentSchema.methods.updateReviewStatus = async function (status, reviewerType, reviewerId, notes = '') {
  this.reviewHistory.reviews.push({
    reviewerType,
    reviewerId,
    status,
    notes
  });
  await this.save();
};

// Method to assess risk (placeholder logic)
contentSchema.methods.assessRisk = async function () {
  // Placeholder AI logic (replace with actual integration)
  const riskScore = Math.floor(Math.random() * 100); // Simulated score
  const riskLevel = riskScore > 80 ? 'High' : riskScore > 50 ? 'Medium' : 'Low';
  const potentialViolations = riskScore > 50 ? [{
    type: 'Community Guidelines',
    description: 'Content may violate platform rules',
    severity: riskScore > 80 ? 'Severe' : 'Moderate'
  }] : [];

  this.riskAssessment = {
    riskLevel,
    confidenceScore: riskScore,
    potentialViolations,
    lastAssessed: new Date(),
    recommendations: riskScore > 50 ? ['Review platform guidelines', 'Edit content'] : []
  };

  await this.updateReviewStatus('Reviewed', 'AI', null, `Risk assessed as ${riskLevel}`);
};

const Content = mongoose.model('Content', contentSchema);

export default Content; 