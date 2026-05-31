import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../API/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', age: '' });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
        login(res.data.payload);
        toast.success('Logged in successfully!');
        navigate('/');
      } else {
        const payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            age: parseInt(formData.age, 10)
        };
        const res = await api.post('/auth/register', payload);
        toast.success('Registration successful. Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" min="18" required />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" minLength="6" required />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition font-medium shadow-sm">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
