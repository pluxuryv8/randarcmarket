import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API functions
export const marketApi = {
  getCollections: () => api.get('/nft/collections'),
  getCollectionItems: (id: string) => api.get(`/nft/collections/${id}/items`),
  getItemDetails: (address: string) => api.get(`/nft/items/${address}`),
  getActivity: (limit = 50) => api.get(`/nft/activity?limit=${limit}`),
};

export const authApi = {
  verifyTelegram: (initData: any) => api.post('/auth/telegram/verify', initData),
  getMe: () => api.get('/auth/me'),
};

export const paymentsApi = {
  createSubscription: () => api.post('/payments/subscribe'),
  confirmPayment: (orderId: string) => api.post('/payments/confirm', { order_id: orderId }),
};

export const radarApi = {
  getWatchlist: () => api.get('/radar/watchlist'),
  addWatchlistFilter: (filter: any) => api.post('/radar/watchlist', filter),
  removeWatchlistFilter: (id: string) => api.delete(`/radar/watchlist/${id}`),
  getNotifications: (since?: string) => api.get(`/radar/notifications${since ? `?since=${since}` : ''}`),
};

export const dropsApi = {
  getDrops: () => api.get('/drops'),
  getDrop: (id: string) => api.get(`/drops/${id}`),
  participate: (id: string) => api.post(`/drops/${id}/participate`),
};
