import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const devicesApi = {
  linkDevice: (data: { name: string; deviceId: string }) =>
    api.post('/devices/link', data),
  getDevices: () => api.get('/devices'),
  getDevice: (id: string) => api.get(`/devices/${id}`),
  unlinkDevice: (id: string) => api.delete(`/devices/${id}`),
  updateLocation: (deviceId: string, data: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number;
    speed?: number;
    heading?: number;
    batteryLevel?: number;
    isCharging?: boolean;
  }) => api.post(`/devices/location/${deviceId}`, data),
};

export default api;
