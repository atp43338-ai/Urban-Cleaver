import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^\d+]/g, '');
    setFormData((prev) => ({
      ...prev,
      phone: val,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (!formData.name.trim()) {
      setErrorMessage('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email address is required');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Phone number is required for order updates');
      return;
    }

    // Format phone to +91
    let formattedPhone = formData.phone.trim();
    if (!formattedPhone.startsWith('+91')) {
      if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
        formattedPhone = `+${formattedPhone}`;
      } else if (formattedPhone.length === 10) {
        formattedPhone = `+91${formattedPhone}`;
      } else {
        setErrorMessage('Please enter a valid 10-digit Indian phone number (e.g. +919876543210)');
        return;
      }
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formattedPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Auto redirect to OTP verification page
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}`);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 w-full text-left">
      {/* Header */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Join Urban Cleaver for artisanal butchery & gourmet cuts
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
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="name">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-3.5 text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-3.5 text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="phone">
              Phone Number
            </label>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
              WhatsApp Updates
            </span>
          </div>
          <div className="relative flex items-center">
            <Phone size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-3.5 text-sm transition-all outline-none"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Enter 10-digit mobile number (+91 will be prefixed automatically).
          </p>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-10 text-sm transition-all outline-none"
            />
            <button
              type="button"
              className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-10 text-sm transition-all outline-none"
            />
            <button
              type="button"
              className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Creating Account...
            </span>
          ) : (
            <>
              <UserPlus size={18} /> Create Account
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-slate-950 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
