import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Webinars from './pages/Webinars';
import WebinarDetail from './pages/WebinarDetail';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// API
import { checkAuthStatus } from './api/auth';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: 250px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: ${props => props.sidebarOpen ? '250px' : '0'};
    padding: 1.5rem;
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(79, 70, 229, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: var(--gray-700);
  font-size: 1rem;
  font-weight: 500;
`;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await checkAuthStatus();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code && location.pathname === '/') {
      // We'll handle this in the Login component
      setIsLoading(false);
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <LoadingScreen>
        <LoadingSpinner />
        <LoadingText>Loading your dashboard...</LoadingText>
      </LoadingScreen>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated && location.pathname !== '/login' && !location.search.includes('code=')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppContainer>
      {isAuthenticated && (
        <Sidebar isOpen={sidebarOpen} />
      )}
      
      <MainContent sidebarOpen={sidebarOpen}>
        {isAuthenticated && (
          <Navbar toggleSidebar={toggleSidebar} />
        )}
        
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/webinars/:webinarKey" element={<WebinarDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
};

export default App;
