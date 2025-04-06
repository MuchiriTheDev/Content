// Claims routes (submit, track, process)
// routes/claims.js
import express from 'express';
import { 
    deleteClaim, evaluateClaimAI, 
    getAllClaims, getClaimAnalytics, 
    getClaimById, getMyClaims, getPendingDeadlineClaims, 
    markClaimPaid, reviewClaimManual, submitClaim, 
    updateClaimEvidence, uploadClaimFiles 
} from '../Controllers/ClaimsController.js';
import  authMiddleware from '../Middlewares/Authenticator.js';


const claimsRouter = express.Router();

// Creator Routes (Private)
claimsRouter.post('/submit', authMiddleware, uploadClaimFiles, submitClaim);
claimsRouter.get('/my-claims', authMiddleware, getMyClaims);
claimsRouter.get('/:id', authMiddleware, getClaimById);
claimsRouter.put('/:id/evidence', authMiddleware, uploadClaimFiles, updateClaimEvidence);
claimsRouter.delete('/:id', authMiddleware, deleteClaim);

// Admin Routes (Private)
claimsRouter.post('/:id/evaluate-ai', authMiddleware, evaluateClaimAI);
claimsRouter.post('/:id/review-manual', authMiddleware, reviewClaimManual);
claimsRouter.post('/:id/paid', authMiddleware, markClaimPaid);
claimsRouter.get('/all', authMiddleware, getAllClaims);
claimsRouter.get('/pending-deadline', authMiddleware, getPendingDeadlineClaims);
claimsRouter.get('/analytics', authMiddleware, getClaimAnalytics);

export default claimsRouter;