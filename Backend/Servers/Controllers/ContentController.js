// Content review and risk analysis logic
// controllers/contentController.js
import Content from '../Models/Content.js';
import User from '../Models/User.js';
import logger from '../Utilities/Logger.js';
import { sendEmail } from '../Services/EmailServices.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../Utilities/Cloudinary.js';
import upload from '../Utilities/Multer.js';
import fs from 'fs/promises';

// Middleware for file uploads (up to 3 files)
export const uploadContentFiles = upload.array('mediaFiles', 3);

// @desc    Submit content for review
// @route   POST /api/content/submit
// @access  Private (Creator)
export const submitContent = async (req, res, next) => {
  try {
    const { platform, contentType, title, description, url, uploadDate } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!platform || !contentType || !title || !url || !uploadDate) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'Creator') {
      return res.status(403).json({ success: false, error: 'Unauthorized or user not found' });
    }

    // Upload files to Cloudinary if provided
    let mediaFiles = [];
    if (req.files?.length) {
      mediaFiles = await Promise.all(
        req.files.map(async (file) => {
          const { url } = await uploadToCloudinary(file);
          await fs.unlink(file.path); // Delete temp file
          return {
            url,
            type: file.mimetype.startsWith('image') ? 'Image' : file.mimetype === 'video/mp4' ? 'Video' : 'Document',
            description: req.body[`description_${file.fieldname}`] || ''
          };
        })
      );
    }

    // Create content
    const content = new Content({
      contentDetails: { userId, platform, contentType, title, description, url, uploadDate, mediaFiles }
    });

    await content.save();

    // Notify user
    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Content Submitted for Review - CCI',
      text: `Your content "${title}" has been submitted for review. We'll notify you of the results by ${content.reviewDeadline}.`
    });

    logger.info(`Content submitted by ${userId}: ${content._id}`);
    res.status(201).json({ success: true, contentId: content._id, message: 'Content submitted for review' });
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map(file => fs.unlink(file.path).catch(() => {})));
    }
    next(error);
  }
};

// @desc    Get all content for the current user
// @route   GET /api/content/my-content
// @access  Private (Creator)
export const getMyContent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const content = await Content.find({ 'contentDetails.userId': userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single content by ID
// @route   GET /api/content/:id
// @access  Private (Creator/Admin)
export const getContentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    if (req.user.role !== 'Admin' && content.contentDetails.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
};

// @desc    Assess content risk with AI
// @route   POST /api/content/:id/assess
// @access  Private (Admin)
// controllers/contentController.js
export const assessContentRisk = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    // Gemini API call
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{
          parts: [{
            text: `Analyze this content for platform guideline violations:\nTitle: ${content.contentDetails.title}\nDescription: ${content.contentDetails.description}\nURL: ${content.contentDetails.url}\nPlatform: ${content.contentDetails.platform}`
          }]
        }]
      },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );

    const analysis = response.data.candidates[0].content.parts[0].text;
    const riskLevel = analysis.includes('violation') ? 'High' : analysis.includes('potential') ? 'Medium' : 'Low';
    const recommendations = analysis.match(/recommendation: (.*)/gi)?.map(r => r.split(': ')[1]) || [];

    content.riskAssessment = {
      riskLevel,
      confidenceScore: Math.min(95, Math.floor(Math.random() * 100)), // Simulated
      potentialViolations: analysis.includes('violation') ? [{ type: 'Guideline', description: analysis, severity: riskLevel === 'High' ? 'Severe' : 'Moderate' }] : [],
      lastAssessed: new Date(),
      recommendations
    };
    await content.updateReviewStatus('Reviewed', 'AI', null, analysis);

    const user = await User.findById(content.contentDetails.userId);
    await sendEmail({
      to: user.personalInfo.email,
      subject: 'Content Review Completed - CCI',
      text: `Your content "${content.contentDetails.title}" has been reviewed. Risk: ${riskLevel}. Recommendations: ${recommendations.join(', ')}.`
    });

    logger.info(`Content ${id} assessed by Gemini: ${riskLevel}`);
    res.json({ success: true, message: 'Content risk assessed', riskAssessment: content.riskAssessment });
  } catch (error) {
    next(error);
  }
};
// @desc    Manually review content
// @route   POST /api/content/:id/review
// @access  Private (Admin)
export const reviewContentManual = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, riskLevel, recommendations } = req.body;

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    if (!status) {
      return res.status(400).json({ success: false, error: 'Review status is required' });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    // Update review and risk assessment
    await content.updateReviewStatus(status, 'Manual', req.user.id, notes);
    if (riskLevel || recommendations) {
      content.riskAssessment.riskLevel = riskLevel || content.riskAssessment.riskLevel;
      content.riskAssessment.recommendations = recommendations || content.riskAssessment.recommendations;
      content.riskAssessment.lastAssessed = new Date();
    }

    await content.save();

    const user = await User.findById(content.contentDetails.userId);
    await sendEmail({
      to: user.personalInfo.email,
      subject: `Content ${status} - CCI`,
      text: `Your content "${content.contentDetails.title}" has been ${status.toLowerCase()}. Notes: ${notes || 'None'}. Risk Level: ${content.riskAssessment.riskLevel}.`
    });

    logger.info(`Content ${id} manually reviewed: ${status}`);
    res.json({ success: true, message: `Content ${status.toLowerCase()}`, content });
  } catch (error) {
    next(error);
  }
};

