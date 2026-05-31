import { Schema, model } from 'mongoose';

const salarySlipSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    basicPay: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    pfDeduction: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    rawOcrText: { type: String }, // To store full text for auditing
}, {
    timestamps: true,
    versionKey: false
});

salarySlipSchema.index({ userId: 1, year: 1, month: 1 });

export const SalarySlip = model('SalarySlip', salarySlipSchema);
