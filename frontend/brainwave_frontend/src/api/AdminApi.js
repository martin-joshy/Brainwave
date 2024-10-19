import axios from 'axios';
import { ADMIN_ACCESS_TOKEN } from '../constants';

const admin_api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

admin_api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ADMIN_ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default admin_api;
