import { Schema, model } from 'mongoose'; 

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is Required"],
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true, 
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    
    age: {
        type: Number,
        required: [true, "Age is required to calculate accurate tax slabs"],
        min: [18, "Must be at least 18 years old to use the planner"]
    },
    preferredRegime: {
        type: String,
        enum: {
            values: ["OLD", "NEW"],
            message: "{VALUE} is an Invalid Tax Regime. Choose OLD or NEW."
        },
        default: "NEW" 
    },

    profileImageUrl: {
        type: String
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"], 
        default: "USER"
    },
    isActive: {
        type: Boolean,
        default: true,
    }
},
{
    timestamps: true,
    strict: "throw", 
    versionKey: false
});

export const User = model("user", userSchema);