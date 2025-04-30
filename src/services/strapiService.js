// src/services/strapiService.js
import axios from 'axios';

//const API_URL = 'http://localhost:1337/api'; // In sviluppo
const API_URL = 'https://finday-cms.onrender.com/api'; // In produzione

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/eventis`, {
      params: {
        populate: ['categories', 'image', 'gallery'],
      }
    });
    
    // Trasforma i dati nella struttura attesa dall'app
    return response.data.data.map(item => ({
      id: item.id,
      title: item.attributes.title,
      description: item.attributes.description,
      date: item.attributes.date,
      endDate: item.attributes.endDate,
      location: item.attributes.location,
      address: item.attributes.address,
      latitude: parseFloat(item.attributes.latitude),
      longitude: parseFloat(item.attributes.longitude),
      featured: item.attributes.featured || false,
      isActive: item.attributes.isActive !== false,
      categories: item.attributes.categories?.data?.map(cat => ({
        id: cat.id,
        name: cat.attributes.name,
        color: cat.attributes.color || 'red' // Default color
      })) || [],
      image: item.attributes.image?.data 
        ? item.attributes.image.data.attributes.url 
        : null,
      gallery: item.attributes.gallery?.data 
        ? item.attributes.gallery.data.map(img => img.attributes.url) 
        : []
    }));
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorie`, {
      params: {
        populate: ['icon']
      }
    });
    
    // Trasforma i dati nella struttura attesa dall'app
    return response.data.data.map(item => ({
      id: item.id,
      name: item.attributes.name,
      description: item.attributes.description,
      color: item.attributes.color || 'red',
      icon: item.attributes.icon?.data?.attributes?.url || null
    }));
  } catch (error) {
    console.error('Errore nel recupero delle categorie:', error);
    return [];
  }
};