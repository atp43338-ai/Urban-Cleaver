import api from '../../../services/api';

const authService = {
  /**
   * Register a new user
   * @param {Object} data - { name, email, phone, password, confirmPassword }
   */
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Verify 6-digit OTP
   * @param {Object} data - { email, otp }
   */
  async verifyOtp(data) {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Resend verification OTP
   * @param {Object} data - { email }
   */
  async resendOtp(data) {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  },

  /**
   * Login with email or phone + password
   * @param {Object} data - { identifier, password }
   */
  async login(data) {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Login or register customer via Google OAuth ID token
   * @param {string|Object} credentialData - { credential } or credential string
   */
  async googleLogin(credentialData) {
    const payload = typeof credentialData === 'string'
      ? { credential: credentialData }
      : credentialData;
    const response = await api.post('/auth/google', payload);
    return response.data;
  },

  /**
   * Send forgot password OTP to email
   * @param {Object} data - { email }
   */
  async forgotPassword(data) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with OTP
   * @param {Object} data - { email, otp, newPassword, confirmPassword }
   */
  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Fetch current authenticated user session
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
