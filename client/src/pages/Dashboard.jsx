import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import api from '../API/api';
import toast from 'react-hot-toast';
import { TrendingUp, TrendingDown, PiggyBank, ArrowUpRight } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses');
        setExpenses(res.data.payload);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  if (loading) return <div className="p-6 flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  let totalIncome = 0;
  let totalExpense = 0;
  const expenseByCategory = {};

  expenses.forEach(t => {
      if (t.type === 'INCOME') totalIncome += t.amount;
      else {
          totalExpense += t.amount;
          expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      }
  });

  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [{
        data: [totalIncome, totalExpense],
        backgroundColor: ['#10B981', '#F43F5E'],
        hoverBackgroundColor: ['#059669', '#E11D48'],
        borderWidth: 0,
        hoverOffset: 4
    }],
  };
  
  const barData = {
    labels: Object.keys(expenseByCategory),
    datasets: [{
        label: 'Expenses by Category',
        data: Object.values(expenseByCategory),
        backgroundColor: '#6366F1',
        borderRadius: 6,
    }]
  };

  const Card = ({ title, amount, icon: Icon, colorClass, gradientClass }) => (
    <div className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${gradientClass}`}></div>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 font-medium text-sm tracking-wide uppercase">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">₹{amount.toLocaleString('en-IN')}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-slate-500 font-medium">
            <ArrowUpRight size={16} className="mr-1" /> Updated Just Now
        </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Overview</h1>
            <p className="text-slate-500 mt-1">Track and manage your expenses effortlessly.</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Income" amount={totalIncome} icon={TrendingUp} colorClass="bg-emerald-100 text-emerald-600" gradientClass="bg-emerald-400" />
        <Card title="Total Expense" amount={totalExpense} icon={TrendingDown} colorClass="bg-rose-100 text-rose-600" gradientClass="bg-rose-400" />
        <Card title="Net Savings" amount={totalIncome - totalExpense} icon={PiggyBank} colorClass="bg-indigo-100 text-indigo-600" gradientClass="bg-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></span>
            Income vs Expense
          </h2>
          <div className="h-[300px] flex justify-center">
            {totalIncome === 0 && totalExpense === 0 ? (
                <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                    <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </div>
            ) : <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }} />}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
            Expenses Breakdown
          </h2>
          <div className="h-[300px] w-full">
            {Object.keys(expenseByCategory).length === 0 ? (
                 <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                    <p>No data available</p>
                </div>
            ) : <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { borderDash: [4, 4] } }, x: { grid: { display: false } } } }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
