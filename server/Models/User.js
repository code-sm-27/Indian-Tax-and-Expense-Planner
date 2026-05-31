import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    age: { type: Number, required: true, min: [18, "Must be at least 18"] },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

export const User = model('User', userSchema);
