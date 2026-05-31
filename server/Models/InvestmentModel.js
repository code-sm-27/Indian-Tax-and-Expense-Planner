import { Schema, model } from 'mongoose';

const investmentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    section: {
        type: String,
        required: [true, "Tax section is required"],
        enum: {
            values: ["80C", "80D", "24b", "80TTA", "80G", "80CCD(1B)"],
            message: "{VALUE} is not a recognized tax section."
        }
    },
    subCategory: {
        type: String,
        required: [true, "Investment type is required"],
        trim: true
    },
    amountInvested: {
        type: Number,
        required: [true, "Investment amount is required"],
        min: [1, "Amount must be greater than zero"]
    },
    financialYear: {
        type: String,
        required: [true, "Financial Year is required"],
        match: [/^\d{4}-\d{4}$/, "Must be in format YYYY-YYYY (e.g., 2025-2026)"]
    },
    proofDocumentUrl: {
        type: String
    }
},
{
    timestamps: true,
    strict: "throw",
    versionKey: false
});

investmentSchema.index({ userId: 1, financialYear: 1 });

export const Investment = model("investment", investmentSchema);