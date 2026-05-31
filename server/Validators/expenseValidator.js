import { z } from 'zod';

export const expenseSchema = z.object({
    body: z.object({
        type: z.enum(["INCOME", "EXPENSE"]),
        amount: z.number().min(1, "Amount must be at least ₹1"),
        category: z.string().min(1, "Category is required"),
        notes: z.string().max(300).optional()
    })
});
