import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaClipboard, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const CallbackContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--gray-50);
  padding: 1rem;
`;

const CallbackCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const CodeContainer = styled.div`
  background-color: var(--gray-100);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  text-align: left;
  overflow-wrap: break-word;
  word-break: break-all;
`;

const Code = styled.code`
  font-family: monospace;
  font-size: 1rem;
  color: var(--gray-800);
`;

const CopyButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--gray-100);
    border-color: var(--gray-400);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Steps = styled.ol`
  text-align: left;
  margin-bottom: 2rem;
  padding-left: 1.5rem;
`;

const Step = styled.li`
  margin-bottom: 0.75rem;
  color: var(--gray-700);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
  
  svg {
    margin-left: 0.5rem;
  }
`;

const OAuthCallback = () => {
  const location = useLocation();
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authCode = params.get('code');
    
    if (authCode) {
      setCode(authCode);
      console.log('Authorization Code:', authCode);
    }
  }, [location]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <CallbackContainer>
      <CallbackCard>
        <Title>Authorization Code Received</Title>
        <Subtitle>
          Your authorization code has been successfully generated. Use this code to get your access token.
        </Subtitle>
        
        {code ? (
          <CodeContainer>
            <Code>{code}</Code>
            <CopyButton onClick={handleCopy} title="Copy to clipboard">
              {copied ? <FaCheckCircle color="green" /> : <FaClipboard />}
            </CopyButton>
          </CodeContainer>
        ) : (
          <CodeContainer>
            <Code>No authorization code found in the URL</Code>
          </CodeContainer>
        )}
        
        <Steps>
          <Step>Copy the authorization code shown above.</Step>
          <Step>Run the PowerShell script with this code: <br/><code>.\get-token.ps1 -AuthCode "{code}"</code></Step>
          <Step>Update your Vercel environment variables with the returned values.</Step>
        </Steps>
        
        <ButtonContainer>
          <Button to="/">
            Continue to Dashboard <FaArrowRight />
          </Button>
        </ButtonContainer>
      </CallbackCard>
    </CallbackContainer>
  );
};

export default OAuthCallback; 