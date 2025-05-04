import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAuthUrl, exchangeCodeForToken, checkAuthStatus } from '../api/auth';

const LoginContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LoginTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
`;

const LoginSubtitle = styled.p`
  color: var(--gray-600);
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const Login = ({ setIsAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for authorization code in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      handleAuthCode(code);
    }
  }, [location]);
  
  const handleAuthCode = async (code) => {
    setIsLoading(true);
    
    try {
      await exchangeCodeForToken(code);
      
      // Check if authentication was successful
      const { authenticated } = await checkAuthStatus();
      
      if (authenticated) {
        setIsAuthenticated(true);
        toast.success('Successfully authenticated with GoToWebinar!');
        navigate('/', { replace: true });
      } else {
        toast.error('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { url } = await getAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      toast.error('Failed to start authentication process. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>GoToWebinar Sender</LoginTitle>
          <LoginSubtitle>Sign in with your GoToWebinar account</LoginSubtitle>
        </LoginHeader>
        
        <LoginButton onClick={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
              <span className="ml-2">Authenticating...</span>
            </>
          ) : (
            <>
              <FaSignInAlt />
              Sign in with GoToWebinar
            </>
          )}
        </LoginButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
