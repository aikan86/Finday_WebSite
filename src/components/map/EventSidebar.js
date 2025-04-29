import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  overflow-y: auto;
  transition: right 0.3s ease;
  padding: 0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const SidebarContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
`;

const SidebarFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  
  &:hover {
    color: #f39c12;
  }
`;

const EventTitle = styled.h2`
  font-size: 24px;
  margin: 0 0 10px 0;
  padding-right: 30px;
  color: #333;
`;

const EventDate = styled.div`
  font-size: 16px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
`;

const EventLocation = styled.div`
  font-size: 16px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EventDescription = styled.div`
  margin: 20px 0;
  line-height: 1.6;
  color: #333;
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
`;

const CategoryTag = styled.span`
  background: #f5f5f5;
  color: #333;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 13px;
`;

const InfoSection = styled.div`
  margin: 25px 0;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 15px 0;
  color: #333;
`;

const InfoItem = styled.div`
  margin-bottom: 15px;
  
  strong {
    display: block;
    margin-bottom: 5px;
    color: #666;
  }
`;

const DirectionsButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #4285F4;
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 4px;
  margin-top: 15px;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #3367D6;
  }
`;

const BackToMapButton = styled.button`
  background: #f39c12;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  
  &:hover {
    background: #e67e22;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  color: #666;
`;

const EventSidebar = ({ isOpen, event, loading, error, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <SidebarContainer isOpen={isOpen}>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      
      {loading ? (
        <LoadingContainer>
          <div>Caricamento dettagli evento...</div>
        </LoadingContainer>
      ) : error ? (
        <LoadingContainer>
          <div>Errore: {error}</div>
        </LoadingContainer>
      ) : !event ? (
        <LoadingContainer>
          <div>Evento non trovato</div>
        </LoadingContainer>
      ) : (
        <>
          <SidebarHeader>
            <EventTitle>{event.title}</EventTitle>
            <EventDate>
              <span>📅</span> 
              {format(new Date(event.date), 'EEEE dd MMMM yyyy', { locale: it })}
              {event.startTime && ` - ${event.startTime}`}
              {event.endTime && ` - ${event.endTime}`}
            </EventDate>
            <EventLocation>
              <span>📍</span> {event.location}, {event.city}
            </EventLocation>
            
            {event.categories && event.categories.length > 0 && (
              <CategoryTags>
                {event.categories.map(category => (
                  <CategoryTag key={category.id}>{category.name}</CategoryTag>
                ))}
              </CategoryTags>
            )}
          </SidebarHeader>
          
          <SidebarContent>
            <EventDescription>
              <p>{event.description}</p>
            </EventDescription>
            
            <InfoSection>
              <InfoTitle>Informazioni</InfoTitle>
              
              {event.price && (
                <InfoItem>
                  <strong>Prezzo:</strong>
                  <div>{typeof event.price === 'number' 
                    ? `€${event.price.toFixed(2)}` 
                    : event.price}</div>
                </InfoItem>
              )}
              
              {event.website && (
                <InfoItem>
                  <strong>Sito web:</strong>
                  <a 
                    href={event.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#4285F4', textDecoration: 'none' }}
                  >
                    {event.website.replace(/^https?:\/\//, '')}
                  </a>
                </InfoItem>
              )}
              
              {event.contact && (
                <InfoItem>
                  <strong>Contatto:</strong>
                  <div>{event.contact}</div>
                </InfoItem>
              )}
              
              <InfoItem>
                <strong>Indirizzo:</strong>
                <div>{event.address || event.location}</div>
                <div>{event.city}, {event.region}</div>
                
                {event.latitude && event.longitude && (
                  <DirectionsButton 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}&travelmode=driving`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span>🧭</span> Indicazioni stradali
                  </DirectionsButton>
                )}
              </InfoItem>
            </InfoSection>
            
            {/* Se ci fossero immagini nell'evento le mostreremmo qui */}
            {event.images && event.images.length > 0 && (
              <InfoSection>
                <InfoTitle>Galleria</InfoTitle>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '10px'
                }}>
                  {event.images.map((image, index) => (
                    <img 
                      key={index} 
                      src={image.url} 
                      alt={`${event.title} - immagine ${index + 1}`}
                      style={{ width: '100%', borderRadius: '4px' }}
                    />
                  ))}
                </div>
              </InfoSection>
            )}
          </SidebarContent>
          
          <SidebarFooter>
            <BackToMapButton onClick={onClose}>
              Torna alla mappa
            </BackToMapButton>
          </SidebarFooter>
        </>
      )}
    </SidebarContainer>
  );
};

export default EventSidebar;

              