import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../auth/context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.identifier.trim()) {
      setErrorMessage('Administrator email or phone is required');
      return;
    }

    if (!formData.password) {
      setErrorMessage('Security password is required');
      return;
    }

    try {
      setIsLoading(true);
      await adminLogin({
        email: formData.identifier.trim(),
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      // Redirect into Admin Dashboard
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Administrative authentication failed.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 w-full text-left">
      {/* Header */}
      <div className="mb-6 text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck size={13} className="text-slate-900" />
          Admin Console
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Admin Sign In
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Restricted access. All administrative access attempts are monitored and logged.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} className="text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Identifier */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="admin-identifier">
            Administrator Identifier
          </label>
          <div className="relative flex items-center">
            <UserCheck size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="admin-identifier"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="admin@urbancleaver.com or +91..."
              disabled={isLoading}
              required
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-3.5 text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="admin-password">
            Security Password
          </label>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              disabled={isLoading}
              required
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-10 text-sm transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Authenticating Credentials...
            </span>
          ) : (
            <>
              Access Admin Portal <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Link to Customer Store */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition"
        >
          <ExternalLink size={13} /> Return to Customer Storefront
        </Link>
      </div>
    </div>
  );
};

export default AdminLoginForm;
