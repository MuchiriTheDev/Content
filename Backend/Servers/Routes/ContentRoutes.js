// Content review routes
// routes/content.js
import express from 'express';
import {
  submitContent,
  getMyContent,
  getContentById,
  assessContentRisk,
  reviewContentManual,
  updateContent,
  deleteContent,
  getAllContent,
  getContentAnalytics,
  getPendingContent,
  uploadContentFiles
} from '../Controllers/ContentController.js';
import authMiddleware from '../Middlewares/Authenticator.js';

const contentRouter = express.Router();

// Creator Routes (Private)
contentRouter.post('/submit', authMiddleware, uploadContentFiles, submitContent);
contentRouter.get('/my-content', authMiddleware, getMyContent);
contentRouter.get('/:id', authMiddleware, getContentById);
contentRouter.put('/:id', authMiddleware, uploadContentFiles, updateContent);
contentRouter.delete('/:id', authMiddleware, deleteContent);

// Admin Routes (Private)
contentRouter.post('/:id/assess', authMiddleware, assessContentRisk);
contentRouter.post('/:id/review', authMiddleware, reviewContentManual);
contentRouter.get('/all', authMiddleware, getAllContent);
contentRouter.get('/analytics', authMiddleware, getContentAnalytics);
contentRouter.get('/pending', authMiddleware, getPendingContent);

export default contentRouter;