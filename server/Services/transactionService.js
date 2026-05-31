import { Transaction } from '../Models/TransactionModel.js';

export const addTransaction = async (transactionData) => {
    const newTransaction = new Transaction(transactionData);
    await newTransaction.save();
    return newTransaction;
};

export const getTransactionsByMonth = async (userId, year, month) => {
    // month is 1-indexed (1-12)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
        userId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ date: -1 });

    const summary = transactions.reduce((acc, curr) => {
        if (curr.type === 'INCOME') {
            acc.totalIncome += curr.amount;
        } else {
            acc.totalExpense += curr.amount;
        }
        return acc;
    }, { totalIncome: 0, totalExpense: 0, transactions });

    return summary;
};

export const deleteTransaction = async (userId, transactionId) => {
    const transaction = await Transaction.findOneAndDelete({ _id: transactionId, userId });
    if (!transaction) {
        throw new Error("Transaction not found or unauthorized");
    }
    return transaction;
};
