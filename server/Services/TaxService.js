import { Expense } from '../Models/Expense.js';

export const calculateTaxProfile = async (userId, userAge, financialYear) => {
    // 80C Limit is 1,50,000
    // 80D Limit is 25,000 (if age < 60), 50,000 (if age >= 60)
    
    // For this example, let's assume we map specific expense categories to these sections
    const expenses = await Expense.find({ userId, type: 'EXPENSE' });
    
    let total80C = 0;
    let total80D = 0;
    let totalIncome = 0;
    
    const incomes = await Expense.find({ userId, type: 'INCOME' });
    incomes.forEach(i => totalIncome += i.amount);

    expenses.forEach(exp => {
        const cat = exp.category.toUpperCase();
        if (['ELSS', 'PPF', 'LIC', 'EPF', 'HOME LOAN PRINCIPAL'].includes(cat)) {
            total80C += exp.amount;
        } else if (['HEALTH INSURANCE', 'PREVENTIVE HEALTH CHECKUP'].includes(cat)) {
            total80D += exp.amount;
        }
    });

    const capped80C = Math.min(total80C, 150000);
    const max80D = userAge >= 60 ? 50000 : 25000;
    const capped80D = Math.min(total80D, max80D);

    const standardDeduction = 50000;
    
    // Old Regime Math
    let oldTaxable = totalIncome - standardDeduction - capped80C - capped80D;
    oldTaxable = Math.max(0, oldTaxable);
    
    const oldExemption = userAge >= 60 ? 300000 : 250000;
    let oldTax = 0;
    if (oldTaxable > oldExemption) {
        if (oldTaxable <= 500000) oldTax = 0; // Rebate 87A covers up to 5L
        else {
            let slab1 = Math.min(oldTaxable, 500000) - oldExemption;
            if (slab1 > 0) oldTax += slab1 * 0.05;
            
            let slab2 = Math.min(oldTaxable, 1000000) - 500000;
            if (slab2 > 0) oldTax += slab2 * 0.20;
            
            let slab3 = oldTaxable - 1000000;
            if (slab3 > 0) oldTax += slab3 * 0.30;
            
            oldTax += oldTax * 0.04; // Cess
        }
    }

    // New Regime Math
    let newTaxable = totalIncome - standardDeduction;
    newTaxable = Math.max(0, newTaxable);
    
    let newTax = 0;
    if (newTaxable > 700000) { // Rebate 87A up to 7L
        if (newTaxable > 300000) newTax += (Math.min(newTaxable, 600000) - 300000) * 0.05;
        if (newTaxable > 600000) newTax += (Math.min(newTaxable, 900000) - 600000) * 0.10;
        if (newTaxable > 900000) newTax += (Math.min(newTaxable, 1200000) - 900000) * 0.15;
        if (newTaxable > 1200000) newTax += (Math.min(newTaxable, 1500000) - 1200000) * 0.20;
        if (newTaxable > 1500000) newTax += (newTaxable - 1500000) * 0.30;
        
        newTax += newTax * 0.04; // Cess
    }

    const recommendedRegime = oldTax < newTax ? "OLD" : "NEW";

    return {
        financialYear,
        totalIncome,
        section80C_Total: total80C,
        section80D_Total: total80D,
        oldRegimeLiability: Math.round(oldTax),
        newRegimeLiability: Math.round(newTax),
        recommendedRegime
    };
};
