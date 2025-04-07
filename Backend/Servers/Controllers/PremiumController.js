// Premium calculation logic
// controllers/premiumController.js

import Premium from "../Models/Premium.js";
import { sendEmail } from "../Services/EmailServices.js";
import logger from "../Utilities/Logger.js";
import User from "../Models/User.js";

// @desc    Create or update a user's premium
// @route   POST /api/premiums/calculate
// @access  Private (Creator)
export const calculatePremium = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verify user exists and is a creator
    const user = await User.findById(userId);
    if (!user || user.role !== 'Creator') {
      return res.status(403).json({ success: false, error: 'Unauthorized or user not found' });
    }

    // Check if premium exists
    let premium = await Premium.findOne({ 'premiumDetails.userId': userId });
    if (!premium) {
      premium = new Premium({
        premiumDetails: {
          userId,
          baseAmount: 10, // Default base
          adjustmentFactors: {
            earnings: user.financialInfo.monthlyEarnings,
            audienceSize: user.platformInfo.platforms.reduce((sum, p) => sum + p.audienceSize, 0),
            contentRisk: 'Low', // Default, adjust later
            platformVolatility: 0, // Default
            infractionCount: user.platformInfo.platforms.reduce((sum, p) => sum + p.riskHistory.length, 0)
          },
          finalAmount: 10 // Initial value
        },
        paymentStatus: { status: 'Pending' }
      });
    }

    // Recalculate premium
    await premium.recalculatePremium();

    // Update user's financialInfo.premium
    user.financialInfo.premium = {
      amount: premium.premiumDetails.finalAmount,
      lastCalculated: new Date()
    };
    await user.save();

    // Notify user
    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Your CCI Premium Calculated',
      text: `Your premium has been calculated: ${premium.premiumDetails.finalAmount} ${premium.premiumDetails.currency} due by ${premium.paymentStatus.dueDate}.`
    });

    logger.info(`Premium calculated for user ${userId}: ${premium.premiumDetails.finalAmount}`);
    res.status(200).json({ success: true, premium: premium.premiumDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's premium
// @route   GET /api/premiums/my-premium
// @access  Private (Creator)
export const getMyPremium = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const premium = await Premium.findOne({ 'premiumDetails.userId': userId });

    if (!premium) {
      return res.status(404).json({ success: false, error: 'Premium not found' });
    }

    res.json({ success: true, premium });
  } catch (error) {
    next(error);
  }
};

// @desc    Pay a premium
// @route   POST /api/premiums/pay
// @access  Private (Creator)
export const payPremium = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, paymentDetails } = req.body; // e.g., { type: 'MobileMoney', details: '+254...' }

    const premium = await Premium.findOne({ 'premiumDetails.userId': userId });
    if (!premium) {
      return res.status(404).json({ success: false, error: 'Premium not found' });
    }

    if (premium.paymentStatus.status === 'Paid') {
      return res.status(400).json({ success: false, error: 'Premium already paid' });
    }

    // Placeholder payment logic (replace with actual gateway, e.g., Stripe)
    const paymentSuccess = true; // Simulated success
    const transactionId = `txn_${Date.now()}`;

    if (paymentSuccess) {
      premium.paymentStatus.status = 'Paid';
      premium.paymentStatus.paymentDate = new Date();
      premium.paymentStatus.paymentMethod = { type: paymentMethod, details: paymentDetails };
      premium.paymentStatus.transactionId = transactionId;
      premium.paymentStatus.attempts.push({ status: 'Success' });
    } else {
      premium.paymentStatus.attempts.push({ status: 'Failed', errorMessage: 'Payment gateway error' });
      premium.paymentStatus.status = 'Failed';
    }

    await premium.save();

    const user = await User.findById(userId);
    await sendEmail({
      to: user.personalInfo.email,
      subject: `Premium Payment ${paymentSuccess ? 'Successful' : 'Failed'} - CCI`,
      text: paymentSuccess
        ? `Your premium payment of ${premium.premiumDetails.finalAmount} ${premium.premiumDetails.currency} was successful. Transaction ID: ${transactionId}.`
        : `Your premium payment attempt failed. Please try again or contact support.`
    });

    logger.info(`Premium payment ${paymentSuccess ? 'succeeded' : 'failed'} for user ${userId}: ${transactionId}`);
    res.json({
      success: paymentSuccess,
      message: paymentSuccess ? 'Payment successful' : 'Payment failed',
      transactionId: paymentSuccess ? transactionId : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update premium discount (e.g., for preventive services)
// @route   PUT /api/premiums/discount
// @access  Private (Creator)
export const updatePremiumDiscount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { discountAmount, discountReason } = req.body;

    if (!discountAmount || !discountReason) {
      return res.status(400).json({ success: false, error: 'Discount amount and reason are required' });
    }

    const premium = await Premium.findOne({ 'premiumDetails.userId': userId });
    if (!premium) {
      return res.status(404).json({ success: false, error: 'Premium not found' });
    }

    premium.premiumDetails.discount = { amount: discountAmount, reason: discountReason };
    await premium.recalculatePremium();

    const user = await User.findById(userId);
    user.financialInfo.premium.discountApplied = true;
    await user.save();

    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Premium Discount Applied - CCI',
      text: `A discount of ${discountAmount} ${premium.premiumDetails.currency} has been applied to your premium for: ${discountReason}. New amount: ${premium.premiumDetails.finalAmount}.`
    });

    logger.info(`Discount applied to premium for user ${userId}: ${discountAmount}`);
    res.json({ success: true, message: 'Discount applied', premium: premium.premiumDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all premiums (Admin only)
// @route   GET /api/premiums/all
// @access  Private (Admin)
export const getAllPremiums = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) query['paymentStatus.status'] = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const premiums = await Premium.find(query).sort({ 'paymentStatus.dueDate': 1 });
    res.json({ success: true, premiums });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue premiums (Admin only)
// @route   GET /api/premiums/overdue
// @access  Private (Admin)
export const getOverduePremiums = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const now = new Date();
    const premiums = await Premium.find({
      'paymentStatus.status': { $in: ['Pending', 'Failed'] },
      'paymentStatus.dueDate': { $lt: now }
    }).sort({ 'paymentStatus.dueDate': 1 });

    // Mark as overdue and notify users
    for (const premium of premiums) {
      if (premium.paymentStatus.status !== 'Overdue') {
        premium.paymentStatus.status = 'Overdue';
        await premium.save();

        const user = await User.findById(premium.premiumDetails.userId);
        await sendEmail({
          to: user.personalInfo.email,
          subject: 'Overdue Premium Payment - CCI',
          text: `Your premium of ${premium.premiumDetails.finalAmount} ${premium.premiumDetails.currency} is overdue since ${premium.paymentStatus.dueDate}. Please pay immediately to avoid service interruption.`
        });
      }
    }

    res.json({ success: true, premiums });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually adjust premium (Admin only)
// @route   PUT /api/premiums/:id/adjust
// @access  Private (Admin)
export const adjustPremium = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { id } = req.params;
    const { baseAmount, adjustmentFactors, discount, finalAmount } = req.body;

    const premium = await Premium.findById(id);
    if (!premium) {
      return res.status(404).json({ success: false, error: 'Premium not found' });
    }

    // Update premium details
    if (baseAmount) premium.premiumDetails.baseAmount = baseAmount;
    if (adjustmentFactors) premium.premiumDetails.adjustmentFactors = { ...premium.premiumDetails.adjustmentFactors, ...adjustmentFactors };
    if (discount) premium.premiumDetails.discount = { ...premium.premiumDetails.discount, ...discount };
    if (finalAmount) premium.premiumDetails.finalAmount = finalAmount;

    // Log manual adjustment
    premium.calculationHistory.calculations.push({
      baseAmount: premium.premiumDetails.baseAmount,
      adjustmentFactors: premium.premiumDetails.adjustmentFactors,
      discount: premium.premiumDetails.discount,
      finalAmount: premium.premiumDetails.finalAmount,
      calculatedBy: 'Manual'
    });

    await premium.save();

    const user = await User.findById(premium.premiumDetails.userId);
    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Premium Adjusted - CCI',
      text: `Your premium has been manually adjusted to ${premium.premiumDetails.finalAmount} ${premium.premiumDetails.currency}.`
    });

    logger.info(`Premium ${id} manually adjusted for user ${premium.premiumDetails.userId}`);
    res.json({ success: true, message: 'Premium adjusted', premium: premium.premiumDetails });
  } catch (error) {
    next(error);
  }
};

