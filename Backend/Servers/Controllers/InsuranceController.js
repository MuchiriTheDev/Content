// controllers/insuranceController.js
import User from '../Models/User.js';
import Premium from '../Models/Premium.js';
import { sendEmail } from '../Services/EmailServices.js';
import logger from '../Utilities/Logger.js';

// @desc    Apply for insurance
// @route   POST /api/insurance/apply
// @access  Private (Creator)
// controllers/insuranceController.js
export const applyForInsurance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { platformData, estimatedEarnings } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'Creator') {
      return res.status(403).json({ success: false, error: 'Unauthorized or user not found' });
    }

    if (user.insuranceStatus.status !== 'NotApplied' && user.insuranceStatus.status !== 'Rejected' && user.insuranceStatus.status !== 'Surrendered') {
      return res.status(400).json({ success: false, error: 'Insurance already applied for or active' });
    }

    if (platformData && Array.isArray(platformData)) {
      user.platformInfo.platforms = platformData.map(p => ({
        name: p.name,
        username: p.username,
        accountLink: p.accountLink || '',
        audienceSize: p.audienceSize || 0,
        contentType: p.contentType || '',
        riskHistory: p.riskHistory || []
      }));
    }
    if (estimatedEarnings) {
      user.financialInfo.monthlyEarnings = estimatedEarnings;
    }

    user.insuranceStatus = {
      status: 'Pending',
      appliedAt: new Date(),
      approvedAt: null,
      surrenderedAt: null,
      rejectionReason: null,
      policyStartDate: null,
      policyEndDate: null
    };
    await user.save();

    let premium = await Premium.findOne({ 'premiumDetails.userId': userId });
    if (!premium) {
      premium = new Premium({
        premiumDetails: {
          userId,
          baseAmount: 1000,
          adjustmentFactors: {
            earnings: user.financialInfo.monthlyEarnings || 0,
            audienceSize: user.platformInfo.platforms.reduce((sum, p) => sum + p.audienceSize, 0),
            contentRisk: 'Low',
            platformVolatility: 0,
            infractionCount: user.platformInfo.platforms.reduce((sum, p) => sum + p.riskHistory.length, 0),
            riskExplanation: ''
          },
          finalAmount: 1000,
          currency: 'Ksh'
        },
        paymentStatus: {
          status: 'Pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    await premium.recalculatePremium();
    user.financialInfo.premium = {
      amount: premium.premiumDetails.finalAmount,
      lastCalculated: new Date(),
      insuranceId: premium._id
    };
    await user.save();

    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Insurance Application Submitted - CCI',
      text: `Your insurance application has been submitted. Monthly premium: Ksh ${premium.premiumDetails.finalAmount}.`
    });

    logger.info(`Insurance application by ${userId}. Monthly premium: Ksh ${premium.premiumDetails.finalAmount}, Risk: ${premium.premiumDetails.adjustmentFactors.contentRisk}`);
    res.status(201).json({
      success: true,
      message: 'Insurance application submitted successfully',
      premium: premium.premiumDetails
    });
  } catch (error) {
    logger.error(`Error in applyForInsurance: ${error.message}`);
    next(error);
  }
};

// @desc    Surrender insurance
// @route   POST /api/insurance/surrender
// @access  Private (Creator)
export const surrenderInsurance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'Creator') {
      return res.status(403).json({ success: false, error: 'Unauthorized or user not found' });
    }

    if (user.insuranceStatus.status !== 'Approved') {
      return res.status(400).json({ success: false, error: 'No active insurance to surrender' });
    }

    user.insuranceStatus.status = 'Surrendered';
    user.insuranceStatus.surrenderedAt = new Date();
    user.insuranceStatus.rejectionReason = reason || 'User-initiated surrender';
    user.insuranceStatus.policyEndDate = new Date();
    await user.save();

    const premium = await Premium.findOne({ 'premiumDetails.userId': userId });
    if (premium) {
      await premium.deleteOne();
    }

    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Insurance Surrendered - CCI',
      text: `Your insurance has been surrendered${reason ? ` due to: ${reason}` : ''}.`
    });

    logger.info(`Insurance surrendered by ${userId}${reason ? `: ${reason}` : ''}`);
    res.json({ success: true, message: 'Insurance surrendered successfully' });
  } catch (error) {
    logger.error(`Error in surrenderInsurance: ${error.message}`);
    next(error);
  }
};

// @desc    Get insurance status
// @route   GET /api/insurance/status
// @access  Private (Creator)
export const getInsuranceStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== 'Creator') {
      return res.status(403).json({ success: false, error: 'Unauthorized or user not found' });
    }

    const premium = await Premium.findOne({ 'premiumDetails.userId': userId });
    res.json({
      success: true,
      insuranceStatus: user.insuranceStatus,
      premium: premium ? premium.premiumDetails : null
    });
  } catch (error) {
    logger.error(`Error in getInsuranceStatus: ${error.message}`);
    next(error);
  }
};




// controllers/insuranceController.js
// ... (previous imports and functions remain)

// @desc    Add a platform to existing insurance
// @route   POST /api/insurance/add-platform
// @access  Private (Creator)
export const addPlatformToInsurance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { platform } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'Creator') {
      return res.status(403).json({ success: false, error: 'Unauthorized or user not found' });
    }

    if (user.insuranceStatus.status !== 'Pending' && user.insuranceStatus.status !== 'Approved') {
      return res.status(400).json({ success: false, error: 'No active or pending insurance to update' });
    }

    if (!platform || !platform.name || !platform.username) {
      return res.status(400).json({ success: false, error: 'Platform name and username are required' });
    }

    user.platformInfo.platforms.push({
      name: platform.name,
      username: platform.username,
      profileUrl: platform.profileUrl || '',
      audienceSize: platform.audienceSize || 0,
      contentType: platform.contentType || '',
      riskHistory: platform.riskHistory || []
    });
    await user.save();

    const premium = await Premium.findOne({ 'premiumDetails.userId': userId });
    if (!premium) {
      return res.status(404).json({ success: false, error: 'Premium not found' });
    }

    await premium.recalculatePremium();
    user.financialInfo.premium = {
      amount: premium.premiumDetails.finalAmount,
      lastCalculated: new Date(),
      insuranceId: premium._id
    };
    await user.save();

    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Platform Added to CCI Insurance',
      text: `A new platform (${platform.name}) has been added to your insurance. Updated monthly premium: Ksh ${premium.premiumDetails.finalAmount}. Risk: ${premium.premiumDetails.adjustmentFactors.contentRisk}. Why: ${premium.premiumDetails.adjustmentFactors.riskExplanation}`
    });

    logger.info(`Platform added to insurance for user ${userId}. Monthly premium: Ksh ${premium.premiumDetails.finalAmount}, Risk: ${premium.premiumDetails.adjustmentFactors.contentRisk}`);
    res.status(200).json({
      success: true,
      message: 'Platform added to insurance successfully',
      premium: premium.premiumDetails
    });
  } catch (error) {
    logger.error(`Error in addPlatformToInsurance: ${error.message}`);
    next(error);
  }
};