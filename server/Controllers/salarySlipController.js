import { SalarySlip } from '../Models/SalarySlip.js';
import { extractSalaryDetails } from '../Services/ocrService.js';

export const analyzeAndSaveSalarySlip = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const extractedData = await extractSalaryDetails(req.file.buffer);
        
        const salarySlip = new SalarySlip({
            userId: req.user.id,
            month: req.body.month || new Date().toLocaleString('default', { month: 'long' }),
            year: req.body.year || new Date().getFullYear(),
            ...extractedData
        });

        await salarySlip.save();

        res.status(201).json({ success: true, message: "Salary slip analyzed and saved", payload: salarySlip });
    } catch (err) {
        next(err);
    }
};

export const getSalarySlips = async (req, res, next) => {
    try {
        const slips = await SalarySlip.find({ userId: req.user.id }).sort({ year: -1, month: -1 });
        res.status(200).json({ success: true, payload: slips });
    } catch (err) {
        next(err);
    }
};
