import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaCog, FaBell, FaUserCircle } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarToggle = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary);
    background-color: var(--gray-100);
  }
`;

const NavbarBrand = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-left: 1rem;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const NavbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NavbarAction = styled.button`
  color: var(--gray-600);
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: var(--primary);
    background-color: var(--gray-100);
  }
`;

const SettingsLink = styled(Link)`
  color: var(--gray-600);
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary);
    background-color: var(--gray-100);
    text-decoration: none;
  }
`;

const NavbarProfile = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  margin-left: 0.75rem;
  border-left: 1px solid var(--gray-200);
  
  svg {
    font-size: 2rem;
    color: var(--gray-500);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
`;

const Navbar = ({ toggleSidebar }) => {
  return (
    <NavbarContainer>
      <NavbarLeft>
        <NavbarToggle onClick={toggleSidebar} aria-label="Toggle sidebar">
          <FaBars />
        </NavbarToggle>
        <NavbarBrand>
          GTW Tools
        </NavbarBrand>
      </NavbarLeft>
      
      <NavbarActions>
        <NavbarAction aria-label="Notifications">
          <FaBell />
        </NavbarAction>
        <SettingsLink to="/settings" aria-label="Settings">
          <FaCog />
        </SettingsLink>
        <NavbarProfile>
          <FaUserCircle />
        </NavbarProfile>
      </NavbarActions>
    </NavbarContainer>
  );
};

export default Navbar;
