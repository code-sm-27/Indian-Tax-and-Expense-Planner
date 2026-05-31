import express from 'express';
import { addExpense, getExpenses, updateExpense, deleteExpense } from '../Controllers/expenseController.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';
import { validate } from '../Middlewares/validateMiddleware.js';
import { expenseSchema } from '../Validators/expenseValidator.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', validate(expenseSchema), addExpense);
router.get('/', getExpenses);
router.put('/:id', validate(expenseSchema), updateExpense);
router.delete('/:id', deleteExpense);

export default router;
