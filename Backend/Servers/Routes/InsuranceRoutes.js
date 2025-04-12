// routes/insurance.js
import express from 'express';
import { applyForInsurance, surrenderInsurance, getInsuranceStatus, addPlatformToInsurance } from '../Controllers/InsuranceController.js';
import authMiddleware from '../Middlewares/Authenticator.js';

const insuranceRouter = express.Router();

insuranceRouter.post('/apply', authMiddleware, applyForInsurance);
insuranceRouter.post('/surrender', authMiddleware, surrenderInsurance);
insuranceRouter.get('/status', authMiddleware, getInsuranceStatus);
insuranceRouter.post('/add-platform', authMiddleware, addPlatformToInsurance); // Assuming this is the correct route for adding a platform

export default insuranceRouter;