import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { COLORS } from '../../styles/Colors';

// Mantieni tutti i tuoi styled components originali...
const FilterPanelContainer = styled.div`
  position: absolute;
  top: 70px;
  left: ${props => props.isOpen ? '10px' : '-300px'};
  width: 280px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: left 0.3s ease;
  z-index: 1000;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 85%;
    max-width: 300px;
    top: 80px;
    max-height: calc(100vh - 160px);
  }
`;

// Continua con gli altri styled components che hai nel tuo componente originale...

const FilterPanel = ({ isOpen, onClose, onApplyFilters, userLocation, categories = [] }) => {
  // Stati originali
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchRadius, setSearchRadius] = useState(50);
  
  // Reset dei filtri quando il pannello viene aperto/chiuso
  useEffect(() => {
    if (!isOpen) {
      // Opzionale: puoi decidere se resettare i filtri quando il pannello viene chiuso
      // setSelectedCategories([]);
      // setStartDate('');
      // setEndDate('');
      // setSearchRadius(50);
    }
  }, [isOpen]);
  
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  const handleApplyFilters = () => {
    const filters = {
      categories: selectedCategories,
      startDate,
      endDate,
      searchRadius: userLocation ? searchRadius : null
    };
    
    onApplyFilters(filters);
  };
  
  return (
    <FilterPanelContainer isOpen={isOpen}>
      <FilterHeader>
        <h2>Filtri</h2>
        <CloseButton onClick={onClose}>×</CloseButton>
      </FilterHeader>
      
      <FilterSection>
        <h3>Categorie</h3>
        <CategoryList>
          {categories.map(category => (
            <CategoryItem 
              key={category.id}
              isSelected={selectedCategories.includes(category.id)}
              color={category.color || '#f39c12'} // Colore di default se non specificato
              onClick={() => toggleCategory(category.id)}
            >
              {category.icon && (
                <img 
                  src={category.icon} 
                  alt={category.name} 
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
              )}
              {category.name}
            </CategoryItem>
          ))}
          
          {categories.length === 0 && (
            <p style={{ fontSize: '14px', color: '#666', padding: '10px 0' }}>
              Nessuna categoria disponibile
            </p>
          )}
        </CategoryList>
      </FilterSection>
      
      <FilterSection>
        <h3>Date</h3>
        <DateContainer>
          <DateLabel>Da:</DateLabel>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </DateContainer>
        
        <DateContainer>
          <DateLabel>A:</DateLabel>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DateContainer>
      </FilterSection>
      
      {userLocation && (
        <FilterSection>
          <h3>Raggio di ricerca</h3>
          <RadiusContainer>
            <RadiusValue>{searchRadius} km</RadiusValue>
            <RadiusSlider 
              type="range" 
              min="1" 
              max="100" 
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            />
            <RadiusLabels>
              <span>1 km</span>
              <span>50 km</span>
              <span>100 km</span>
            </RadiusLabels>
          </RadiusContainer>
        </FilterSection>
      )}
      
      <ApplyButton onClick={handleApplyFilters}>
        Applica filtri
      </ApplyButton>
    </FilterPanelContainer>
  );
};

export default FilterPanel;
