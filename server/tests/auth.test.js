import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import authRoutes from '../Routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

// Mocking User model so we don't hit the real DB during simple unit testing
jest.mock('../Models/User.js');
import { User } from '../Models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Auth API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should validate missing fields', async () => {
            const res = await request(app).post('/api/auth/register').send({
                email: 'invalidemail'
            });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Invalid email format/i);
        });

        it('should return 409 if user exists', async () => {
            User.findOne.mockResolvedValueOnce({ email: 'test@test.com' });
            const res = await request(app).post('/api/auth/register').send({
                email: 'test@test.com',
                password: 'password123',
                firstName: 'Test',
                age: 25
            });
            expect(res.status).toBe(409);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully and set HTTP-only cookie', async () => {
            User.findOne.mockResolvedValueOnce({ 
                _id: 'userid123', 
                email: 'test@test.com', 
                password: 'hashedpassword',
                role: 'USER',
                toObject: () => ({ email: 'test@test.com' })
            });

            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
            jest.spyOn(jwt, 'sign').mockReturnValueOnce('mocked_token');

            const res = await request(app).post('/api/auth/login').send({
                email: 'test@test.com',
                password: 'password123'
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.headers['set-cookie'][0]).toMatch(/token=mocked_token;/);
            expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/);
        });
    });
});
