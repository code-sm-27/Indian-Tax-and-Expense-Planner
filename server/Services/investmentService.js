import { Investment } from '../Models/InvestmentModel.js';

export const addInvestment = async (investmentData) => {
    const newInvestment = new Investment(investmentData);
    await newInvestment.save();
    return newInvestment;
};

export const getInvestmentsByYear = async (userId, financialYear) => {
    const investments = await Investment.find({ userId, financialYear }).sort({ createdAt: -1 });
    const summary = investments.reduce((acc, curr) => {
        acc.total += curr.amountInvested;
        return acc;
    }, { total: 0, investments });
    return summary;
};
