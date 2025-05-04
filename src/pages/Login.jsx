import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAuthUrl, exchangeCodeForToken } from '../api/auth';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--gray-50);
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  text-align: center;
`;

const LoginHeader = styled.div`
  margin-bottom: 2rem;
`;

const LoginLogo = styled.div`
  width: 72px;
  height: 72px;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
`;

const LoginTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
`;

const LoginDescription = styled.p`
  color: var(--gray-600);
  font-size: 0.95rem;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 0.75rem;
  }
`;

const LoginFooter = styled.div`
  margin-top: 2rem;
  color: var(--gray-500);
  font-size: 0.875rem;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 0.75rem;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Login = ({ setIsAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        const { url } = await getAuthUrl();
        setAuthUrl(url);
      } catch (error) {
        console.error('Error fetching auth URL:', error);
        toast.error('Failed to initialize login. Please try again.');
      }
    };
    
    fetchAuthUrl();
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      handleCodeExchange(code);
    }
  }, [location]);
  
  const handleCodeExchange = async (code) => {
    setIsLoading(true);
    
    try {
      await exchangeCodeForToken(code);
      toast.success('Login successful');
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = authUrl;
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginLogo>
            <FaLock />
          </LoginLogo>
          <LoginTitle>GTW Tools</LoginTitle>
          <LoginDescription>
            Manage your GoToWebinar webinars and send personalized checkout links to attendees
          </LoginDescription>
        </LoginHeader>
        
        <LoginButton onClick={handleLogin} disabled={isLoading || !authUrl}>
          {isLoading ? (
            <>
              <LoadingSpinner />
              Authenticating...
            </>
          ) : (
            <>
              <FaExternalLinkAlt />
              Login with GoToWebinar
            </>
          )}
        </LoginButton>
        
        <LoginFooter>
          This application requires GoToWebinar authorization to function.
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
