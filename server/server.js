import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Load env vars
config();

const app = express();

// --- Security & Middlewares ---
app.use(helmet()); // Secure HTTP headers
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// --- Rate Limiting ---
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

import authRoutes from './Routes/authRoutes.js';
import expenseRoutes from './Routes/expenseRoutes.js';
import salarySlipRoutes from './Routes/salarySlipRoutes.js';
import taxRoutes from './Routes/taxRoutes.js';

// --- Routes ---
app.get('/api/health', (req, res) => res.status(200).send({ status: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/salary-slips', salarySlipRoutes);
app.use('/api/tax', taxRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// --- Database Connection ---
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL);
        console.log("✅ MongoDB Connection Successful");
        
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`🚀 Server Started on port ${PORT}`));
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

connectDB();