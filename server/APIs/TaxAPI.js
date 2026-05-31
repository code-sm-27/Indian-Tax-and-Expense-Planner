import express from 'express';
import multer from 'multer';
import { addInvestment, getInvestmentsByYear } from '../Services/investmentService.js';
import { compareTaxRegimes } from '../Services/taxEngineService.js';
import { analyzeSalarySlip } from '../Services/ocrService.js';
import { verifyToken } from '../Middlewares/verifyToken.js';

const taxRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


taxRoute.use(verifyToken);

taxRoute.post('/investments', async (req, res, next) => {
    try {
        const investmentData = { ...req.body, userId: req.user.id };
        const newInvestment = await addInvestment(investmentData);
        res.status(201).send({ message: "Investment logged", payload: newInvestment });
    } catch (err) {
        next(err);
    }
});

taxRoute.get('/investments/:financialYear', async (req, res, next) => {
    try {
        const data = await getInvestmentsByYear(req.user.id, req.params.financialYear);
        res.status(200).send({ message: "Investments fetched", payload: data });
    } catch (err) {
        next(err);
    }
});

taxRoute.get('/compare/:financialYear', async (req, res, next) => {
    try {
        const comparisonResult = await compareTaxRegimes(req.user.id, req.params.financialYear);
        res.status(200).send({ message: "Tax computation complete", payload: comparisonResult });
    } catch (err) {
        next(err);
    }
});

taxRoute.post('/analyze-salary-slip', upload.single('salarySlip'), async (req, res, next) => {
    try {
        if (!req.file) throw new Error("No file uploaded");

        const extractedData = await analyzeSalarySlip(req.file.buffer);
        res.status(200).send({ message: "Salary slip analyzed successfully", payload: extractedData });
    } catch (err) {
        next(err);
    }
});

export default taxRoute;
