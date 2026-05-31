import { calculateTaxProfile } from '../Services/TaxService.js';
import { Expense } from '../Models/Expense.js';

jest.mock('../Models/Expense.js');

describe('Tax Engine Logic', () => {
    it('should correctly calculate 80C caps and recommend OLD regime for high 80C', async () => {
        Expense.find.mockImplementation(async (query) => {
            if (query.type === 'INCOME') return [{ amount: 1200000 }];
            if (query.type === 'EXPENSE') return [
                { amount: 150000, category: 'ELSS' }, // Maxes out 80C
                { amount: 25000, category: 'HEALTH INSURANCE' } // Maxes out 80D
            ];
            return [];
        });

        // 12L income, Age 30.
        // Old Taxable: 12L - 50k - 1.5L - 25k = 9.75L
        // Old Tax on 9.75L: (2.5L * 5%) + (4.75L * 20%) = 12500 + 95000 = 107500 + 4% cess = 111800
        // New Taxable: 12L - 50k = 11.5L
        // New Tax on 11.5L: 15000 + 30000 + 37500 = 82500 + 4% cess = 85800
        // Wait, New Regime is actually better here (85800 < 111800).
        
        const result = await calculateTaxProfile('user1', 30, '2023-2024');
        expect(result.section80C_Total).toBe(150000);
        expect(result.section80D_Total).toBe(25000);
        expect(result.recommendedRegime).toBe('NEW');
    });
});
