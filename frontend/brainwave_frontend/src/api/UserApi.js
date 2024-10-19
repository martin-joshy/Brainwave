import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

const user_api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

user_api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default user_api;
