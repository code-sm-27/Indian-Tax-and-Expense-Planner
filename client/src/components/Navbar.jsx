import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../API/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, ReceiptIndianRupee, Calculator, LogOut, LogIn, WalletCards } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${isActive ? 'bg-indigo-600/10 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Icon size={18} className={isActive ? "text-indigo-600" : "text-slate-500"} />
            <span>{label}</span>
        </Link>
    );
  };

  return (
    <div className="sticky top-4 z-50 px-4">
      <nav className="glass max-w-6xl mx-auto rounded-2xl px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-1 rounded-xl shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 tracking-tight">
                Tax & Expense
            </span>
        </Link>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/add-expense" icon={ReceiptIndianRupee} label="Expenses" />
              <NavItem to="/tax-planner" icon={Calculator} label="Tax Planner" />
              
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              
              <button onClick={handleLogout} className="flex items-center space-x-2 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium ml-2">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/auth" className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 hover:shadow-lg transition-all duration-300 shadow-md hover:-translate-y-0.5">
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
