// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
`;

const NotFoundTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #f39c12;
`;

const NotFoundText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 600px;
`;

const HomeButton = styled(Link)`
  background-color: #f39c12;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e67e22;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404 - Pagina non trovata</NotFoundTitle>
      <NotFoundText>
        La pagina che stai cercando non esiste o è stata spostata.
      </NotFoundText>
      <HomeButton to="/">Torna alla mappa</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
