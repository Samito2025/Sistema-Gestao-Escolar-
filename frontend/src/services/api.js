import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptador para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador para lidar com erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ENDPOINTS ==========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  refreshToken: (token) => api.post('/auth/refresh-token', { token }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (senhaAtual, senhaNova) => api.post('/auth/change-password', { senhaAtual, senhaNova })
};

// ========== USERS ENDPOINTS ==========
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getBySchool: (escolaId, params) => api.get(`/users/school/${escolaId}`, { params }),
  getCountByRole: () => api.get('/users/count/role')
};

// ========== SCHOOLS ENDPOINTS ==========
export const schoolsAPI = {
  create: (data) => api.post('/schools', data),
  getAll: (params) => api.get('/schools', { params }),
  getById: (id) => api.get(`/schools/${id}`),
  update: (id, data) => api.put(`/schools/${id}`, data),
  delete: (id) => api.delete(`/schools/${id}`),
  getByDistrict: (distrito) => api.get(`/schools/district/${distrito}`),
  getStats: (id) => api.get(`/schools/${id}/stats`)
};

// ========== STUDENTS ENDPOINTS ==========
export const studentsAPI = {
  create: (data) => api.post('/students', data),
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  getByClass: (turmaId) => api.get(`/students/class/${turmaId}`),
  getStats: (escolaId) => api.get(`/students/school/${escolaId}/stats`)
};

export default api;
