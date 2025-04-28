import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import styled from 'styled-components';
import FilterPanel from './FilterPanel';
import { useNavigate } from 'react-router-dom';

const MapWrapper = styled.div`
  height: 100vh;
  width: 100%;
  position: relative;
`;

const TopControlsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
  background: linear-gradient(to bottom, 
                             rgba(255, 255, 255, 0.9) 0%, 
                             rgba(255, 255, 255, 0.8) 50%, 
                             rgba(255, 255, 255, 0.3) 80%, 
                             rgba(255, 255, 255, 0) 100%);
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
`;

// Modifichiamo il LogoOverlay per supportare due diversi loghi
const LogoOverlay = styled.div`
  margin-right: 20px;
  pointer-events: auto;
  
  .desktop-logo {
    height: 40px;
    display: block;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  .mobile-logo {
    height: 40px;
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  pointer-events: auto;
  
  form {
    display: flex;
  }
  
  input {
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    width: 250px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    font-size: 14px;
    
    @media (max-width: 768px) {
      width: calc(100vw - 120px);
    }
  }
  
  button {
    margin-left: 5px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
`;

// Componente per centrare la mappa su una posizione
function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

// Marker personalizzato
const customIcon = new Icon({
  iconUrl: '/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const EventMap = ({ events = [], onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [mapCenter, setMapCenter] = useState([44.1155, 8.9442]); // Centro della Liguria
  const navigate = useNavigate();
  
  const defaultZoom = 9;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch && onSearch(searchQuery);
    }
  };

  const handleApplyFilters = (filters) => {
    // Implementa la logica di filtro qui
    let filtered = [...events];
    
    // Filtro per categorie
    if (filters.categories.length > 0) {
      filtered = filtered.filter(event => 
        event.categories.some(cat => filters.categories.includes(cat.id))
      );
    }
    
    // Filtro per date
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(event => new Date(event.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59); // Fine giornata
      filtered = filtered.filter(event => new Date(event.date) <= endDate);
    }
    
    setFilteredEvents(filtered);
    setIsFilterOpen(false);
  };

  const handleMarkerClick = (event) => {
    navigate(`/event/${event.id}`);
  };

  // Se non ci sono eventi filtrati, mostra tutti gli eventi
  const displayEvents = filteredEvents.length > 0 ? filteredEvents : events;

  return (
    <MapWrapper>
      {/* Sostituiamo i controlli originali con il nuovo TopControlsContainer */}
      <TopControlsContainer>
  <SearchBar>
    <form onSubmit={handleSearchSubmit}>
      <input 
        type="text" 
        placeholder="Cerca eventi o luoghi..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" title="Cerca">🔍</button>
    </form>
    <button 
      onClick={() => setIsFilterOpen(!isFilterOpen)} 
      title="Filtri"
      style={{ marginLeft: '5px' }}
    >
      ⚙️
    </button>
  </SearchBar>
  
  <LogoOverlay>
    {/* Logo per desktop */}
    <img 
      src="/logo-finday.png" 
      alt="Finday Logo" 
      className="desktop-logo" 
    />
    
    {/* Logo per mobile - salva l'immagine che mi hai mandato come "logo-finday-mobile.png" */}
    <img 
      src="/logo-finday-mobile.png" 
      alt="Finday Logo" 
      className="mobile-logo" 
    />
  </LogoOverlay>
</TopControlsContainer>
      
      <FilterPanel 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
      
      <MapContainer 
        center={mapCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Disabilita i controlli zoom standard
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Controlli zoom verranno riposizionati tramite CSS in GlobalStyles */}
        
        <SetViewOnClick coords={mapCenter} />
        
        {displayEvents.map(event => (
          <Marker 
            key={event.id} 
            position={[event.latitude, event.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleMarkerClick(event)
            }}
          >
            <Popup>
              <div>
                <h3>{event.title}</h3>
                <p>{event.description?.substring(0, 100)}...</p>
                <p>Data: {new Date(event.date).toLocaleDateString()}</p>
                <button 
                  onClick={() => navigate(`/event/${event.id}`)}
                  style={{
                    background: '#f39c12',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Vedi dettagli
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default EventMap;
