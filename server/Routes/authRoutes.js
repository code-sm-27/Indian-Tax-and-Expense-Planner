import express from 'express';
import { registerUser, loginUser, logoutUser } from '../Controllers/authController.js';
import { validate } from '../Middlewares/validateMiddleware.js';
import { registerSchema, loginSchema } from '../Validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);

export default router;
