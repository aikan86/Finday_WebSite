import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CategoryService } from '../../services/api';
import useWindowSize from '../../hooks/useWindowSize';

const FilterContainer = styled.div`
  position: absolute;
  top: 70px;
  left: 10px;
  z-index: 1000;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 300px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: calc(100% - 20px);
    max-height: 70vh;
  }
`;

const FilterTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;
`;

const FilterLabel = styled.h4`
  margin: 0 0 10px 0;
  font-size: 14px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CategoryChip = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  background-color: ${props => props.selected ? '#f39c12' : '#f1f1f1'};
  color: ${props => props.selected ? 'white' : 'black'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? '#e67e22' : '#e0e0e0'};
  }
`;

const DateFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RadiusSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  .slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  input[type="range"] {
    flex-grow: 1;
  }
  
  .radius-value {
    font-size: 14px;
    font-weight: bold;
    color: #f39c12;
    width: 60px;
    text-align: right;
  }
`;

const ApplyButton = styled.button`
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  font-weight: bold;
  
  &:hover {
    background-color: #e67e22;
  }
`;

// Dati di categorie di esempio per il testing
// Dati di categorie di esempio per il testing
const MOCK_CATEGORIES = [
  { id: 1, name: "Musica" },
  { id: 2, name: "Food & Drink" },
  { id: 3, name: "Arte" },
  { id: 4, name: "Sport" },
  { id: 5, name: "Shopping" },
  { id: 6, name: "Teatro" },
  { id: 7, name: "Cinema" }
];

const FilterPanel = ({ isOpen, onClose, onApplyFilters, userLocation }) => {
  // Chiamiamo l'hook all'interno del componente
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchRadius, setSearchRadius] = useState(50); // Default 50 km
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Per il testing, usiamo categorie di esempio invece che chiamare l'API
        // const response = await CategoryService.getAll();
        // const formattedCategories = response.data.data.map(item => ({
        //   id: item.id,
        //   ...item.attributes
        // }));
        
        // Simulare un breve ritardo
        setTimeout(() => {
          setCategories(MOCK_CATEGORIES);
          setLoading(false);
        }, 300);
        
      } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
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
    onApplyFilters({
      categories: selectedCategories,
      startDate,
      endDate,
      searchRadius: parseInt(searchRadius, 10) // Aggiungiamo il raggio di ricerca
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setStartDate('');
    setEndDate('');
    setSearchRadius(50); // Reset al valore predefinito
  };

  if (!isOpen) return null;

  return (
    <FilterContainer>
      <FilterTitle>
        Filtra Eventi
        <CloseButton onClick={onClose}>×</CloseButton>
      </FilterTitle>

      {/* Filtro per raggio di ricerca */}
      {userLocation && (
        <FilterGroup>
          <FilterLabel>Raggio di ricerca</FilterLabel>
          <RadiusSlider>
            <div className="slider-container">
              <input
                type="range"
                min="5"
                max="200"
                value={searchRadius}
                onChange={(e) => setSearchRadius(e.target.value)}
              />
              <span className="radius-value">{searchRadius} km</span>
            </div>
          </RadiusSlider>
        </FilterGroup>
      )}

<FilterGroup>
        <FilterLabel>Categorie</FilterLabel>
        {loading ? (
          <div>Caricamento categorie...</div>
        ) : (
          <CategoryList>
            {categories.map(category => (
              <CategoryChip
                key={category.id}
                selected={selectedCategories.includes(category.id)}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </CategoryChip>
            ))}
          </CategoryList>
        )}
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Periodo</FilterLabel>
        <DateFilter>
          <div>
            <label htmlFor="start-date">Da:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label htmlFor="end-date">A:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        </DateFilter>
      </FilterGroup>

      <div style={{ display: 'flex', gap: '10px' }}>
        <ApplyButton onClick={handleApplyFilters}>
          Applica Filtri
        </ApplyButton>
        <button 
          onClick={resetFilters}
          style={{ 
            padding: '10px', 
            borderRadius: '4px',
            cursor: 'pointer',
            background: '#f1f1f1',
            border: 'none',
            flexGrow: isMobile ? 0 : 1
          }}
        >
          Reset
        </button>
      </div>
    </FilterContainer>
  );
};

export default FilterPanel;
