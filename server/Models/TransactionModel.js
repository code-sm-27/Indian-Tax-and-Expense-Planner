import { Schema, model } from 'mongoose';

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    type: {
        type: String,
        enum: {
            values: ["INCOME", "EXPENSE"],
            message: "{VALUE} is an invalid transaction type."
        },
        required: [true, "Transaction type is required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be at least ₹1"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true
       
    },
    date: {
        type: Date,
        default: Date.now, 
        required: true
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [200, "Notes cannot exceed 200 characters"]
    }
},
{
    timestamps: true,
    strict: "throw",
    versionKey: false
});

transactionSchema.index({ userId: 1, date: -1 });

export const Transaction = model("transaction", transactionSchema);