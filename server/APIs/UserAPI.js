import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../Services/authService.js';
import { verifyToken } from '../Middlewares/verifyToken.js';

const userRoute = express.Router();

userRoute.post('/register', async (req, res, next) => {
    try {
        const newUser = await registerUser(req.body);
        res.status(201).send({ message: "User registered successfully", payload: newUser });
    } catch (err) {
        next(err); 
    }
});

userRoute.post('/login', async (req, res, next) => {
    try {
        const { token, user } = await loginUser(req.body);
        res.status(200).send({ message: "Login successful", token, payload: user });
    } catch (err) {
        next(err);
    }
});

userRoute.get('/profile', verifyToken, async (req, res, next) => {
    try {
        const profile = await getUserProfile(req.user.id); 
        res.status(200).send({ message: "Profile fetched", payload: profile });
    } catch (err) {
        next(err);
    }
});

export default userRoute;