import React, { useState } from 'react';
import api from '../API/api';
import toast from 'react-hot-toast';
import { UploadCloud, CheckCircle2, Calculator, Sparkles, Receipt, ShieldCheck } from 'lucide-react';

const TaxPlanner = () => {
  const [file, setFile] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [taxProfile, setTaxProfile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first");
    const formData = new FormData();
    formData.append('salarySlip', file);

    try {
      setLoading(true);
      toast.loading('Analyzing Salary Slip via AI...', { id: 'ocr' });
      const res = await api.post('/salary-slips/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOcrData(res.data.payload);
      toast.success('Extraction Complete!', { id: 'ocr' });
    } catch (err) {
      toast.error('Failed to parse slip', { id: 'ocr' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxRecommendation = async () => {
    try {
      toast.loading('Running Tax Engine...', { id: 'tax' });
      const res = await api.get('/tax/recommendation/2023-2024');
      setTaxProfile(res.data.payload);
      toast.success('Tax Profile Calculated!', { id: 'tax' });
    } catch (err) {
      toast.error('Failed to run tax engine', { id: 'tax' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* OCR Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Sparkles size={28} />
            </div>
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Salary Slip Analyzer</h2>
                <p className="text-slate-500 mt-1">Upload your monthly salary slip (PDF/Image). Our OCR engine will extract Basic Pay, HRA, and PF automatically.</p>
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed">
          <label className="flex-1 flex items-center justify-center space-x-2 bg-white px-6 py-4 rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-400 hover:shadow-sm transition-all group w-full text-slate-600 font-medium">
              <UploadCloud size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span>{file ? file.name : 'Choose File or Drag & Drop'}</span>
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
          </label>
          <button onClick={handleUpload} disabled={loading} className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-bold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
            {loading ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div><span>Scanning...</span></>
            ) : (
                <><CheckCircle2 size={20} /><span>Analyze Slip</span></>
            )}
          </button>
        </div>

        {ocrData && (
          <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50/30 p-6 rounded-2xl border border-emerald-100 animate-in zoom-in-95 duration-300">
            <h3 className="font-bold text-emerald-800 mb-4 flex items-center"><Receipt size={18} className="mr-2" /> Extracted Data Verified</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Basic Pay</p>
                  <p className="text-xl font-extrabold text-slate-800">₹{ocrData.basicPay.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">HRA</p>
                  <p className="text-xl font-extrabold text-slate-800">₹{ocrData.hra.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">PF Deduction</p>
                  <p className="text-xl font-extrabold text-slate-800">₹{ocrData.pfDeduction.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Net Salary</p>
                  <p className="text-xl font-extrabold text-slate-800">₹{ocrData.netSalary.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-4 flex items-center"><ShieldCheck size={14} className="mr-1" /> PF Deductions are automatically considered under Section 80C limits.</p>
          </div>
        )}
      </div>

      {/* Tax Engine Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="flex items-start space-x-4 mb-8">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Calculator size={28} />
            </div>
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Tax Engine</h2>
                <p className="text-slate-500 mt-1">Calculates optimal tax regime based on your 80C & 80D investments dynamically.</p>
            </div>
        </div>
        
        <button onClick={fetchTaxRecommendation} className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-lg shadow-slate-900/20 active:scale-[0.99] flex justify-center items-center space-x-2">
          <Calculator size={20} />
          <span>Calculate Best Tax Regime</span>
        </button>

        {taxProfile && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Investments Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Investment Summary (Capped)</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-slate-600">Total Income</span>
                      <strong className="text-lg text-slate-900">₹{(taxProfile.totalIncome || 0).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-slate-600">Section 80C (Max 1.5L)</span>
                      <strong className="text-lg text-slate-900">₹{(taxProfile.section80C_Total || 0).toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                      <span className="font-medium text-slate-600">Section 80D</span>
                      <strong className="text-lg text-slate-900">₹{(taxProfile.section80D_Total || 0).toLocaleString('en-IN')}</strong>
                  </div>
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 flex flex-col justify-between">
              <div>
                  <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Liability Comparison</h3>
                  <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-600">Old Regime Liability</span>
                          <strong className={`text-xl ${taxProfile.recommendedRegime === 'OLD' ? 'text-indigo-700' : 'text-slate-500 line-through decoration-rose-400'}`}>₹{(taxProfile.oldRegimeLiability || 0).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-600">New Regime Liability</span>
                          <strong className={`text-xl ${taxProfile.recommendedRegime === 'NEW' ? 'text-indigo-700' : 'text-slate-500 line-through decoration-rose-400'}`}>₹{(taxProfile.newRegimeLiability || 0).toLocaleString('en-IN')}</strong>
                      </div>
                  </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-between shadow-md">
                <span>Recommended Regime:</span>
                <span className="text-2xl px-3 py-1 bg-white/20 rounded-lg backdrop-blur-sm tracking-widest">{taxProfile.recommendedRegime}</span>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default TaxPlanner;
