import express from 'express';
import { addTransaction, getTransactionsByMonth, deleteTransaction } from '../services/transactionService.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const transactionRoute = express.Router();

transactionRoute.use(verifyToken); 


transactionRoute.post('/', async (req, res, next) => {
    try {
        // Combine the user ID from the token with the data from the frontend
        const transactionData = { ...req.body, userId: req.user.id };
        const newTransaction = await addTransaction(transactionData);
        
        res.status(201).send({ message: "Transaction added", payload: newTransaction });
    } catch (err) {
        next(err);
    }
});

transactionRoute.get('/summary/:year/:month', async (req, res, next) => {
    try {
        const { year, month } = req.params;
        const summary = await getTransactionsByMonth(req.user.id, year, month);
        
        res.status(200).send({ message: "Monthly summary fetched", payload: summary });
    } catch (err) {
        next(err);
    }
});

transactionRoute.delete('/:id', async (req, res, next) => {
    try {
        await deleteTransaction(req.user.id, req.params.id);
        res.status(200).send({ message: "Transaction deleted successfully" });
    } catch (err) {
        next(err);
    }
});

export default transactionRoute;