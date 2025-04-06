// Claim processing logic
// controllers/claimController.js
import User from '../Models/User.js';
import Claim from '../Models/Claim.js';
import  { sendEmail} from '../Services/EmailServices.js';
import logger from '../Utilities/Logger.js'
import upload from '../Utilities/Multer.js';

export const uploadClaimFiles = upload.array('evidenceFiles', 5);
export const submitClaim = async (req, res, next) => {
    try {
      const { platform, incidentType, incidentDate, description, reportedEarningsLoss } = req.body;
      const userId = req.user.id;
  
      // Validate required fields
      if (!platform || !incidentType || !incidentDate || !description || !reportedEarningsLoss || !req.files?.length) {
        return res.status(400).json({ success: false, error: 'All required fields and at least one evidence file must be provided' });
      }
  
      const user = await User.findById(userId);
      if (!user || user.role !== 'Creator') {
        return res.status(403).json({ success: false, error: 'Unauthorized or user not found' });
      }
  
      // Upload files to Cloudinary
      const evidenceFiles = await Promise.all(
        req.files.map(async (file) => {
          const { url } = await uploadToCloudinary(file);
          await fs.unlink(file.path); // Delete temp file
          return {
            url,
            type: file.mimetype.startsWith('image') ? 'Screenshot' : file.mimetype === 'application/pdf' ? 'Document' : 'Video',
            description: req.body[`description_${file.fieldname}`] || ''
          };
        })
      );
  
      // Create claim
      const claim = new Claim({
        claimDetails: { userId, platform, incidentType, incidentDate, description, reportedEarningsLoss },
        evidence: { files: evidenceFiles, additionalNotes: req.body.additionalNotes || '' }
      });
  
      await claim.save();
      user.claimHistory.claims.push({ claimId: claim._id });
      await user.save();
  
      await sendEmail({
        to: user.personalInfo.email,
        subject: 'Claim Submitted - CCI',
        text: `Your claim (ID: ${claim._id}) has been submitted and will be processed within 72 hours.`
      });
  
      logger.info(`Claim submitted by ${userId}: ${claim._id}`);
      res.status(201).json({ success: true, claimId: claim._id, message: 'Claim submitted successfully' });
    } catch (error) {
      // Clean up temp files on error
      if (req.files) {
        await Promise.all(req.files.map(file => fs.unlink(file.path).catch(() => {})));
      }
      next(error);
    }
  };
  
  // @desc    Update claim evidence (before review)
  // @route   PUT /api/claims/:id/evidence
  // @access  Private (Creator)
  export const updateClaimEvidence = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { additionalNotes } = req.body;
      const claim = await Claim.findById(id);
  
      if (!claim) {
        return res.status(404).json({ success: false, error: 'Claim not found' });
      }
  
      if (claim.claimDetails.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }
  
      if (claim.statusHistory.history[claim.statusHistory.history.length - 1].status !== 'Submitted') {
        return res.status(400).json({ success: false, error: 'Cannot update evidence after review started' });
      }
  
      // Upload new files to Cloudinary if provided
      let evidenceFiles = claim.evidence.files;
      if (req.files?.length) {
        const newFiles = await Promise.all(
          req.files.map(async (file) => {
            const { url } = await uploadToCloudinary(file);
            await fs.unlink(file.path); // Delete temp file
            return {
              url,
              type: file.mimetype.startsWith('image') ? 'Screenshot' : file.mimetype === 'application/pdf' ? 'Document' : 'Video',
              description: req.body[`description_${file.fieldname}`] || ''
            };
          })
        );
        evidenceFiles = [...evidenceFiles, ...newFiles];
      }
  
      claim.evidence = { files: evidenceFiles, additionalNotes: additionalNotes || claim.evidence.additionalNotes };
      await claim.save();
  
      logger.info(`Evidence updated for claim ${id} by ${req.user.id}`);
      res.json({ success: true, message: 'Evidence updated successfully', evidence: claim.evidence });
    } catch (error) {
      if (req.files) {
        await Promise.all(req.files.map(file => fs.unlink(file.path).catch(() => {})));
      }
      next(error);
    }
  };

// @desc    Get all claims for the current user
// @route   GET /api/claims/my-claims
// @access  Private (Creator)
export const getMyClaims = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const claims = await Claim.find({ 'claimDetails.userId': userId })
      .sort({ createdAt: -1 })
      .select('-evaluation.aiAnalysis.reasons'); // Exclude sensitive AI details

    res.json({ success: true, claims });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single claim by ID
// @route   GET /api/claims/:id
// @access  Private (Creator/Admin)
export const getClaimById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findById(id);

    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    // Restrict access
    if (req.user.role !== 'Admin' && claim.claimDetails.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    res.json({ success: true, claim });
  } catch (error) {
    next(error);
  }
};



// @desc    AI evaluate a claim
// @route   POST /api/claims/:id/evaluate-ai
// @access  Private (Admin)
export const evaluateClaimAI = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    // Placeholder AI logic (replace with actual AI integration)
    const aiResult = {
      isValid: Math.random() > 0.2, // Simulated 80% validity rate
      confidenceScore: Math.floor(Math.random() * 41) + 60, // 60-100%
      reasons: ['Matches platform policy violation', 'Evidence supports claim']
    };

    claim.evaluation.aiAnalysis = aiResult;
    claim.evaluation.verifiedEarningsLoss = aiResult.isValid
      ? claim.claimDetails.reportedEarningsLoss * 0.9 // 90% of reported loss
      : 0;
    await claim.updateStatus('AI Reviewed', req.user.id, 'AI evaluation completed');

    logger.info(`AI evaluated claim ${id}: ${aiResult.isValid ? 'Valid' : 'Invalid'}`);
    res.json({ success: true, message: 'Claim evaluated by AI', aiResult });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually review a claim