// @desc    Update content details (before review)
// @route   PUT /api/content/:id
// @access  Private (Creator)
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    if (content.contentDetails.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    if (content.reviewHistory.reviews[content.reviewHistory.reviews.length - 1].status !== 'Pending') {
      return res.status(400).json({ success: false, error: 'Cannot update content after review started' });
    }

    // Update fields if provided
    if (title) content.contentDetails.title = title;
    if (description) content.contentDetails.description = description;
    if (url) content.contentDetails.url = url;

    // Handle new file uploads
    if (req.files?.length) {
      const newFiles = await Promise.all(
        req.files.map(async (file) => {
          const { url } = await uploadToCloudinary(file);
          await fs.unlink(file.path);
          return {
            url,
            type: file.mimetype.startsWith('image') ? 'Image' : file.mimetype === 'video/mp4' ? 'Video' : 'Document',
            description: req.body[`description_${file.fieldname}`] || ''
          };
        })
      );
      content.contentDetails.mediaFiles = [...content.contentDetails.mediaFiles, ...newFiles];
    }

    await content.save();

    logger.info(`Content ${id} updated by ${req.user.id}`);
    res.json({ success: true, message: 'Content updated successfully', content: content.contentDetails });
  } catch (error) {
    if (req.files) {
      await Promise.all(req.files.map(file => fs.unlink(file.path).catch(() => {})));
    }
    next(error);
  }
};

// @desc    Delete content (before review)
// @route   DELETE /api/content/:id
// @access  Private (Creator)
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }

    if (content.contentDetails.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    if (content.reviewHistory.reviews[content.reviewHistory.reviews.length - 1].status !== 'Pending') {
      return res.status(400).json({ success: false, error: 'Cannot delete content after review started' });
    }

    // Delete associated Cloudinary files
    if (content.contentDetails.mediaFiles.length > 0) {
      const deletePromises = content.contentDetails.mediaFiles.map(async (file) => {
        const publicId = file.url.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`cci/claims/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    await content.deleteOne();

    logger.info(`Content ${id} deleted by ${req.user.id}`);
    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all content (Admin only)
// @route   GET /api/content/all
// @access  Private (Admin)
export const getAllContent = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const { status, platform, riskLevel, startDate, endDate } = req.query;
    const query = {};

    if (status) query['reviewHistory.reviews.status'] = status;
    if (platform) query['contentDetails.platform'] = platform;
    if (riskLevel) query['riskAssessment.riskLevel'] = riskLevel;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const content = await Content.find(query).sort({ createdAt: -1 });
    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
};

// @desc    Get content analytics (Admin only)
// @route   GET /api/content/analytics
// @access  Private (Admin)
export const getContentAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const totalContent = await Content.countDocuments();
    const statusBreakdown = await Content.aggregate([
      { $unwind: '$reviewHistory.reviews' },
      { $group: { _id: '$reviewHistory.reviews.status', count: { $sum: 1 } } }
    ]);
    const riskBreakdown = await Content.aggregate([
      { $group: { _id: '$riskAssessment.riskLevel', count: { $sum: 1 } } }
    ]);
    const avgRiskScore = await Content.aggregate([
      { $match: { 'riskAssessment.confidenceScore': { $exists: true } } },
      { $group: { _id: null, avgScore: { $avg: '$riskAssessment.confidenceScore' } } }
    ]);

    res.json({
      success: true,
      analytics: {
        totalContent,
        statusBreakdown,
        riskBreakdown,
        averageRiskScore: avgRiskScore[0]?.avgScore || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get content pending review (Admin only)
// @route   GET /api/content/pending
// @access  Private (Admin)
export const getPendingContent = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    const content = await Content.find({
      'reviewHistory.reviews': { $elemMatch: { status: 'Pending' } }
    }).sort({ reviewDeadline: 1 });

    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
};