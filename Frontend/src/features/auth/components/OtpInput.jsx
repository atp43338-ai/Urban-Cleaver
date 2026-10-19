import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

const OtpInput = ({
  length = 6,
  email,
  onComplete,
  onResend,
  isLoading = false,
  resendLoading = false,
  title = "Verify Your Code",
  subtitle,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    // Allow only numeric digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto move to next input if digit entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // If all digits filled, invoke onComplete
    const combined = newOtp.join('');
    if (combined.length === length && !isLoading) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move back and clear previous box
        inputRefs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const pastedDigits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];

    pastedDigits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    // Focus either the last filled box or next empty box
    const focusIndex = Math.min(pastedDigits.length, length - 1);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }

    if (pastedDigits.length === length) {
      onComplete(pastedDigits.join(''));
    }
  };

  const handleResendClick = async () => {
    if (!canResend || resendLoading) return;
    if (onResend) {
      await onResend();
      setTimer(60);
      setCanResend(false);
      setOtp(new Array(length).fill(''));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    const combined = otp.join('');
    if (combined.length === length) {
      onComplete(combined);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 sm:p-10 w-full text-center">
      {/* Icon Badge */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-4">
        <ShieldCheck size={24} className="stroke-[2.2]" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
        {subtitle || (
          <>
            Enter the 6-digit verification code sent to{' '}
            <strong className="font-semibold text-slate-900">{email || 'your email'}</strong>.
          </>
        )}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* OTP Square Digit Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isLoading}
              autoComplete="one-time-code"
              className={`w-11 h-12 sm:w-12 sm:h-12 text-center text-lg font-bold border rounded-lg transition-all outline-none ${
                digit
                  ? 'border-slate-900 bg-slate-50 text-slate-900'
                  : 'border-slate-300 bg-white text-slate-900 focus:border-slate-950 focus:ring-1 focus:ring-slate-950'
              }`}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== length}
          className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-lg h-11 text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Verifying Code...
            </span>
          ) : (
            <>
              <CheckCircle2 size={18} /> Verify & Continue
            </>
          )}
        </button>

        {/* Resend Section */}
        <div className="text-center pt-2">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendClick}
              disabled={resendLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700 transition cursor-pointer"
            >
              <RefreshCw size={13} className={resendLoading ? 'animate-spin' : ''} />
              {resendLoading ? 'Sending new code...' : "Didn't receive code? Resend OTP"}
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
    </div>
  );
};

export default OtpInput;
