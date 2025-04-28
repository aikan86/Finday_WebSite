import React, { useEffect, useState } from 'react';
import EventMap from '../components/map/EventMap';
import { EventService } from '../services/api';
import styled from 'styled-components';

// Dati di esempio per il testing
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Festival di Sanremo",
    description: "Il famoso festival della canzone italiana",
    date: "2025-02-10",
    latitude: 43.8186,
    longitude: 7.7827,
    location: "Teatro Ariston, Sanremo",
    city: "Sanremo",
    region: "Liguria",
    categories: [{ id: 1, name: "Musica" }]
  },
  {
    id: 2,
    title: "Sagra del Pesto",
    description: "Degustazione di pesto genovese e prodotti tipici liguri",
    date: "2025-05-15",
    latitude: 44.4056,
    longitude: 8.9463,
    location: "Piazza De Ferrari, Genova",
    city: "Genova",
    region: "Liguria",
    categories: [{ id: 2, name: "Food & Drink" }]
  },
  {
    id: 3,
    title: "Mostra di Arte Contemporanea",
    description: "Esposizione di opere di artisti emergenti liguri",
    date: "2025-06-20",
    latitude: 44.0986,
    longitude: 9.8250,
    location: "Museo CAMeC, La Spezia",
    city: "La Spezia",
    region: "Liguria",
    categories: [{ id: 3, name: "Arte" }]
  },
  {
    id: 4,
    title: "Festival del Jazz",
    description: "Concerti di jazz con artisti internazionali",
    date: "2025-07-10",
    latitude: 43.9163,
    longitude: 8.0787,
    location: "Porto Turistico, Imperia",
    city: "Imperia",
    region: "Liguria",
    categories: [{ id: 1, name: "Musica" }]
  },
  {
    id: 5,
    title: "Regata Storica",
    description: "Competizione velica nel Golfo dei Poeti",
    date: "2025-08-05",
    latitude: 44.0942,
    longitude: 9.8149,
    location: "Golfo dei Poeti, Lerici",
    city: "Lerici",
    region: "Liguria",
    categories: [{ id: 4, name: "Sport" }]
  },
  {
    id: 6,
    title: "Fiera dell'Artigianato",
    description: "Esposizione di prodotti artigianali locali",
    date: "2025-09-12",
    latitude: 44.3500,
    longitude: 9.1500,
    location: "Centro storico, Rapallo",
    city: "Rapallo",
    region: "Liguria",
    categories: [{ id: 5, name: "Shopping" }]
  }
];

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
`;

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modifica la funzione fetchEvents per usare i dati di test
  const fetchEvents = async (params = {}) => {
    try {
      setLoading(true);
      
      // Commenta la vera chiamata API durante i test e usa i dati mock
      // const response = await EventService.getAll(params);
      // const formattedEvents = response.data.data.map(item => ({
      //   id: item.id,
      //   ...item.attributes,
      //   latitude: parseFloat(item.attributes.latitude),
      //   longitude: parseFloat(item.attributes.longitude),
      //   categories: item.attributes.categories?.data?.map(cat => ({
      //     id: cat.id,
      //     ...cat.attributes
      //   })) || []
      // }));
      
      // Simulare un breve ritardo per mostrare il caricamento
      setTimeout(() => {
        // Filtra gli eventi di test se ci sono filtri di ricerca
        let filteredEvents = [...MOCK_EVENTS];
        
        if (params.filters && params.filters.$or) {
          const searchTerms = params.filters.$or.map(filter => {
            const key = Object.keys(filter)[0];
            const value = filter[key].$containsi;
            return value.toLowerCase();
          });
          
          filteredEvents = filteredEvents.filter(event => {
            return searchTerms.some(term => 
              event.title.toLowerCase().includes(term) ||
              event.description.toLowerCase().includes(term) ||
              event.city.toLowerCase().includes(term) ||
              event.region.toLowerCase().includes(term) ||
              event.location.toLowerCase().includes(term)
            );
          });
        }
        
        setEvents(filteredEvents);
        setError(null);
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error('Errore nel caricamento degli eventi:', err);
      setError('Si è verificato un errore nel caricamento degli eventi. Riprova più tardi.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = async (query) => {
    await fetchEvents({ 
      filters: {
        $or: [
          { title: { $containsi: query } },
          { description: { $containsi: query } },
          { city: { $containsi: query } },
          { region: { $containsi: query } },
          { location: { $containsi: query } }
        ]
      }
    });
  };

  return (
    <>
      {loading && (
        <LoadingOverlay>
          <div>Caricamento eventi in corso...</div>
        </LoadingOverlay>
      )}
      
      {error && !loading && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1001
        }}>
          <h3>Errore</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchEvents()}
            style={{
              background: '#f39c12',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Riprova
          </button>
        </div>
      )}
      
      <EventMap 
        events={events} 
        onSearch={handleSearch}
      />
    </>
  );
};

export default HomePage;
