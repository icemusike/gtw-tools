import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaVideo, FaCog, FaPaperPlane } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: var(--dark);
  color: var(--light);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transition: transform 0.3s;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  z-index: 1000;
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarTitle = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  color: white;
`;

const SidebarSubtitle = styled.p`
  font-size: 0.875rem;
  margin: 0.5rem 0 0;
  color: var(--gray-400);
`;

const SidebarNav = styled.nav`
  padding: 1.5rem 0;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--gray-400);
  transition: all 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  &.active {
    background-color: var(--primary);
    color: white;
  }
  
  svg {
    margin-right: 0.75rem;
  }
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: absolute;
  bottom: 0;
  width: 100%;
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
