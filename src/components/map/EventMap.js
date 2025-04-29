

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import styled from 'styled-components';
import FilterPanel from './FilterPanel';
import { useNavigate } from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';
import InfoBox from './InfoBox'; 

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
  position: relative;
  
  form {
    display: flex;
    position: relative;
  }
  
  input {
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #e0e0e0;
    width: 250px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    font-size: 14px;
    
    @media (max-width: 768px) {
      width: ${props => props.isSearchOpen ? 'calc(100vw - 120px)' : '0'};
      padding: ${props => props.isSearchOpen ? '8px 12px' : '0'};
      border: ${props => props.isSearchOpen ? '1px solid #e0e0e0' : 'none'};
      opacity: ${props => props.isSearchOpen ? '1' : '0'};
      transition: all 0.3s ease;
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

const MobileSearchButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    margin-right: 5px;
    font-size: 16px;
    z-index: 1001;
    pointer-events: auto;
  }
`;

// Messaggio per nessun risultato dei filtri
const NoResultsMessage = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  font-size: 14px;
  display: flex;
  align-items: center;
  
  button {
    background: none;
    border: none;
    color: #f39c12;
    margin-left: 10px;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }
`;

// Componente per i suggerimenti di ricerca
const SearchSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 250px;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1001;
  margin-top: 5px;
  
  @media (max-width: 768px) {
    width: calc(100vw - 120px);
  }
  
  div {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f1f1f1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    &:hover {
      background: #f9f9f9;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

// Aggiungiamo un pulsante per la geolocalizzazione
const LocationButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 1000;
  cursor: pointer;
  font-size: 20px;
  
  &:hover {
    background: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    bottom: 25px;
    right: 15px;
    width: 45px;
    height: 45px;
    font-size: 22px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
`;

// Marker personalizzato per eventi
// Marker personalizzato per eventi
const customIcon = new Icon({
  iconUrl: '/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Marker personalizzato per la posizione utente
const userLocationIcon = new Icon({
  iconUrl: '/user-location-marker.png',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -15],
});

// Componente per gestire la posizione dell'utente
function LocationMarker({ onLocationFound }) {
  const map = useMapEvents({
    locationfound(e) {
      if (onLocationFound) {
        onLocationFound(e.latlng);
      }
      // Zoom che copre circa 50km quadrati (valore 11 approssimativo)
      map.flyTo(e.latlng, 11);
    },
    locationerror(e) {
      console.error("Errore di geolocalizzazione:", e.message);
      alert("Non è stato possibile trovare la tua posizione. Verifica che la geolocalizzazione sia attivata nel tuo browser.");
    }
  });
  
  // Al montaggio del componente, richiedi la posizione
  useEffect(() => {
    map.locate();
  }, [map]);
  
  return null;
}

// Componente per centrare la mappa su una posizione
function SetViewOnClick({ coords, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, zoom || map.getZoom());
    }
  }, [coords, zoom, map]);
  return null;
}

// Funzione per creare un debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const EventMap = ({ events = [], onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(!isMobile);  
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState([44.1155, 8.9442]);
  const [mapZoom, setMapZoom] = useState(9);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(50);
  const [showRadiusCircle, setShowRadiusCircle] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width <= 768;

    // Funzione per cercare suggerimenti
    const fetchSuggestions = async (query) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        
        if (!response.ok) {
          throw new Error('Errore nella ricerca suggerimenti');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setSuggestions(data.map(item => ({
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          })));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Errore nella ricerca suggerimenti:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
  
    // Debounce per la ricerca di suggerimenti
    const debouncedSearch = useCallback(
      debounce((query) => {
        if (query && query.length >= 3) {
          fetchSuggestions(query);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 500),
      []
    );
  
    // Chiudi la barra di ricerca quando si passa alla visualizzazione desktop
    useEffect(() => {
      if (!isMobile && isSearchOpen) {
        setIsSearchOpen(false);
      }
    }, [isMobile, isSearchOpen]);
  
    // Richiedi la posizione dell'utente all'avvio
    useEffect(() => {
      requestUserLocation();
    }, []);
  
    // Gestisci click fuori dai suggerimenti per chiuderli
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showSuggestions && !event.target.closest('.search-container')) {
          setShowSuggestions(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showSuggestions]);
  
    // Funzione per cercare un luogo e centrare la mappa
    const handleSearchSubmit = async (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        setIsSearching(true);
        setSearchError('');
        setShowSuggestions(false);
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
          );
          
          if (!response.ok) {
            throw new Error('Errore nella ricerca del luogo');
          }
          
          const data = await response.json();
          
          if (data && data.length > 0) {
            const location = {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              displayName: data[0].display_name
            };
            
            // Aggiorna il centro della mappa e il livello di zoom
            setMapCenter([location.lat, location.lng]);
            setMapZoom(13); // Zoom appropriato per vedere l'area cercata
            
            // Imposta anche questa come nuova posizione dell'utente
            setUserLocation({
              lat: location.lat,
              lng: location.lng
            });
            
            // Mostra un messaggio di successo
            console.log(`Trovato: ${location.displayName}`);
          } else {
            setSearchError('Nessun risultato trovato per la ricerca');
          }
        } catch (error) {
          console.error('Errore nella ricerca:', error);
          setSearchError('Si è verificato un errore durante la ricerca');
        } finally {
          setIsSearching(false);
          
          // Chiudere la barra di ricerca mobile dopo la ricerca
          if (isMobile) {
            setIsSearchOpen(false);
          }
        }
      }
    };
  
    const toggleMobileSearch = () => {
      setIsSearchOpen(!isSearchOpen);
    };
  
    // Gestisci il click su un suggerimento
    const handleSuggestionClick = (suggestion) => {
      setSearchQuery(suggestion.displayName.split(',')[0]);
      setShowSuggestions(false);
      
      // Centra la mappa sulla posizione suggerita
      setMapCenter([suggestion.lat, suggestion.lng]);
      setMapZoom(13);
      
      // Imposta la posizione dell'utente
      setUserLocation({
        lat: suggestion.lat,
        lng: suggestion.lng
      });
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
      
      // Filtro per raggio di ricerca
      if (userLocation && filters.searchRadius) {
        setSearchRadius(filters.searchRadius);
        setShowRadiusCircle(true);
        
        // Filtra gli eventi entro il raggio specificato
        filtered = filtered.filter(event => {
          // Calcola la distanza tra l'evento e la posizione dell'utente
          const distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            event.latitude, 
            event.longitude
          );
          
          // Converti in km e verifica se è nel raggio
          return distance <= filters.searchRadius;
        });
      } else {
        setShowRadiusCircle(false);
      }
      
      setFilteredEvents(filtered);
      setHasAppliedFilters(true);
      setIsFilterOpen(false);
    };
  
    // Funzione per calcolare la distanza tra due punti (formula di Haversine)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Raggio della Terra in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const distance = R * c; // Distanza in km
      return distance;
    };
  
    const resetFilters = () => {
      setFilteredEvents([]);
      setHasAppliedFilters(false);
      setShowRadiusCircle(false);
    };
  
    const handleMarkerClick = (event) => {
      navigate(`/event/${event.id}`);
    };
  
    const handleLocationFound = (location) => {
      setUserLocation(location);
      setMapCenter([location.lat, location.lng]);
      setMapZoom(11); // Zoom per coprire circa 50 km quadrati
    };
  
    const requestUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            handleLocationFound(location);
          },
          (error) => {
            console.error("Errore di geolocalizzazione:", error.message);
            console.log("Impossibile ottenere la posizione automaticamente");
          },
          { enableHighAccuracy: true }
        );
      } else {
        console.log("La geolocalizzazione non è supportata dal tuo browser.");
      }
    };
  
    // Determina quali eventi mostrare
    const displayEvents = hasAppliedFilters ? filteredEvents : events;
    const noResults = hasAppliedFilters && filteredEvents.length === 0;
  
    return (
      <MapWrapper>
        <TopControlsContainer>
          <div style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
            {/* Pulsante per aprire/chiudere la ricerca su mobile */}
            {isMobile && (
              <MobileSearchButton 
                onClick={toggleMobileSearch}
                title={isSearchOpen ? "Chiudi ricerca" : "Apri ricerca"}
              >
                {isSearchOpen ? "✕" : "🔍"}
              </MobileSearchButton>
            )}
            
            <SearchBar isSearchOpen={isSearchOpen}>
              <form onSubmit={handleSearchSubmit} className="search-container">
                <input 
                  type="text" 
                  placeholder="Cerca località..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  disabled={isSearching}
                />
                <button 
                  type="submit" 
                  title="Cerca"
                  style={{ 
                    display: isMobile && !isSearchOpen ? 'none' : 'flex' 
                  }}
                  disabled={isSearching}
                >
                  {isSearching ? "⏳" : "🔍"}
                </button>
                
                {/* Suggerimenti */}
                {showSuggestions && suggestions.length > 0 && (
                  <SearchSuggestions>
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.displayName}
                      </div>
                    ))}
                  </SearchSuggestions>
                )}
              </form>
              <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              title="Filtri"
              style={{ 
                marginLeft: '5px',
                display: isMobile && isSearchOpen ? 'none' : 'flex'
              }}
            >
              ⚙️
            </button>
          </SearchBar>
        </div>
        
        <LogoOverlay>
          <img 
            src="/logo-finday.png" 
            alt="Finday Logo" 
            className="desktop-logo" 
          />
          <img 
            src="/logo-finday-mobile.png" 
            alt="Finday Logo" 
            className="mobile-logo" 
          />
        </LogoOverlay>
      </TopControlsContainer>
      
      {/* Messaggio di errore nella ricerca */}
      {searchError && (
        <NoResultsMessage>
          {searchError}
          <button onClick={() => setSearchError('')}>×</button>
        </NoResultsMessage>
      )}
      
      {/* Messaggio se non ci sono risultati */}
      {noResults && (
        <NoResultsMessage>
          Nessun evento corrisponde ai filtri selezionati
          <button onClick={resetFilters}>Rimuovi filtri</button>
        </NoResultsMessage>
      )}
      
      <FilterPanel 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        userLocation={userLocation}
      />
      
      {/* Pulsante per la geolocalizzazione */}
      <LocationButton 
        onClick={requestUserLocation}
        title="Trova la mia posizione"
      >
        📍
      </LocationButton>

      <InfoBox isMobile={isMobile} />
      
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Componente per gestire la geolocalizzazione */}
        <LocationMarker onLocationFound={handleLocationFound} />
        
        {/* Componente per centrare la mappa */}
        <SetViewOnClick coords={mapCenter} zoom={mapZoom} />
        
        {/* Cerchio che mostra il raggio di ricerca */}
        {userLocation && showRadiusCircle && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={searchRadius * 1000} // Converti km in metri
            pathOptions={{
              color: '#f39c12',
              fillColor: '#f39c12',
              fillOpacity: 0.1,
            }}
          />
        )}
        
        {/* Marker per la posizione dell'utente */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={userLocationIcon}
          >
            <Popup>
              <div>La tua posizione attuale</div>
            </Popup>
          </Marker>
        )}
        
        {/* Marker per gli eventi */}
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

          