// Premium calculation and payment routes
// routes/premiums.js
import express from 'express';
import {
  calculatePremium,
  getMyPremium,
  payPremium,
  updatePremiumDiscount,
  getAllPremiums,
  getOverduePremiums,
  adjustPremium,
  getPremiumAnalytics,
  retryPayment
} from '../Controllers/PremiumController.js';
import authMiddleware from '../Middlewares/Authenticator.js';

const premiumRouter = express.Router();

// Creator Routes (Private)
premiumRouter.post('/calculate', authMiddleware, calculatePremium);
premiumRouter.get('/my-premium', authMiddleware, getMyPremium);
premiumRouter.post('/pay', authMiddleware, payPremium);
premiumRouter.put('/discount', authMiddleware, updatePremiumDiscount);
premiumRouter.post('/retry-payment', authMiddleware, retryPayment);

// Admin Routes (Private)
premiumRouter.get('/all', authMiddleware, getAllPremiums);
premiumRouter.get('/overdue', authMiddleware, getOverduePremiums);
premiumRouter.put('/:id/adjust', authMiddleware, adjustPremium);
premiumRouter.get('/analytics', authMiddleware, getPremiumAnalytics);

export default premiumRouter;