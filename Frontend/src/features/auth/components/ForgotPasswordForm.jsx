import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown for Step 2
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (step === 2 && timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Step 1: Send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address');
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email.trim());
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to send reset code'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend OTP in Step 2
  const handleResend = async () => {
    if (!canResend || isLoading) return;
    try {
      setIsLoading(true);
      await forgotPassword(email.trim());
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to resend code'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2: Reset Password with OTP
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });
      setStep(3); // Success step
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Password reset failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 w-full text-left">
      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <>
          <div className="mb-6 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Forgot password?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your registered email address to receive a 6-digit recovery code.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <ShieldAlert size={16} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRequestOtp} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="forgot-email">
                Registered Email
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                  className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-3.5 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Sending Recovery Code...
                </span>
              ) : (
                <>
                  <KeyRound size={18} /> Send Recovery Code
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </>
      )}

      {/* STEP 2: Enter OTP & New Password */}
      {step === 2 && (
        <>
          <div className="mb-6 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create new password
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter the 6-digit code sent to <strong className="font-semibold text-slate-900">{email}</strong> and specify your new password.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <ShieldAlert size={16} className="text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleResetSubmit} className="space-y-4" noValidate>
            {/* 6-Digit OTP */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="otp-code">
                6-Digit Recovery Code
              </label>
              <div className="relative flex items-center">
                <KeyRound size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="otp-code"
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 123456"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  disabled={isLoading}
                  className="w-full bg-white border border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950 text-slate-900 placeholder:text-slate-400 rounded-lg h-11 pl-10 pr-3.5 text-sm tracking-widest font-mono transition-all outline-none"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
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

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="confirmNewPassword">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
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

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Resetting Password...
                </span>
              ) : (
                'Set New Password'
              )}
            </button>

            {/* Resend Action */}
            <div className="text-center pt-2">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700 transition cursor-pointer"
                >
                  <RefreshCw size={13} /> Resend Recovery Code
                </button>
              ) : (
                <p className="text-xs text-slate-400">
                  Resend code in{' '}
                  <span className="font-semibold text-slate-700 font-mono">
                    {timer}s
                  </span>
                </p>
              )}
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition cursor-pointer"
              onClick={() => {
                setStep(1);
                setErrorMessage('');
              }}
            >
              <ArrowLeft size={14} /> Change Email
            </button>
          </div>
        </>
      )}

      {/* STEP 3: Success Step */}
      {step === 3 && (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={26} className="stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Password updated!
          </h1>
          <p className="text-sm text-slate-500 mt-2 mb-8 leading-relaxed max-w-xs mx-auto">
            Your password has been successfully changed. You can now log into your Urban Cleaver account.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center cursor-pointer"
          >
            Sign In with New Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
