import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import OAuthCallback from './pages/OAuthCallback';

// API
import { checkAuthStatus, refreshToken } from './api/auth';

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
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated, accessTokenLength } = await checkAuthStatus();
        
        if (authenticated && accessTokenLength > 0) {
          setIsAuthenticated(true);
        } else {
          // If we have a refresh token, try to refresh
          try {
            const refreshResult = await refreshToken();
            if (refreshResult.success) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
              navigate('/login');
            }
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            setIsAuthenticated(false);
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Don't run the auth check if we're on the oauth-callback path
    if (!location.pathname.includes('oauth-callback')) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [navigate, location]);

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

  // If on the oauth-callback path, show the OAuthCallback component
  if (location.pathname.includes('oauth-callback')) {
    return <OAuthCallback />;
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
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/webinars" element={isAuthenticated ? <Webinars /> : <Navigate to="/login" />} />
          <Route path="/webinars/:webinarKey" element={isAuthenticated ? <WebinarDetail /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
};

export default App;
