import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import adminAuthService from '../../admin/auth/services/adminAuthService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('urban_cleaver_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('urban_cleaver_token') || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Re-verify session on app load if token exists
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('urban_cleaver_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('urban_cleaver_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[Urban Cleaver] Stored session invalid, resetting auth state.');
          logout(false);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  // Save session helper
  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('urban_cleaver_token', newToken);
    localStorage.setItem('urban_cleaver_user', JSON.stringify(newUser));
  };

  // Register
  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      toast.success(res.message || 'OTP sent! Please check your email.');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(message);
      throw err;
    }
  };

  // Verify OTP
  const verifyOtp = async ({ email, otp }) => {
    try {
      const res = await authService.verifyOtp({ email, otp });
      // Strictly do NOT auto-login user upon verification.
      // Clear any prior auth session to guarantee clean explicit login state.
      setToken(null);
      setUser(null);
      localStorage.removeItem('urban_cleaver_token');
      localStorage.removeItem('urban_cleaver_user');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Verification failed';
      toast.error(message);
      throw err;
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    try {
      const res = await authService.resendOtp({ email });
      toast.success(res.message || 'New OTP sent to your email.');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to resend OTP';
      toast.error(message);
      throw err;
    }
  };

  // Login
  const login = async ({ identifier, password }) => {
    try {
      const res = await authService.login({ identifier, password });
      handleAuthSuccess(res.token, res.user);
      toast.success(res.message || 'Logged in successfully!');
      return res;
    } catch (err) {
      // Check if blocked due to unverified status (403)
      if (err.response?.status === 403 && err.response?.data?.isVerified === false) {
        toast.error(err.response.data.message || 'Account unverified. Fresh OTP sent!');
        return { unverified: true, email: err.response.data.email };
      }
      const message = err.response?.data?.message || err.message || 'Login failed';
      toast.error(message);
      throw err;
    }
  };

  // Google Login
  const googleLogin = async (credentialData) => {
    try {
      const res = await authService.googleLogin(credentialData);
      handleAuthSuccess(res.token, res.user);
      toast.success(res.message || 'Logged in successfully with Google!');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Google authentication failed';
      toast.error(message);
      throw err;
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await authService.forgotPassword({ email });
      toast.success(res.message || 'Password reset instructions sent to your email.');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to request reset OTP';
      toast.error(message);
      throw err;
    }
  };

  // Reset Password
  const resetPassword = async (data) => {
    try {
      const res = await authService.resetPassword(data);
      toast.success(res.message || 'Password reset successfully!');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Password reset failed';
      toast.error(message);
      throw err;
    }
  };

  // Logout
  const logout = (showToast = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('urban_cleaver_token');
    localStorage.removeItem('urban_cleaver_user');
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  // Admin Login
  const adminLogin = async ({ identifier, password }) => {
    try {
      const res = await adminAuthService.login({ identifier, password });
      handleAuthSuccess(res.token, res.user);
      toast.success(res.message || 'Authenticated into Admin Console');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Admin login failed';
      toast.error(message);
      throw err;
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    register,
    verifyOtp,
    resendOtp,
    login,
    googleLogin,
    adminLogin,
    handleAuthSuccess,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
