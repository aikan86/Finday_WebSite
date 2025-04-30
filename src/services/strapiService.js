import axios from 'axios';

const API_URL = 'https://finday-cms.onrender.com/api';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`, {
      params: {
        populate: '*', // Per includere relazioni (categorie) e media (immagini)
      }
    });
    
    // Trasforma la risposta di Strapi nel formato atteso dal componente EventMap
    return response.data.data.map(event => {
      const { attributes } = event;
      
      return {
        id: event.id,
        title: attributes.titolo,
        description: attributes.descrizione,
        date: attributes.dataInizio,
        endDate: attributes.dataFine,
        latitude: attributes.coordinate?.lat || 0,
        longitude: attributes.coordinate?.lng || 0,
        address: attributes.indirizzo,
        imageUrl: attributes.immagine?.data ? 
          `${API_URL.replace('/api', '')}${attributes.immagine.data.attributes.url}` : 
          null,
        externalLink: attributes.linkEsterno,
        categories: attributes.categorie?.data.map(cat => ({
          id: cat.id,
          name: cat.attributes.nome,
          color: cat.attributes.colore
        })) || []
      };
    });
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      params: {
        populate: '*'
      }
    });
    
    return response.data.data.map(category => ({
      id: category.id,
      name: category.attributes.nome,
      color: category.attributes.colore,
      icon: category.attributes.icona?.data ? 
        `${API_URL.replace('/api', '')}${category.attributes.icona.data.attributes.url}` : 
        null
    }));
  } catch (error) {
    console.error('Errore nel recupero delle categorie:', error);
    throw error;
  }
};
