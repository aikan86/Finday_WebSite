// src/services/api.js
import axios from 'axios';
import config from '../config/api';

const API = axios.create({
  baseURL: config.baseURL,
});

// Interceptor per aggiungere token di autenticazione
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const EventService = {
  getAll: (params) => API.get(config.endpoints.events, { 
    params: { 
      ...params,
      populate: '*' // Assicurati di popolare tutte le relazioni
    } 
  }),
  getById: (id) => API.get(`${config.endpoints.events}/${id}`, {
    params: {
      populate: '*' // Popola tutte le relazioni per i dettagli
    }
  }),
  create: (data) => API.post(config.endpoints.events, { data }),
  update: (id, data) => API.put(`${config.endpoints.events}/${id}`, { data }),
  delete: (id) => API.delete(`${config.endpoints.events}/${id}`),
  
  // Metodi specifici per ricerche geografiche
  getByLocation: (lat, lng, radius) => API.get(config.endpoints.events, {
    params: {
      filters: {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radius * 1000 // converti in metri
          }
        }
      },
      populate: '*'
    }
  }),
  
  // Cerca per nome di località o regione
  getByPlaceName: (placeName) => API.get(config.endpoints.events, {
    params: {
      filters: {
        $or: [
            { city: { $containsi: placeName } },
            { region: { $containsi: placeName } },
            { location: { $containsi: placeName } },
            { address: { $containsi: placeName } }
          ]
        },
        populate: '*'
      }
    }),
    
    // Cerca per categoria
    getByCategory: (categoryId) => API.get(config.endpoints.events, {
      params: {
        filters: {
          category: {
            id: { $eq: categoryId }
          }
        },
        populate: '*'
      }
    })
  };
  
  export const CategoryService = {
    getAll: () => API.get(config.endpoints.categories),
  };
  
  export const AuthService = {
    login: (credentials) => API.post('/api/auth/local', credentials),
    register: (userData) => API.post('/api/auth/local/register', userData),
    getCurrentUser: () => API.get('/api/users/me'),
  };
  
  export default API;
  