// @route   POST /api/claims/:id/review-manual
// @access  Private (Admin)
export const reviewClaimManual = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isValid, notes, payoutAmount } = req.body;

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    claim.evaluation.manualReview = { reviewerId: req.user.id, notes, isValid };
    claim.evaluation.payoutAmount = isValid ? payoutAmount || claim.evaluation.verifiedEarningsLoss : 0;
    claim.evaluation.evaluationDate = new Date();
    const newStatus = isValid ? 'Approved' : 'Rejected';
    await claim.updateStatus(newStatus, req.user.id, notes);

    // Notify user
    const user = await User.findById(claim.claimDetails.userId);
    await sendEmail({
      to: user.personalInfo.email,
      subject: `Claim ${newStatus} - CCI`,
      text: `Your claim (ID: ${id}) has been ${newStatus.toLowerCase()}. ${notes}`
    });

    logger.info(`Claim ${id} manually reviewed: ${newStatus}`);
    res.json({ success: true, message: `Claim ${newStatus.toLowerCase()}`, claim });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark claim as paid
// @route   POST /api/claims/:id/paid
// @access  Private (Admin)
export const markClaimPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const claim = await Claim.findById(id);
    if (!claim) {
      return res.status(404).json({ success: false, error: 'Claim not found' });
    }

    if (claim.statusHistory.history[claim.statusHistory.history.length - 1].status !== 'Approved') {
      return res.status(400).json({ success: false, error: 'Claim must be approved before marking as paid' });
    }

    await claim.updateStatus('Paid', req.user.id, 'Payout processed');
    
    const user = await User.findById(claim.claimDetails.userId);
    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Claim Payment Processed - CCI',
      text: `Your claim (ID: ${id}) has been paid. Amount: ${claim.evaluation.payoutAmount} ${claim.claimDetails.currency}.`
    });

    logger.info(`Claim ${id} marked as paid`);
    res.json({ success: true, message: 'Claim marked as paid' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims (Admin only)
// @route   GET /api/claims/all
// @access  Private (Admin)
export const getAllClaims = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { status, platform, startDate, endDate } = req.query;
    const query = {};

    if (status) query['statusHistory.history.status'] = status;
    if (platform) query['claimDetails.platform'] = platform;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const claims = await Claim.find(query).sort({ createdAt: -1 });
    res.json({ success: true, claims });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claims nearing 72-hour deadline
// @route   GET /api/claims/pending-deadline
// @access  Private (Admin)
export const getPendingDeadlineClaims = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const now = new Date();
    const claims = await Claim.find({
      resolutionDeadline: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) }, // Within next 24 hours
      'statusHistory.history.status': { $nin: ['Approved', 'Rejected', 'Paid'] }
    }).sort({ resolutionDeadline: 1 });

    res.json({ success: true, claims });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete a claim (before review)
// @route   DELETE /api/claims/:id
// @access  Private (Creator)
export const deleteClaim = async (req, res, next) => {
    try {
      const { id } = req.params;
      const claim = await Claim.findById(id);
  
      if (!claim) {
        return res.status(404).json({ success: false, error: 'Claim not found' });
      }
  
      if (claim.claimDetails.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }
  
      if (claim.statusHistory.history[claim.statusHistory.history.length - 1].status !== 'Submitted') {
        return res.status(400).json({ success: false, error: 'Cannot delete claim after review started' });
      }
  
      // Delete associated Cloudinary files
      if (claim.evidence.files.length > 0) {
        const deletePromises = claim.evidence.files.map(async (file) => {
          const publicId = file.url.split('/').pop().split('.')[0]; // Extract public ID from URL
          await deleteFromCloudinary(`cci/claims/${publicId}`);
        });
        await Promise.all(deletePromises);
      }
  
      // Remove claim from database
      await claim.remove();
  
      // Remove claim from user's claim history
      await User.updateOne(
        { _id: claim.claimDetails.userId },
        { $pull: { 'claimHistory.claims': { claimId: id } } }
      );
  
      logger.info(`Claim ${id} deleted by ${req.user.id} with ${claim.evidence.files.length} files removed from Cloudinary`);
      res.json({ success: true, message: 'Claim and associated files deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

// @desc    Get claim analytics (Admin only)
// @route   GET /api/claims/analytics
// @access  Private (Admin)
export const getClaimAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const totalClaims = await Claim.countDocuments();
    const statusBreakdown = await Claim.aggregate([
      { $unwind: '$statusHistory.history' },
      { $group: { _id: '$statusHistory.history.status', count: { $sum: 1 } } }
    ]);
    const avgPayout = await Claim.aggregate([
      { $match: { 'evaluation.payoutAmount': { $gt: 0 } } },
      { $group: { _id: null, avgPayout: { $avg: '$evaluation.payoutAmount' } } }
    ]);

    res.json({
      success: true,
      analytics: {
        totalClaims,
        statusBreakdown,
        averagePayout: avgPayout[0]?.avgPayout || 0
      }
    });
  } catch (error) {
    next(error);
  }
};