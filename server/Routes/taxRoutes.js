import express from 'express';
import { getTaxRecommendation } from '../Controllers/taxController.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/recommendation/:year', getTaxRecommendation);

export default router;
