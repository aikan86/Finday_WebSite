import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { COLORS } from '../../styles/Colors';

// Definizioni di styled components
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

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FilterSection = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: 500;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isSelected ? props.color || '#f39c12' : '#f1f1f1'};
  color: ${props => props.isSelected ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.isSelected ? props.color || '#f39c12' : '#e0e0e0'};
  }
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const DateLabel = styled.label`
  width: 40px;
  font-size: 14px;
`;

const DateInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const RadiusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RadiusValue = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 500;
`;

const RadiusSlider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${COLORS.primary || '#f39c12'};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${COLORS.primary || '#f39c12'};
    cursor: pointer;
    border: none;
  }
`;

const RadiusLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
`;

const ApplyButton = styled.button`
  display: block;
  width: calc(100% - 30px);
  margin: 15px;
  padding: 10px;
  background-color: ${COLORS.primary || '#f39c12'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${COLORS.primaryDark || '#e67e22'};
  }
`;

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
              color={category.attributes?.colore || '#f39c12'} // Adattato per struttura Strapi
              onClick={() => toggleCategory(category.id)}
            >
              {category.attributes?.icona?.data && (
                <img 
                  src={`https://finday-cms.onrender.com${category.attributes.icona.data.attributes.url}`}
                  alt={category.attributes?.nome}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
              )}
                            {category.attributes?.nome || 'Categoria'}
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
