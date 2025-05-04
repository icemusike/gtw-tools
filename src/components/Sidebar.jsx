import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaVideo, FaCog, FaPaperPlane } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: var(--white);
  color: var(--gray-700);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transition: transform 0.3s;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-right: 1px solid var(--gray-200);
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
`;

const SidebarTitle = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  color: var(--primary);
  font-weight: 700;
`;

const SidebarSubtitle = styled.p`
  font-size: 0.875rem;
  margin: 0.5rem 0 0;
  color: var(--gray-500);
`;

const SidebarNav = styled.nav`
  padding: 1.5rem 0;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--gray-700);
  transition: all 0.2s;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    background-color: var(--gray-50);
    color: var(--primary);
    text-decoration: none;
  }
  
  &.active {
    background-color: var(--gray-100);
    color: var(--primary);
    border-left: 3px solid var(--primary);
  }
  
  svg {
    margin-right: 0.75rem;
    font-size: 1rem;
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
        <SidebarTitle>GoToWebinar Sender</SidebarTitle>
        <SidebarSubtitle>Affiliate Link Manager</SidebarSubtitle>
      </SidebarHeader>
      
      <SidebarNav>
        <SidebarLink to="/" end>
          <FaHome />
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
        <SidebarVersion>Version 1.0.0</SidebarVersion>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
