import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  confirmPassword: string;
}

export interface TrustedContactData {
  email: string;
  unlockDelay: number;
}

const authService = {
  async login(data: LoginData) {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email: data.email,
      password: data.password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async setTrustedContact(data: TrustedContactData) {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/auth/trusted-contact`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async getTrustedContact() {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/auth/trusted-contact`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async emergencyAccess(email: string) {
    const response = await axios.post(`${API_URL}/auth/emergency-access`, { email });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService; 