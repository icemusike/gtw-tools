import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1rem;
`;

const NotFoundIcon = styled.div`
  font-size: 4rem;
  color: var(--warning);
  margin-bottom: 1.5rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const NotFoundMessage = styled.p`
  font-size: 1.125rem;
  color: var(--gray-600);
  max-width: 500px;
  margin: 0 auto 2rem;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundIcon>
        <FaExclamationTriangle />
      </NotFoundIcon>
      <NotFoundTitle>404 - Page Not Found</NotFoundTitle>
      <NotFoundMessage>
        The page you are looking for doesn't exist or has been moved.
      </NotFoundMessage>
      <HomeButton to="/">
        <FaHome />
        Back to Dashboard
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;
