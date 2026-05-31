import { Schema, model } from 'mongoose';

const expenseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    amount: { type: Number, required: true, min: [1, "Amount must be at least ₹1"] },
    category: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now, required: true },
    notes: { type: String, trim: true, maxLength: 300 }
}, {
    timestamps: true,
    versionKey: false
});

expenseSchema.index({ userId: 1, date: -1 });

export const Expense = model('Expense', expenseSchema);
