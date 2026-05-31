import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../Models/User.js';

export const registerUser = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        
        const { password, ...payload } = newUser.toObject();
        res.status(201).json({ success: true, message: "User registered successfully", payload });
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'testsecret',
            { expiresIn: '7d' }
        );

        const { password, ...payload } = user.toObject();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ success: true, message: "Login successful", payload });
    } catch (err) {
        next(err);
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
};
