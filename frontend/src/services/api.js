import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllUsers: () => api.get('/auth/users'),
  updateUserRole: (userId, role) => api.put(`/auth/users/${userId}/role`, { role }),
  deactivateUser: (userId) => api.put(`/auth/users/${userId}/deactivate`),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getOne: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/events/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
  unregister: (id) => api.post(`/events/${id}/unregister`),
  markInterested: (id) => api.post(`/events/${id}/interested`),
  unmarkInterested: (id) => api.post(`/events/${id}/uninterested`),
};

// Lost Items API
export const lostItemsAPI = {
  getAll: (params) => api.get('/lost-items', { params }),
  getOne: (id) => api.get(`/lost-items/${id}`),
  create: (data) => api.post('/lost-items', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/lost-items/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/lost-items/${id}`),
  claim: (id) => api.post(`/lost-items/${id}/claim`),
  approveClaim: (id) => api.post(`/lost-items/${id}/approve`),
  rejectClaim: (id, reason) => api.post(`/lost-items/${id}/reject`, { reason }),
};

// Feedback API
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  getOne: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  respond: (id, data) => api.put(`/feedback/${id}/respond`, data),
  updateStatus: (id, data) => api.put(`/feedback/${id}/status`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// Grievances API
export const grievanceAPI = {
  getAll: (params) => api.get('/grievances', { params }),
  getOne: (id) => api.get(`/grievances/${id}`),
  create: (data) => api.post('/grievances', data),
  respond: (id, data) => api.put(`/grievances/${id}/respond`, data),
  updateStatus: (id, data) => api.put(`/grievances/${id}/status`, data),
  assign: (id, data) => api.put(`/grievances/${id}/assign`, data),
  delete: (id) => api.delete(`/grievances/${id}`),
};

// Announcements API
export const announcementsAPI = {
  getAll: (params) => api.get('/announcements', { params }),
  getOne: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
  togglePin: (id) => api.put(`/announcements/${id}/pin`),
};

// Clubs API
export const clubAPI = {
  getAll: (params) => api.get('/clubs', { params }),
  getOne: (id) => api.get(`/clubs/${id}`),
  create: (data) => api.post('/clubs', data),
  update: (id, data) => api.put(`/clubs/${id}`, data),
  delete: (id) => api.delete(`/clubs/${id}`),
  requestJoin: (id, data) => api.post(`/clubs/${id}/join`, data),
  handleMembership: (clubId, requestId, data) => api.put(`/clubs/${clubId}/membership/${requestId}`, data),
  removeMember: (clubId, memberId) => api.delete(`/clubs/${clubId}/members/${memberId}`),
  addAchievement: (id, data) => api.post(`/clubs/${id}/achievements`, data),
  addResource: (id, data) => api.post(`/clubs/${id}/resources`, data),
  approve: (id) => api.put(`/clubs/${id}/approve`),
  reject: (id, data) => api.put(`/clubs/${id}/reject`, data),
  getPending: () => api.get('/clubs/pending'),
};

// Polls API
export const pollAPI = {
  getAll: (params) => api.get('/polls', { params }),
  getOne: (id) => api.get(`/polls/${id}`),
  create: (data) => api.post('/polls', data),
  update: (id, data) => api.put(`/polls/${id}`, data),
  delete: (id) => api.delete(`/polls/${id}`),
  vote: (id, data) => api.post(`/polls/${id}/vote`, data),
  close: (id) => api.put(`/polls/${id}/close`),
  approve: (id) => api.put(`/polls/${id}/approve`),
  reject: (id, data) => api.put(`/polls/${id}/reject`, data),
  getPending: () => api.get('/polls/pending'),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (data) => api.post('/chatbot/query', data),
  getSuggestions: () => api.get('/chatbot/suggestions'),
  getFAQs: () => api.get('/chatbot/faqs'),
};

export default api;
