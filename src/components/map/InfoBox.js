import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../styles/Colors';

const InfoTitle = styled.h3`
  color: ${COLORS.secondary};
  font-size: 16px;
  margin: 0 0 10px 0;
  font-weight: bold;
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 10px 0;
  color: ${COLORS.text};
`;

const InfoHighlight = styled.span`
  color: ${COLORS.secondary};
  font-weight: bold;
`;


const InfoContainer = styled.div`
  position: absolute;
  bottom: 90px; // Alzato per essere sopra il banner (era 20px)
  left: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 280px;
  z-index: 1000;
  display: ${props => props.isMobile ? 'none' : 'block'};
  
  @media (max-width: 768px) {
    bottom: 80px; // Adatta per mobile
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #666;
  }
`;

const InfoBox = ({ isMobile }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Non rendiamo nulla se non è visibile o è mobile
  if (!isVisible || isMobile) {
    return null;
  }
  
  return (
    <InfoContainer>
      <CloseButton onClick={() => setIsVisible(false)}>✕</CloseButton>
      <InfoTitle>Cerca tra tutti gli eventi in arrivo nella tua zona</InfoTitle>
      <InfoText>
        Con Finday puoi scoprire tra <InfoHighlight>centinaia di eventi</InfoHighlight> divisi per zona e categoria
      </InfoText>
      <InfoText>
        <InfoHighlight>Usa i filtri per trovare eventi vicino a te</InfoHighlight> 
      </InfoText>
    </InfoContainer>
  );
};

export default InfoBox;
