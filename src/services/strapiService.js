// src/services/strapiService.js
import axios from 'axios';

const API_URL = 'https://finday-cms.onrender.com/api';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      params: {
        populate: '*',
      }
    });
    
    // Log per debugging
    console.log('Risposta da Strapi:', response.data);
    
    // Restituisci i dati grezzi per ora
    return response.data.data || [];
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      params: {
        populate: '*'
      }
    });
    
    // Log per debugging
    console.log('Categorie da Strapi:', response.data);
    
    // Restituisci i dati grezzi per ora
    return response.data.data || [];
  } catch (error) {
    console.error('Errore nel recupero delle categorie:', error);
    return [];
  }
};
