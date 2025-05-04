import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaVideo, FaCog, FaUsers, FaPaperPlane, FaExternalLinkAlt, FaCalendarAlt, FaPlayCircle, FaChartBar, FaChartLine, FaChartPie, FaArrowRight } from 'react-icons/fa';
import { getWebinars } from '../api/webinars';
import { getSettings } from '../api/settings';

const DashboardContainer = styled.div`
  margin-bottom: 2rem;
`;

const DashboardHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
`;

const WelcomeText = styled.p`
  color: var(--gray-600);
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 1.75rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid var(--gray-100);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    border-color: var(--gray-200);
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: ${props => {
    switch(props.type) {
      case 'primary': return 'rgba(79, 70, 229, 0.1)';
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(79, 70, 229, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'primary': return 'var(--primary)';
      case 'success': return 'var(--secondary)';
      case 'danger': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1.25rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--gray-900);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 500;
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
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 1.75rem;
  border: 1px solid var(--gray-100);
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  color: var(--gray-900);
  font-weight: 600;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: var(--primary);
  }
`;

const WebinarList = styled.div`
  display: grid;
  gap: 1rem;
`;

const WebinarCard = styled(Link)`
  display: block;
  padding: 1.25rem;
  border-radius: 10px;
  background-color: var(--white);
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    text-decoration: none;
    transform: translateX(4px);
  }
`;

const WebinarTitle = styled.h3`
  font-size: 0.95rem;
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
  margin-top: 0.75rem;
  
  svg {
    margin-right: 0.375rem;
    font-size: 0.75rem;
  }
`;

const WebinarStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status) {
      case 'SCHEDULED': return 'rgba(79, 70, 229, 0.1)';
      case 'LIVE': return 'rgba(16, 185, 129, 0.1)';
      case 'COMPLETED': return 'rgba(107, 114, 128, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'SCHEDULED': return 'var(--primary)';
      case 'LIVE': return 'var(--secondary)';
      case 'COMPLETED': return 'var(--gray-600)';
      default: return 'var(--gray-600)';
    }
  }};
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  background-color: var(--white);
  border: 1px solid var(--gray-200);
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  text-decoration: none;
  color: var(--gray-800);
  font-size: 0.9375rem;
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    border-color: var(--primary-light);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    text-decoration: none;
    transform: translateX(4px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: var(--primary);
    font-size: 1.125rem;
  }
`;

const ActionArrow = styled.div`
  color: var(--gray-400);
  transition: all 0.2s;
  
  ${ActionButton}:hover & {
    color: var(--primary);
    transform: translateX(3px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
`;

const EmptyStateText = styled.p`
  color: var(--gray-600);
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
  max-width: 300px;
`;

const EmptyStateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: var(--primary);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
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

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--primary);
  margin-top: 1.25rem;
  transition: all 0.2s;
  
  svg {
    margin-left: 0.375rem;
    font-size: 0.8125rem;
    transition: transform 0.2s;
  }
  
  &:hover {
    text-decoration: none;
    color: var(--primary-dark);
    
    svg {
      transform: translateX(3px);
    }
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
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <WelcomeText>Welcome back! Today is {formattedDate}</WelcomeText>
        </div>
      </DashboardHeader>
      
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
            <FaChartBar />
            Recent Webinars
          </SectionTitle>
          
          {webinars.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FaVideo />
              </EmptyStateIcon>
              <EmptyStateText>No webinars found in your account.</EmptyStateText>
              <EmptyStateButton to="/webinars">
                Browse Webinars <FaArrowRight />
              </EmptyStateButton>
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
              
              <div className="text-right">
                <ViewAllLink to="/webinars">
                  View All Webinars <FaArrowRight />
                </ViewAllLink>
              </div>
            </>
          )}
        </SectionCard>
        
        <SectionCard>
          <SectionTitle>
            <FaChartLine />
            Quick Actions
          </SectionTitle>
          
          <ActionButton to="/webinars">
            <ActionIcon>
              <FaVideo />
              Browse Webinars
            </ActionIcon>
            <ActionArrow>
              <FaArrowRight />
            </ActionArrow>
          </ActionButton>
          
          {liveWebinars > 0 && (
            <ActionButton to={`/webinars/${webinars.find(w => w.status === 'LIVE')?.webinarKey}`}>
              <ActionIcon>
                <FaPaperPlane />
                Send Messages
              </ActionIcon>
              <ActionArrow>
                <FaArrowRight />
              </ActionArrow>
            </ActionButton>
          )}
          
          <ActionButton to="/settings">
            <ActionIcon>
              <FaCog />
              Configure Settings
            </ActionIcon>
            <ActionArrow>
              <FaArrowRight />
            </ActionArrow>
          </ActionButton>
        </SectionCard>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
