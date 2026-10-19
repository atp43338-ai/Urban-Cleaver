import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import OtpInput from '../components/OtpInput';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MailQuestion } from 'lucide-react';
import toast from 'react-hot-toast';

const OtpVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  const emailParam = searchParams.get('email') || '';
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (otpCode) => {
    if (!emailParam || isLoading) return;
    try {
      setIsLoading(true);
      await verifyOtp({ email: emailParam, otp: otpCode });
      // Notify customer and redirect to login page (no auto-login)
      toast.success('Account verified successfully! Please login to continue.');
      navigate('/login', { replace: true });
    } catch {
      // Error is caught & toasted in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailParam || resendLoading) return;
    try {
      setResendLoading(true);
      await resendOtp(emailParam);
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setResendLoading(false);
    }
  };

  if (!emailParam) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 w-full text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <MailQuestion size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          Missing Verification Email
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          No email address was specified for verification. Please register or sign in to continue.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/register"
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            Go to Register
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition font-medium py-1"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <OtpInput
        email={emailParam}
        onComplete={handleVerify}
        onResend={handleResend}
        isLoading={isLoading}
        resendLoading={resendLoading}
      />
      <div className="text-center mt-5">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition font-medium"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
