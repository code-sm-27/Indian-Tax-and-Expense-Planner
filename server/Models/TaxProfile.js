import { Schema, model } from 'mongoose';

const taxProfileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    financialYear: { type: String, required: true },
    totalIncome: { type: Number, default: 0 },
    section80C_Total: { type: Number, default: 0 },
    section80D_Total: { type: Number, default: 0 },
    recommendedRegime: { type: String, enum: ["OLD", "NEW", "PENDING"], default: "PENDING" },
    oldRegimeLiability: { type: Number, default: 0 },
    newRegimeLiability: { type: Number, default: 0 },
}, {
    timestamps: true,
    versionKey: false
});

taxProfileSchema.index({ userId: 1, financialYear: 1 }, { unique: true });

export const TaxProfile = model('TaxProfile', taxProfileSchema);
