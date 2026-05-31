import { Transaction } from '../Models/TransactionModel.js';
import { Investment } from '../Models/InvestmentModel.js';
import { User } from '../Models/UserModel.js';


const calculateOldRegimeTax = (taxableIncome, age) => {

    const exemptionLimit = age >= 60 ? 300000 : 250000;
    
    if (taxableIncome <= 500000) return 0;

    let tax = 0;
    if (taxableIncome > exemptionLimit) {
        let slab1 = Math.min(taxableIncome, 500000) - exemptionLimit;
        if (slab1 > 0) tax += slab1 * 0.05;
    }
    if (taxableIncome > 500000) {
        let slab2 = Math.min(taxableIncome, 1000000) - 500000;
        tax += slab2 * 0.20;
    }
    if (taxableIncome > 1000000) {
        let slab3 = taxableIncome - 1000000;
        tax += slab3 * 0.30;
    }

    return tax + (tax * 0.04);
};

const calculateNewRegimeTax = (taxableIncome) => {
    if (taxableIncome <= 700000) return 0;

    let tax = 0;
    if (taxableIncome > 300000) tax += (Math.min(taxableIncome, 600000) - 300000) * 0.05;
    if (taxableIncome > 600000) tax += (Math.min(taxableIncome, 900000) - 600000) * 0.10;
    if (taxableIncome > 900000) tax += (Math.min(taxableIncome, 1200000) - 900000) * 0.15;
    if (taxableIncome > 1200000) tax += (Math.min(taxableIncome, 1500000) - 1200000) * 0.20;
    if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;

    return tax + (tax * 0.04);
};


export const compareTaxRegimes = async (userId, financialYear) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const incomeRecords = await Transaction.find({ userId, type: 'INCOME' });
    const grossIncome = incomeRecords.reduce((acc, curr) => acc + curr.amount, 0);

    const investments = await Investment.find({ userId, financialYear });
    
    let total80C = 0;
    let total80D = 0;

    investments.forEach(inv => {
        if (inv.section === '80C') total80C += inv.amountInvested;
        if (inv.section === '80D') total80D += inv.amountInvested;
    });

    const capped80C = Math.min(total80C, 150000);

    const capped80D = Math.min(total80D, user.age >= 60 ? 50000 : 25000); 

    const standardDeduction = 50000;

    let oldTaxableIncome = grossIncome - standardDeduction - capped80C - capped80D;
    oldTaxableIncome = Math.max(0, oldTaxableIncome); 

    
    let newTaxableIncome = grossIncome - standardDeduction;
    newTaxableIncome = Math.max(0, newTaxableIncome);

    
    const oldTax = calculateOldRegimeTax(oldTaxableIncome, user.age);
    const newTax = calculateNewRegimeTax(newTaxableIncome);

    
    const recommendation = oldTax < newTax ? "OLD" : newTax < oldTax ? "NEW" : "EITHER";
    const savings = Math.abs(oldTax - newTax);

    
    return {
        grossIncome,
        oldRegime: {
            deductionsClaimed: standardDeduction + capped80C + capped80D,
            taxableIncome: oldTaxableIncome,
            taxLiability: Math.round(oldTax)
        },
        newRegime: {
            deductionsClaimed: standardDeduction,
            taxableIncome: newTaxableIncome,
            taxLiability: Math.round(newTax)
        },
        recommendation: {
            bestRegime: recommendation,
            taxSaved: Math.round(savings),
            message: `You should choose the ${recommendation} regime to save ₹${Math.round(savings)} in taxes.`
        }
    };
};