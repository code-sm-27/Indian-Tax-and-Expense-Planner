import { Expense } from '../Models/Expense.js';

export const addExpense = async (req, res, next) => {
    try {
        const expense = new Expense({
            ...req.body,
            userId: req.user.id
        });
        await expense.save();
        res.status(201).json({ success: true, payload: expense });
    } catch (err) {
        next(err);
    }
};

export const getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, payload: expenses });
    } catch (err) {
        next(err);
    }
};

export const updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
        res.status(200).json({ success: true, payload: expense });
    } catch (err) {
        next(err);
    }
};

export const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        next(err);
    }
};
