// src/components/common/AdBanner.js
import React from 'react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid #e0e0e0;
  z-index: 1800; // Sotto la sidebar (2000) ma sopra la mappa e altri controlli
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;


const AdPlaceholder = styled.div`
  width: 100%;
  max-width: 728px; // Dimensione standard per banner orizzontali
  height: 90%;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const AdBanner = ({ isVisible = true }) => {
  if (!isVisible) return null;
  
  return (
    <BannerContainer>
      <AdPlaceholder>
        Spazio riservato per banner pubblicitario
      </AdPlaceholder>
    </BannerContainer>
  );
};

export default AdBanner;
