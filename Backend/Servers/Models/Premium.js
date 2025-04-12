// models/Premium.js
import mongoose from 'mongoose';
import User from './User.js';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Schema } from 'mongoose';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const premiumSchema = new Schema({
  premiumDetails: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    baseAmount: { type: Number, min: 0, required: true },
    currency: { type: String, default: 'Ksh', trim: true },
    adjustmentFactors: {
      earnings: { type: Number, min: 0, default: 0 },
      audienceSize: { type: Number, min: 0, default: 0 },
      contentRisk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
      platformVolatility: { type: Number, min: 0, max: 100, default: 0 },
      infractionCount: { type: Number, min: 0, default: 0 },
      riskExplanation: { type: String, trim: true }
    },
    discount: {
      amount: { type: Number, min: 0, default: 0 },
      reason: { type: String, trim: true }
    },
    finalAmount: { type: Number, min: 0, required: true } // This will be the monthly premium
  },
  calculationHistory: {
    calculations: [{
      date: { type: Date, default: Date.now },
      baseAmount: { type: Number, min: 0 },
      adjustmentFactors: {
        earnings: { type: Number, min: 0 },
        audienceSize: { type: Number, min: 0 },
        contentRisk: { type: String, enum: ['Low', 'Medium', 'High'] },
        platformVolatility: { type: Number, min: 0, max: 100 },
        infractionCount: { type: Number, min: 0 },
        riskExplanation: { type: String, trim: true }
      },
      discount: {
        amount: { type: Number, min: 0 },
        reason: { type: String, trim: true }
      },
      finalAmount: { type: Number, min: 0 }
    }]
  },
  paymentStatus: {
    status: { type: String, enum: ['Pending', 'Paid', 'Overdue', 'Failed'], default: 'Pending' },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    paymentMethod: {
      type: { type: String, enum: ['Bank', 'MobileMoney', 'PayPal', 'Other'] },
      details: { type: String, trim: true }
    },
    transactionId: { type: String, trim: true },
    attempts: [{
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ['Success', 'Failed'] },
      errorMessage: { type: String, trim: true }
    }]
  },
  billingCycle: { type: String, enum: ['Monthly', 'Quarterly', 'Annually'], default: 'Monthly' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  nextCalculationDate: { type: Date }
}, { timestamps: true });

premiumSchema.index({ 'premiumDetails.userId': 1, 'paymentStatus.dueDate': 1 });
premiumSchema.index({ 'paymentStatus.status': 1 });

premiumSchema.pre('save', function (next) {
  if (this.isNew) {
    const now = new Date();
    this.paymentStatus.dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.nextCalculationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
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

premiumSchema.methods.recalculatePremium = async function () {
  const user = await User.findById(this.premiumDetails.userId);
  if (!user) throw new Error('User not found');

  console.log('Recalculating premium for user:', user._id);
  console.log('GEMINI_API_KEY:', GEMINI_API_KEY ? 'Set' : 'Missing');

  try {
    if (!GEMINI_API_KEY) throw new Error('Gemini API key is not configured');

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const platformsData = JSON.stringify(user.platformInfo.platforms.map(p => ({
      name: p.name,
      audienceSize: p.audienceSize,
      contentType: p.contentType || 'Unknown',
      infractionCount: p.riskHistory.length
    })));

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: 'user',
          parts: [{
            text: `You are an AI assistant for Content Creators Insurance (CCI). Recalculate a **monthly** insurance premium and assess risk level (Low, Medium, High) in Kenyan Shillings (Ksh):
              - **Risk Assessment**:
                - Consider earnings, audience size, content type, and infractions across all platforms.
                - Low: Stable earnings (< Ksh 50,000), low infractions (<2), safe content (e.g., education).
                - Medium: Moderate earnings (Ksh 50,000-200,000), some infractions (2-5), moderate content (e.g., lifestyle).
                - High: High earnings (> Ksh 200,000), many infractions (>5), risky content (e.g., controversial).
                - Provide "Risk: [Level]" and "Why: [Explanation]".
              - **Monthly Premium Calculation**:
                - Base Amount: Ksh 1000 per month.
                - Earnings: +5% of monthly earnings.
                - Audience Size: +Ksh 100 per 10,000 followers (total across platforms) per month.
                - Content Risk: Low = 0%, Medium = +20%, High = +50% on base per month.
                - Infractions: +Ksh 500 per violation (total across platforms) per month.
                - Return "Final Premium: Ksh X.XX" (monthly amount).
              - **Data**:
                - Earnings: Ksh ${user.financialInfo.monthlyEarnings || 0}
                - Platforms: ${platformsData}
                - Total Infractions: ${user.platformInfo.platforms.reduce((sum, p) => sum + p.riskHistory.length, 0)}`
          }],
        },
      ],
    });

    const prompt = `Recalculate the monthly premium and assess risk now.`;
    console.log('Sending prompt to Gemini:', prompt);
    const result = await chat.sendMessage(prompt);
    const response = result.response.text();
    console.log('Gemini response:', response);

    const riskMatch = response.match(/Risk: (Low|Medium|High)/);
    const riskExplanationMatch = response.match(/Why: (.+?)(?=Final Premium|$)/);
    const finalAmountMatch = response.match(/Final Premium: Ksh ([\d.]+)/);

    const contentRisk = riskMatch ? riskMatch[1] : 'Low';
    const riskExplanation = riskExplanationMatch ? riskExplanationMatch[1].trim() : 'Default risk assessment';
    const finalAmount = finalAmountMatch ? parseFloat(finalAmountMatch[1]) : 3000;

    this.premiumDetails.baseAmount = 500;
    this.premiumDetails.finalAmount = finalAmount;
    this.premiumDetails.adjustmentFactors = {
      earnings: user.financialInfo.monthlyEarnings || 0,
      audienceSize: user.platformInfo.platforms.reduce((sum, p) => sum + p.audienceSize, 0),
      contentRisk,
      platformVolatility: this.premiumDetails.adjustmentFactors.platformVolatility,
      infractionCount: user.platformInfo.platforms.reduce((sum, p) => sum + p.riskHistory.length, 0),
      riskExplanation
    };
    this.premiumDetails.currency = 'Ksh';

    this.calculationHistory.calculations.push({
      baseAmount: 1000,
      adjustmentFactors: this.premiumDetails.adjustmentFactors,
      discount: this.premiumDetails.discount,
      finalAmount,
      calculatedBy: 'AI'
    });

    if (!this.paymentStatus.dueDate) {
      const now = new Date();
      this.paymentStatus.dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    const now = new Date();
    this.nextCalculationDate = new Date(now.getTime() + (this.billingCycle === 'Monthly' ? 30 : this.billingCycle === 'Quarterly' ? 90 : 365) * 24 * 60 * 60 * 1000);

    await this.save();
    console.log('Monthly premium recalculated successfully:', finalAmount, 'Risk:', contentRisk);
  } catch (error) {
    console.error('Error in recalculatePremium:', error.message, error.stack);
    throw new Error('Failed to recalculate premium');
  }
};

const Premium = mongoose.model('Premium', premiumSchema);

export default Premium;