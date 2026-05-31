import React, { useState, useEffect } from 'react';
import api from '../API/api';
import toast from 'react-hot-toast';
import { IndianRupee, Tag, FileText, SendHorizontal, Edit3, Trash2 } from 'lucide-react';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: 'GROCERIES',
    notes: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const expenseCategories = ['GROCERIES', 'RENT', 'UTILITIES', 'ENTERTAINMENT', 'ELSS', 'PPF', 'LIC', 'EPF', 'HOME LOAN PRINCIPAL', 'HEALTH INSURANCE', 'PREVENTIVE HEALTH CHECKUP', 'OTHER'];
  const incomeCategories = ['SALARY', 'BUSINESS', 'FREELANCE', 'INVESTMENT', 'OTHER'];

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/expenses');
      setTransactions(res.data.payload);
    } catch (err) {
      toast.error('Failed to load history');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      
      if (editingId) {
          await api.put(`/expenses/${editingId}`, payload);
          toast.success('Record updated successfully!');
      } else {
          await api.post('/expenses', payload);
          toast.success('Record logged successfully!');
      }
      
      setFormData({ type: 'EXPENSE', amount: '', category: 'GROCERIES', notes: '' });
      setEditingId(null);
      fetchTransactions(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process record');
    }
  };

  const handleEdit = (txn) => {
      setEditingId(txn._id);
      setFormData({
          type: txn.type,
          amount: txn.amount,
          category: txn.category,
          notes: txn.notes || ''
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
      toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-3xl pointer-events-auto flex flex-col border border-slate-100 p-6`}>
              <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                          <Trash2 className="h-6 w-6 text-rose-500" />
                      </div>
                  </div>
                  <div className="ml-4 flex-1">
                      <p className="text-lg font-bold text-slate-900">Delete Transaction</p>
                      <p className="mt-1 text-sm text-slate-500 font-medium">Are you sure you want to remove this record? This action cannot be undone.</p>
                  </div>
              </div>
              <div className="flex justify-end gap-3">
                  <button onClick={() => toast.dismiss(t.id)} className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                      Cancel
                  </button>
                  <button onClick={() => confirmDelete(id, t.id)} className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-lg hover:shadow-rose-500/30">
                      Delete
                  </button>
              </div>
          </div>
      ), { duration: Infinity });
  };

  const confirmDelete = async (id, toastId) => {
      toast.dismiss(toastId);
      try {
          await api.delete(`/expenses/${id}`);
          toast.success("Transaction deleted");
          fetchTransactions();
      } catch (err) {
          toast.error("Failed to delete");
      }
  };

  const currentCategories = formData.type === 'EXPENSE' ? expenseCategories : incomeCategories;

  return (
    <div className="max-w-6xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Form Section */}
      <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-lg border border-slate-100 h-fit sticky top-24">
        <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{editingId ? 'Edit Transaction' : 'Log Transaction'}</h2>
            <p className="text-slate-500 mt-2">{editingId ? 'Update your previously added record.' : 'Add a new income or expense to your financial records.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Transaction Type</label>
            <div className="relative">
                <select name="type" value={formData.type} onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value, category: e.target.value === 'EXPENSE' ? 'GROCERIES' : 'SALARY' });
                }} className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none text-slate-700 font-medium cursor-pointer shadow-sm">
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Amount</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <IndianRupee size={18} />
                </div>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-800 font-bold shadow-sm placeholder:font-normal placeholder:text-slate-400" placeholder="0.00" required min="1" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex justify-between items-center">
                <span>Category</span>
                <span className="text-xs text-indigo-500 font-medium px-2 py-1 bg-indigo-50 rounded-full">Used for 80C/80D</span>
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Tag size={18} />
                </div>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full pl-11 pr-10 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none text-slate-700 font-medium cursor-pointer shadow-sm">
                  {currentCategories.map(cat => (
                      <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                  ))}
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Additional Notes</label>
            <div className="relative group">
                <div className="absolute top-3 left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <FileText size={18} />
                </div>
                <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Optional details..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-shadow text-slate-700 resize-none shadow-sm placeholder:text-slate-400" rows="2"></textarea>
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]">
            <span>{editingId ? 'Update Transaction' : 'Save Transaction'}</span>
            <SendHorizontal size={20} />
          </button>
          
          {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ type: 'EXPENSE', amount: '', category: 'GROCERIES', notes: '' }); }} className="w-full mt-2 text-slate-500 hover:text-slate-700 font-medium transition-colors">
                  Cancel Edit
              </button>
          )}
        </form>
      </div>

      {/* History List Section */}
      <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">Recent History</h2>
        
        {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
                <p>No transactions found.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {transactions.map(txn => (
                    <div key={txn._id} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-slate-50/50 group">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${txn.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{txn.category.replace(/_/g, ' ')}</p>
                                <p className="text-xs text-slate-500">{new Date(txn.date).toLocaleDateString()} {txn.notes && `• ${txn.notes}`}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <span className={`font-bold text-lg ${txn.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {txn.type === 'INCOME' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                            </span>
                            
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(txn)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => handleDelete(txn._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

    </div>
  );
};

export default AddExpense;
