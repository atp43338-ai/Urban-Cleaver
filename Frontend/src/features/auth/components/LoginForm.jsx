import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage('');
    if (unverifiedEmail) setUnverifiedEmail(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setUnverifiedEmail(null);

    if (!formData.identifier.trim()) {
      setErrorMessage('Please enter your email address or phone number');
      return;
    }

    if (!formData.password) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await login({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      // Check if user account was unverified
      if (res?.unverified) {
        setUnverifiedEmail(res.email);
        return;
      }

      // Successful login -> redirect to home
      navigate('/');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Invalid credentials'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRedirect = () => {
    navigate(`/verify-otp?email=${encodeURIComponent(unverifiedEmail || formData.identifier.trim())}`);
  };

  /**
   * Handle Google OAuth credential response
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage('');
      await googleLogin(credentialResponse.credential);
      navigate('/');
    } catch {
      // Error toast is handled inside AuthContext
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Sign-In was unsuccessful. Please try again.');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 w-full text-left">
      {/* Header */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter your credentials to access your Urban Cleaver account
        </p>
      </div>

      {/* Unverified Account Warning Alert */}
      {unverifiedEmail ? (
        <div className="mb-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Account Not Verified</p>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                A verification code was sent to <strong className="font-semibold text-amber-950">{unverifiedEmail}</strong>. Please verify your email to activate your account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleVerifyRedirect}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            Verify OTP Now <ArrowRight size={13} />
          </button>
        </div>
      ) : errorMessage ? (
        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} className="text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Identifier Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="identifier">
            Email or Phone Number
          </label>
          <div className="relative flex items-center">
            <UserCheck size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="identifier"
              type="text"
              name="identifier"
              placeholder="name@example.com or +919876543210"
              value={formData.identifier}
              onChange={handleChange}
              required
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-3.5 text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-slate-500 hover:text-slate-950 transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading || isGoogleLoading}
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

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Signing In...
            </span>
          ) : (
            <>
              <LogIn size={18} /> Sign In
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium">
            OR Continue with
          </span>
        </div>
      </div>

      {/* Google OAuth Button Container */}
      <div className="w-full flex justify-center">
        {isGoogleLoading ? (
          <div className="w-full h-11 flex items-center justify-center gap-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium">
            <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin"></span>
            Connecting to Google...
          </div>
        ) : (
          <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full [&>div>div]:justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
              width="100%"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-slate-950 hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
