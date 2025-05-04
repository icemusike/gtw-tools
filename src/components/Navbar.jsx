import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaSignOutAlt, FaCog } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--gray-300);
`;

const NavbarBrand = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
`;

const NavbarToggle = styled.button`
  background: none;
  border: none;
  color: var(--gray-700);
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--primary);
  }
`;

const NavbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavbarAction = styled(Link)`
  color: var(--gray-700);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--primary);
    text-decoration: none;
  }
`;

const Navbar = ({ toggleSidebar }) => {
  return (
    <NavbarContainer>
      <NavbarToggle onClick={toggleSidebar}>
        <FaBars />
      </NavbarToggle>
      
      <NavbarBrand>
        GoToWebinar Sender
      </NavbarBrand>
      
      <NavbarActions>
        <NavbarAction to="/settings">
          <FaCog />
          <span className="d-none d-md-inline">Settings</span>
        </NavbarAction>
      </NavbarActions>
    </NavbarContainer>
  );
};

export default Navbar;
