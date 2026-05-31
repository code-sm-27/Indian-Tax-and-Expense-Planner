import { User } from '../Models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    
    // Remove password from payload
    const { password, ...payload } = newUser.toObject();
    return payload;
};

export const loginUser = async (credentials) => {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    const { password, ...payload } = user.toObject();
    return { token, user: payload };
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
