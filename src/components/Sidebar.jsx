import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaVideo, FaCog, FaTachometerAlt } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: var(--white);
  color: var(--gray-700);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transition: all 0.3s ease;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  z-index: 1000;
  box-shadow: var(--shadow-lg);
  border-right: 1px solid var(--gray-200);
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  background: linear-gradient(to right, var(--primary), var(--primary-dark));
  color: white;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  
  svg {
    color: var(--primary);
    font-size: 20px;
  }
`;

const SidebarTitle = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
`;

const SidebarSubtitle = styled.p`
  font-size: 0.75rem;
  margin: 0.25rem 0 0;
  opacity: 0.8;
`;

const SidebarNav = styled.nav`
  padding: 1.5rem 0;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: var(--gray-700);
  transition: all 0.2s;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  margin: 0.25rem 0.75rem;
  border-radius: 8px;
  
  &:hover {
    background-color: var(--gray-100);
    color: var(--primary);
    text-decoration: none;
  }
  
  &.active {
    background-color: var(--primary);
    color: white;
    box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);
  }
  
  &.active svg {
    color: white;
  }
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.1rem;
    color: var(--gray-500);
  }
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--gray-200);
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: var(--white);
`;

const SidebarVersion = styled.p`
  font-size: 0.75rem;
  color: var(--gray-500);
  margin: 0;
`;

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <LogoContainer>
          <Logo>
            <FaVideo />
          </Logo>
          <div>
            <SidebarTitle>GTW Tools</SidebarTitle>
            <SidebarSubtitle>Webinar & Affiliate Manager</SidebarSubtitle>
          </div>
        </LogoContainer>
      </SidebarHeader>
      
      <SidebarNav>
        <SidebarLink to="/" end>
          <FaTachometerAlt />
          Dashboard
        </SidebarLink>
        <SidebarLink to="/webinars">
          <FaVideo />
          Webinars
        </SidebarLink>
        <SidebarLink to="/settings">
          <FaCog />
          Settings
        </SidebarLink>
      </SidebarNav>
      
      <SidebarFooter>
        <SidebarVersion>Version 1.0.1</SidebarVersion>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
