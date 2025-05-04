import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import { getWebinars } from '../api/webinars';

const WebinarsContainer = styled.div`
  margin-bottom: 2rem;
`;

const WebinarsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.25);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
`;

const WebinarCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const WebinarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const WebinarTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const WebinarStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'SCHEDULED': return 'var(--info)';
      case 'LIVE': return 'var(--success)';
      case 'COMPLETED': return 'var(--secondary)';
      default: return 'var(--gray-500)';
    }
  }};
  color: white;
  margin-left: 0.5rem;
`;

const WebinarDetails = styled.div`
  margin-bottom: 1rem;
`;

const WebinarDetail = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const WebinarDetailLabel = styled.span`
  font-weight: 500;
  width: 100px;
  color: var(--gray-700);
`;

const WebinarDetailValue = styled.span`
  color: var(--gray-900);
`;

const WebinarActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const WebinarAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--primary);
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
  
  svg {
    margin-left: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const EmptyStateMessage = styled.p`
  color: var(--gray-600);
  margin-bottom: 1.5rem;
`;

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [filteredWebinars, setFilteredWebinars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const data = await getWebinars();
        setWebinars(data);
        setFilteredWebinars(data);
      } catch (error) {
        console.error('Error fetching webinars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebinars();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWebinars(webinars);
    } else {
      const filtered = webinars.filter(webinar => 
        webinar.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWebinars(filtered);
    }
  }, [searchTerm, webinars]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
        <p className="ml-3">Loading webinars...</p>
      </div>
    );
  }
  
  return (
    <WebinarsContainer>
      <WebinarsHeader>
        <h1>Webinars</h1>
        
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search webinars..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
      </WebinarsHeader>
      
      {filteredWebinars.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No webinars found</EmptyStateTitle>
          <EmptyStateMessage>
            {webinars.length === 0 
              ? "You don't have any webinars in your GoToWebinar account." 
              : "No webinars match your search criteria."}
          </EmptyStateMessage>
        </EmptyState>
      ) : (
        filteredWebinars.map(webinar => (
          <WebinarCard key={webinar.webinarKey}>
            <WebinarHeader>
              <WebinarTitle>
                {webinar.subject}
                <WebinarStatus status={webinar.status}>{webinar.status}</WebinarStatus>
              </WebinarTitle>
            </WebinarHeader>
            
            <WebinarDetails>
              <WebinarDetail>
                <WebinarDetailLabel>Date:</WebinarDetailLabel>
                <WebinarDetailValue>
                  {webinar.times && webinar.times[0] 
                    ? new Date(webinar.times[0].startTime).toLocaleString() 
                    : 'No date specified'}
                </WebinarDetailValue>
              </WebinarDetail>
              
              <WebinarDetail>
                <WebinarDetailLabel>Duration:</WebinarDetailLabel>
                <WebinarDetailValue>
                  {webinar.times && webinar.times[0] 
                    ? `${Math.round(webinar.times[0].durationInMinutes)} minutes` 
                    : 'Not specified'}
                </WebinarDetailValue>
              </WebinarDetail>
              
              <WebinarDetail>
                <WebinarDetailLabel>Key:</WebinarDetailLabel>
                <WebinarDetailValue>{webinar.webinarKey}</WebinarDetailValue>
              </WebinarDetail>
            </WebinarDetails>
            
            <WebinarActions>
              <WebinarAction to={`/webinars/${webinar.webinarKey}`}>
                View Details <FaExternalLinkAlt />
              </WebinarAction>
            </WebinarActions>
          </WebinarCard>
        ))
      )}
    </WebinarsContainer>
  );
};

export default Webinars;
