import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventService } from '../services/api';
import styled from 'styled-components';

// Aggiungiamo gli stessi dati mock qui per poter mostrare i dettagli
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Festival di Sanremo",
    description: "Il famoso festival della canzone italiana. Un evento di musica e spettacolo che attira artisti da tutta Italia per esibirsi sul celebre palco del Teatro Ariston. Ogni anno presenta nuove canzoni e nuovi talenti nella scena musicale italiana.",
    date: "2025-02-10",
    startTime: "20:30",
    endTime: "00:00",
    latitude: 43.8186,
    longitude: 7.7827,
    location: "Teatro Ariston",
    address: "Via Matteotti, 107",
    city: "Sanremo",
    region: "Liguria",
    price: "Da €25 a €150",
    website: "https://www.sanremo.rai.it",
    contact: "info@festivalsanremo.it",
    categories: [{ id: 1, name: "Musica" }]
  },
  {
    id: 2,
    title: "Sagra del Pesto",
    description: "Degustazione di pesto genovese e prodotti tipici liguri. Un evento gastronomico che celebra il famoso pesto alla genovese e altre specialità della cucina ligure. Durante l'evento potrai partecipare a showcooking, degustazioni guidate e laboratori per imparare a preparare il vero pesto genovese con mortaio e pestello.",
    date: "2025-05-15",
    startTime: "12:00",
    endTime: "22:00",
    latitude: 44.4056,
    longitude: 8.9463,
    location: "Piazza De Ferrari",
    address: "Piazza De Ferrari",
    city: "Genova",
    region: "Liguria",
    price: "Ingresso gratuito",
    website: "https://www.sagradelpesto.it",
    contact: "info@sagradelpesto.it",
    categories: [{ id: 2, name: "Food & Drink" }]
  },
  {
    id: 3,
    title: "Mostra di Arte Contemporanea",
    description: "Esposizione di opere di artisti emergenti liguri. La mostra presenta opere di pittura, scultura e installazioni multimediali create da artisti emergenti della regione Liguria. Un'occasione per scoprire nuovi talenti e tendenze nell'arte contemporanea locale.",
    date: "2025-06-20",
    startTime: "10:00",
    endTime: "19:00",
    latitude: 44.0986,
    longitude: 9.8250,
    location: "Museo CAMeC",
    address: "Piazza Cesare Battisti, 1",
    city: "La Spezia",
    region: "Liguria",
    price: "€8",
    website: "https://www.camec.spezianet.it",
    contact: "info@camec.it",
    categories: [{ id: 3, name: "Arte" }]
  },
  {
    id: 4,
    title: "Festival del Jazz",
    description: "Concerti di jazz con artisti internazionali. Il festival ospita musicisti jazz di fama internazionale per una serie di concerti all'aperto nella splendida cornice del porto turistico di Imperia. Potrai ascoltare diversi stili jazz, dal tradizionale al fusion, in un'atmosfera suggestiva al tramonto sul mare.",
    date: "2025-07-10",
    startTime: "19:00",
    endTime: "23:30",
    latitude: 43.9163,
    longitude: 8.0787,
    location: "Porto Turistico",
    address: "Calata Cuneo",
    city: "Imperia",
    region: "Liguria",
    price: "€15",
    website: "https://www.imperiajazzfestival.it",
    contact: "info@imperiajazz.it",
    categories: [{ id: 1, name: "Musica" }]
  },
  {
    id: 5,
    title: "Regata Storica",
    description: "Competizione velica nel Golfo dei Poeti. Un evento che richiama appassionati di vela da tutta Italia per una competizione che si svolge nelle splendide acque del Golfo dei Poeti. Le imbarcazioni tradizionali e moderne si sfidano in un percorso che offre uno spettacolo unico per gli spettatori che assistono dalle rive.",
    date: "2025-08-05",
    startTime: "10:00",
    endTime: "18:00",
    latitude: 44.0942,
    longitude: 9.8149,
    location: "Golfo dei Poeti",
    address: "Lungomare di Lerici",
    city: "Lerici",
    region: "Liguria",
    price: "Gratuito per gli spettatori",
    website: "https://www.regatagolfopoeti.it",
    contact: "info@regatalerici.it",
    categories: [{ id: 4, name: "Sport" }]
  },
  {
    id: 6,
    title: "Fiera dell'Artigianato",
    description: "Esposizione di prodotti artigianali locali. La fiera presenta il meglio dell'artigianato ligure: ceramiche, produzioni in ardesia, tessuti, gioielli e oggetti in legno d'ulivo. Gli artigiani mostrano dal vivo le loro tecniche di lavorazione tradizionali e i visitatori possono acquistare pezzi unici direttamente dai produttori.",
    date: "2025-09-12",
    startTime: "09:00",
    endTime: "20:00",
    latitude: 44.3500,
    longitude: 9.1500,
    location: "Centro storico",
    address: "Via Mazzini",
    city: "Rapallo",
    region: "Liguria",
    price: "Ingresso libero",
    website: "https://www.fierartigianatorapallo.it",
    contact: "info@fierarapallo.it",
    categories: [{ id: 5, name: "Shopping" }]
  }
];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BackButton = styled.button`
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    background-color: #e67e22;
  }
`;

const EventHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  
  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .date-location {
    display: flex;
    color: #666;
    gap: 20px;
    margin-bottom: 10px;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  
  .tag {
    background-color: #f1f1f1;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 14px;
  }
`;

const EventContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EventDescription = styled.div`
  line-height: 1.6;
  
  h2 {
    margin-bottom: 15px;
    color: #333;
  }
  
  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 20px;
    
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
    }
  }
`;

const EventSidebar = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
  }
  
  .info-item {
    margin-bottom: 15px;
    
    strong {
      display: block;
      margin-bottom: 5px;
    }
    
    a {
      color: #f39c12;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        
        // Per il test, usa i dati mock invece che chiamare l'API
        // const response = await EventService.getById(id);
        // const eventData = {
        //   id: response.data.data.id,
        //   ...response.data.data.attributes
        // };
        
        // Simulare un breve ritardo per mostrare il caricamento
        setTimeout(() => {
          const eventData = MOCK_EVENTS.find(e => e.id === parseInt(id));
          
          if (eventData) {
            setEvent(eventData);
            setError(null);
          } else {
            setError('Evento non trovato');
          }
          
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Errore nel caricamento dei dettagli evento:', err);
        setError('Si è verificato un errore nel caricamento dei dettagli dell\'evento. Riprova più tardi.');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        Caricamento dettagli evento in corso...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        padding: '20px'
      }}>
        <h2>Errore</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#f39c12',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Torna alla mappa
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <h2>Evento non trovato</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#f39c12',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Torna alla mappa
        </button>
      </div>
    );
  }

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/')}>
        ← Torna alla mappa
      </BackButton>
      
      <EventHeader>
        <h1>{event.title}</h1>
        <div className="date-location">
          <span>📅 {new Date(event.date).toLocaleDateString('it-IT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span>📍 {event.location}, {event.city}</span>
        </div>
        {event.categories && event.categories.length > 0 && (
          <div className="tags">
            {event.categories.map(category => (
              <span key={category.id} className="tag">{category.name}</span>
            ))}
          </div>
        )}
      </EventHeader>
      
      <EventContent>
        <EventDescription>
          <h2>Descrizione</h2>
          <div>{event.description}</div>
          
          {/* Se ci fossero immagini nell'evento le mostreremmo qui */}
          {event.images && event.images.length > 0 && (
            <div className="event-gallery">
              <h2>Galleria</h2>
              <div className="images-grid">
                {event.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image.url} 
                    alt={`${event.title} - immagine ${index + 1}`} 
                  />
                ))}
              </div>
            </div>
          )}
        </EventDescription>
        
        <EventSidebar>
          <h3>Informazioni</h3>
          
          {event.startTime && (
            <div className="info-item">
              <strong>Orario:</strong> {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </div>
          )}
          
          {event.price && (
            <div className="info-item">
              <strong>Prezzo:</strong> {typeof event.price === 'number' 
                ? `€${event.price.toFixed(2)}` 
                : event.price}
            </div>
          )}
          
          {event.website && (
            <div className="info-item">
              <strong>Sito web:</strong>
              <a href={event.website} target="_blank" rel="noopener noreferrer">
                {event.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {event.contact && (
            <div className="info-item">
              <strong>Contatto:</strong> {event.contact}
            </div>
          )}
          
          <div className="info-item">
            <strong>Posizione:</strong>
            <div>{event.address}</div>
            <div>{event.city}, {event.region}</div>
          </div>
          
          {/* Potremmo aggiungere qui una mini mappa con la posizione */}
          <div style={{ 
            marginTop: '20px', 
            height: '200px', 
            background: '#e0e0e0', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#666'
          }}>
            Mappa location
          </div>
        </EventSidebar>
      </EventContent>
    </PageContainer>
  );
};

export default EventDetailPage;
