import api from '../../../../services/api';

const adminAuthService = {
  /**
   * Authenticate admin user
   * @param {Object} credentials - { email, identifier, password }
   */
  async login(credentials) {
    const payload = {
      email: (credentials.email || credentials.identifier || '').trim(),
      identifier: (credentials.identifier || credentials.email || '').trim(),
      password: credentials.password,
    };
    const response = await api.post('/admin/auth/login', payload);
    return response.data;
  },
};

export default adminAuthService;