// @desc    Get premium analytics (Admin only)
// @route   GET /api/premiums/analytics
// @access  Private (Admin)
export const getPremiumAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const totalPremiums = await Premium.countDocuments();
    const statusBreakdown = await Premium.aggregate([
      { $group: { _id: '$paymentStatus.status', count: { $sum: 1 } } }
    ]);
    const avgPremium = await Premium.aggregate([
      { $group: { _id: null, avgAmount: { $avg: '$premiumDetails.finalAmount' } } }
    ]);
    const totalRevenue = await Premium.aggregate([
      { $match: { 'paymentStatus.status': 'Paid' } },
      { $group: { _id: null, total: { $sum: '$premiumDetails.finalAmount' } } }
    ]);

    res.json({
      success: true,
      analytics: {
        totalPremiums,
        statusBreakdown,
        averagePremium: avgPremium[0]?.avgAmount || 0,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retry failed payment (Admin or Creator)
// @route   POST /api/premiums/retry-payment
// @access  Private (Creator/Admin)
export const retryPayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const premium = await Premium.findOne({ 'premiumDetails.userId': userId });

    if (!premium) {
      return res.status(404).json({ success: false, error: 'Premium not found' });
    }

    if (premium.paymentStatus.status === 'Paid') {
      return res.status(400).json({ success: false, error: 'Premium already paid' });
    }

    // Placeholder payment retry logic
    const paymentSuccess = Math.random() > 0.3; // Simulated 70% success rate
    const transactionId = `txn_${Date.now()}`;

    if (paymentSuccess) {
      premium.paymentStatus.status = 'Paid';
      premium.paymentStatus.paymentDate = new Date();
      premium.paymentStatus.transactionId = transactionId;
      premium.paymentStatus.attempts.push({ status: 'Success' });
    } else {
      premium.paymentStatus.attempts.push({ status: 'Failed', errorMessage: 'Retry failed' });
      premium.paymentStatus.status = 'Failed';
    }

    await premium.save();

    const user = await User.findById(userId);
    await sendEmail({
      to: user.personalInfo.email,
      subject: `Premium Payment Retry ${paymentSuccess ? 'Successful' : 'Failed'} - CCI`,
      text: paymentSuccess
        ? `Your premium payment retry of ${premium.premiumDetails.finalAmount} ${premium.premiumDetails.currency} was successful. Transaction ID: ${transactionId}.`
        : `Your premium payment retry failed. Please try again or contact support.`
    });

    logger.info(`Premium payment retry ${paymentSuccess ? 'succeeded' : 'failed'} for user ${userId}: ${transactionId}`);
    res.json({
      success: paymentSuccess,
      message: paymentSuccess ? 'Payment retry successful' : 'Payment retry failed',
      transactionId: paymentSuccess ? transactionId : null
    });
  } catch (error) {
    next(error);
  }
};