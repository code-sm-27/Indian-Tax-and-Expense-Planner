import express from 'express';
import { analyzeAndSaveSalarySlip, getSalarySlips } from '../Controllers/salarySlipController.js';
import { upload } from '../Middlewares/uploadMiddleware.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/upload', upload.single('salarySlip'), analyzeAndSaveSalarySlip);
router.get('/', getSalarySlips);

export default router;
