// Premium schema (personalized pricing)
// models/Premium.js
import mongoose from 'mongoose';
import User from './User.js';

const { Schema } = mongoose;

// Sub-schema for Premium Details
const premiumDetailsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  baseAmount: { type: Number, min: 0, required: true }, // Base premium before adjustments
  currency: { type: String, default: 'USD', trim: true },
  adjustmentFactors: {
    earnings: { type: Number, min: 0, default: 0 }, // Monthly earnings impact
    audienceSize: { type: Number, min: 0, default: 0 }, // Audience size impact
    contentRisk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' }, // Risk level
    platformVolatility: { type: Number, min: 0, max: 100, default: 0 }, // % volatility score
    infractionCount: { type: Number, min: 0, default: 0 } // Past violations
  },
  discount: {
    amount: { type: Number, min: 0, default: 0 }, // Discount for preventive services
    reason: { type: String, trim: true } // e.g., "Completed guideline training"
  },
  finalAmount: { type: Number, min: 0, required: true } // Final premium after adjustments
});

// Sub-schema for Calculation History
const calculationHistorySchema = new Schema({
  calculations: [{
    date: { type: Date, default: Date.now },
    baseAmount: { type: Number, min: 0 },
    adjustmentFactors: {
      earnings: { type: Number, min: 0 },
      audienceSize: { type: Number, min: 0 },
      contentRisk: { type: String, enum: ['Low', 'Medium', 'High'] },
      platformVolatility: { type: Number, min: 0, max: 100 },
      infractionCount: { type: Number, min: 0 }
    },
    discount: {
      amount: { type: Number, min: 0 },
      reason: { type: String, trim: true }
    },
    finalAmount: { type: Number, min: 0 },
    calculatedBy: { type: String, enum: ['AI', 'Manual'], default: 'AI' }
  }]
});

// Sub-schema for Payment Status
const paymentStatusSchema = new Schema({
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Failed'],
    default: 'Pending'
  },
  dueDate: { type: Date, required: true },
  paymentDate: { type: Date },
  paymentMethod: {
    type: { type: String, enum: ['Bank', 'MobileMoney', 'PayPal', 'Other'] },
    details: { type: String, trim: true } // e.g., "M-Pesa: +254..."
  },
  transactionId: { type: String, trim: true },
  attempts: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Failed'] },
    errorMessage: { type: String, trim: true }
  }]
});

// Main Premium Schema
const premiumSchema = new Schema({
  premiumDetails: { type: premiumDetailsSchema, required: true },
  calculationHistory: { type: calculationHistorySchema, default: () => ({ calculations: [] }) },
  paymentStatus: { type: paymentStatusSchema, required: true },
  billingCycle: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Annually'],
    default: 'Monthly'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  nextCalculationDate: { type: Date } // When to recalculate
}, {
  timestamps: true
});

// Indexes for performance
premiumSchema.index({ 'premiumDetails.userId': 1, 'paymentStatus.dueDate': 1 }); // Fast lookup by user and due date
premiumSchema.index({ 'paymentStatus.status': 1 }); // Query by payment status

// Pre-save hook to set initial due date and next calculation date
premiumSchema.pre('save', function (next) {
  if (this.isNew) {
    const now = new Date();
    this.paymentStatus.dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from creation
    this.nextCalculationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Monthly recalculation
    if (this.billingCycle === 'Quarterly') {
      this.paymentStatus.dueDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      this.nextCalculationDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    } else if (this.billingCycle === 'Annually') {
      this.paymentStatus.dueDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      this.nextCalculationDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    }
  }
  next();
});

// Method to recalculate premium (placeholder logic)
// models/Premium.js
premiumSchema.methods.recalculatePremium = async function () {
  const user = await User.findById(this.premiumDetails.userId);
  if (!user) throw new Error('User not found');

  // Gemini API call
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      contents: [{
        parts: [{
          text: `Calculate a premium based on: Earnings: $${user.financialInfo.monthlyEarnings}, Audience: ${user.platformInfo.platforms.reduce((sum, p) => sum + p.audienceSize, 0)}, Infractions: ${this.premiumDetails.adjustmentFactors.infractionCount}, Risk: ${this.premiumDetails.adjustmentFactors.contentRisk}`
        }]
      }]
    },
    { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
  );

  const analysis = response.data.candidates[0].content.parts[0].text;
  const baseAmount = 10;
  const finalAmount = parseFloat(analysis.match(/Final: \$([\d.]+)/)?.[1]) || baseAmount + 20; // Fallback

  this.premiumDetails.baseAmount = baseAmount;
  this.premiumDetails.finalAmount = finalAmount;
  this.calculationHistory.calculations.push({
    baseAmount,
    adjustmentFactors: this.premiumDetails.adjustmentFactors,
    discount: this.premiumDetails.discount,
    finalAmount,
    calculatedBy: 'AI'
  });

  const now = new Date();
  this.nextCalculationDate = new Date(now.getTime() + (this.billingCycle === 'Monthly' ? 30 : this.billingCycle === 'Quarterly' ? 90 : 365) * 24 * 60 * 60 * 1000);

  await this.save();
};

const Premium = mongoose.model('Premium', premiumSchema);

export default Premium;