import Tesseract from 'tesseract.js';

export const extractSalaryDetails = async (imageBuffer) => {
    try {
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        
        let basicPay = 0;
        let hra = 0;
        let pfDeduction = 0;
        let netSalary = 0;

        const lines = text.split('\n');
        lines.forEach(line => {
            const upperLine = line.toUpperCase();
            const matchAmount = line.match(/\d+[,.]\d+|\d+/);
            const amount = matchAmount ? parseFloat(matchAmount[0].replace(/,/g, '')) : 0;

            if (upperLine.includes('BASIC PAY') || upperLine.includes('BASIC')) {
                basicPay = Math.max(basicPay, amount);
            } else if (upperLine.includes('HRA') || upperLine.includes('HOUSE RENT ALLOWANCE')) {
                hra = Math.max(hra, amount);
            } else if (upperLine.includes('PF') || upperLine.includes('PROVIDENT FUND DEDUCTION')) {
                pfDeduction = Math.max(pfDeduction, amount);
            } else if (upperLine.includes('NET PAY') || upperLine.includes('NET SALARY')) {
                netSalary = Math.max(netSalary, amount);
            }
        });

        return { basicPay, hra, pfDeduction, netSalary, rawText: text };
    } catch (error) {
        throw new Error("Failed to process image OCR: " + error.message);
    }
};
