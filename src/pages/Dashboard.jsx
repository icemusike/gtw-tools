import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaVideo, FaCog, FaUsers, FaPaperPlane, FaExternalLinkAlt, FaCalendarAlt, FaPlayCircle } from 'react-icons/fa';
import { getWebinars } from '../api/webinars';
import { getSettings } from '../api/settings';

const DashboardContainer = styled.div`
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-100);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props => {
    switch(props.type) {
      case 'primary': return '#eff6ff';
      case 'success': return '#ecfdf5';
      case 'danger': return '#fef2f2';
      default: return '#eff6ff';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'primary': return '#3b82f6';
      case 'success': return '#10b981';
      case 'danger': return '#ef4444';
      default: return '#3b82f6';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--gray-900);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--gray-600);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid var(--gray-100);
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: 1.25rem;
  color: var(--gray-900);
  font-weight: 600;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary);
  }
`;

const WebinarList = styled.div`
  display: grid;
  gap: 1rem;
`;

const WebinarCard = styled(Link)`
  display: block;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--gray-200);
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    border-color: var(--primary-light);
    background-color: var(--gray-50);
    text-decoration: none;
    transform: translateX(3px);
  }
`;

const WebinarTitle = styled.h3`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WebinarDate = styled.div`
  font-size: 0.75rem;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.375rem;
    font-size: 0.75rem;
  }
`;

const WebinarStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case 'SCHEDULED': return '#eff6ff';
      case 'LIVE': return '#ecfdf5';
      case 'COMPLETED': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'SCHEDULED': return '#1e40af';
      case 'LIVE': return '#065f46';
      case 'COMPLETED': return '#4b5563';
      default: return '#4b5563';
    }
  }};
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--gray-200);
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  text-decoration: none;
  color: var(--gray-800);
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    border-color: var(--primary-light);
    background-color: var(--gray-50);
    text-decoration: none;
    transform: translateX(3px);
  }
  
  svg {
    margin-right: 0.75rem;
    color: var(--primary);
    font-size: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
`;

const EmptyStateText = styled.p`
  color: var(--gray-500);
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  margin-top: 1rem;
  
  svg {
    margin-left: 0.25rem;
    font-size: 0.75rem;
  }
  
  &:hover {
    text-decoration: none;
    color: var(--primary-dark);
  }
`;

const Dashboard = () => {
  const [webinars, setWebinars] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [webinarsData, settingsData] = await Promise.all([
          getWebinars(),
          getSettings()
        ]);
        
        setWebinars(webinarsData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
        <p className="ml-3">Loading dashboard...</p>
      </div>
    );
  }
  
  // Count upcoming webinars
  const upcomingWebinars = webinars.filter(w => w.status === 'SCHEDULED').length;
  
  // Count live webinars
  const liveWebinars = webinars.filter(w => w.status === 'LIVE').length;
  
  return (
    <DashboardContainer>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <StatsGrid>
        <StatCard>
          <StatIcon type="primary">
            <FaVideo />
          </StatIcon>
          <StatContent>
            <StatValue>{webinars.length}</StatValue>
            <StatLabel>Total Webinars</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="success">
            <FaCalendarAlt />
          </StatIcon>
          <StatContent>
            <StatValue>{upcomingWebinars}</StatValue>
            <StatLabel>Upcoming Webinars</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon type="danger">
            <FaPlayCircle />
          </StatIcon>
          <StatContent>
            <StatValue>{liveWebinars}</StatValue>
            <StatLabel>Live Now</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>
      
      <ContentGrid>
        <SectionCard>
          <SectionTitle>
            <FaVideo />
            Recent Webinars
          </SectionTitle>
          
          {webinars.length === 0 ? (
            <EmptyState>
              <EmptyStateText>No webinars found.</EmptyStateText>
              <Link to="/webinars" className="btn btn-primary">Browse Webinars</Link>
            </EmptyState>
          ) : (
            <>
              <WebinarList>
                {webinars.slice(0, 5).map(webinar => (
                  <WebinarCard key={webinar.webinarKey} to={`/webinars/${webinar.webinarKey}`}>
                    <WebinarTitle>
                      {webinar.subject}
                      <WebinarStatus status={webinar.status}>{webinar.status}</WebinarStatus>
                    </WebinarTitle>
                    <WebinarDate>
                      <FaCalendarAlt />
                      {webinar.times && webinar.times[0] ? 
                        new Date(webinar.times[0].startTime).toLocaleString() : 'No date specified'}
                    </WebinarDate>
                  </WebinarCard>
                ))}
              </WebinarList>
              
              <div className="text-right mt-3">
                <ViewAllLink to="/webinars">
                  View All Webinars <FaExternalLinkAlt />
                </ViewAllLink>
              </div>
            </>
          )}
        </SectionCard>
        
        <SectionCard>
          <SectionTitle>
            <FaPaperPlane />
            Quick Actions
          </SectionTitle>
          
          <ActionButton to="/webinars">
            <FaVideo />
            Browse Webinars
          </ActionButton>
          
          {liveWebinars > 0 && (
            <ActionButton to={`/webinars/${webinars.find(w => w.status === 'LIVE')?.webinarKey}`}>
              <FaPaperPlane />
              Send Messages to Live Webinar
            </ActionButton>
          )}
          
          <ActionButton to="/settings">
            <FaCog />
            Configure Settings
          </ActionButton>
        </SectionCard>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
