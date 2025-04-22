import axios from 'axios';
import authService from './auth';

const API_URL = 'http://localhost:5000/api';

export interface VaultEntry {
  _id?: string;
  title: string;
  category: 'Finance' | 'Health' | 'Personal' | 'Notes';
  content: string;
  autoDeleteDate?: Date;
  visibility: 'Private' | 'Shared' | 'UnlockAfter';
  unlockAfter?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const vaultService = {
  async createEntry(entry: VaultEntry, encryptionPassword: string) {
    const token = authService.getToken();
    const response = await axios.post(
      `${API_URL}/vault`,
      { ...entry, encryptionPassword },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async getEntries() {
    const token = authService.getToken();
    const response = await axios.get(
      `${API_URL}/vault`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async getEntry(id: string, encryptionPassword: string) {
    const token = authService.getToken();
    const response = await axios.get(
      `${API_URL}/vault/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { encryptionPassword }
      }
    );
    return response.data;
  },

  async updateEntry(id: string, entry: Partial<VaultEntry>, encryptionPassword: string) {
    const token = authService.getToken();
    const response = await axios.put(
      `${API_URL}/vault/${id}`,
      { ...entry, encryptionPassword },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async deleteEntry(id: string) {
    const token = authService.getToken();
    const response = await axios.delete(
      `${API_URL}/vault/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async getEmergencyEntries(encryptionPassword: string) {
    const token = authService.getToken();
    const response = await axios.get(
      `${API_URL}/vault/emergency/entries`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { encryptionPassword }
      }
    );
    return response.data;
  }
};

export default vaultService; 