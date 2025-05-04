import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaVideo, FaCog, FaUsers, FaPaperPlane } from 'react-icons/fa';
import { getWebinars } from '../api/webinars';
import { getSettings } from '../api/settings';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => `var(--${props.color})`};
  color: white;
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
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--gray-600);
`;

const RecentWebinars = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--gray-800);
`;

const WebinarList = styled.div`
  display: grid;
  gap: 1rem;
`;

const WebinarCard = styled(Link)`
  display: block;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid var(--gray-200);
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-decoration: none;
  }
`;

const WebinarTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const WebinarDate = styled.div`
  font-size: 0.875rem;
  color: var(--gray-600);
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

const QuickActions = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid var(--gray-200);
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
  
  &:hover {
    border-color: var(--primary);
    background-color: var(--gray-100);
    text-decoration: none;
  }
  
  svg {
    margin-right: 0.75rem;
    color: var(--primary);
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
    <div>
      <h1 className="mb-4">Dashboard</h1>
      
      <DashboardGrid>
        <StatCard>
          <StatIcon color="primary">
            <FaVideo />
          </StatIcon>
          <StatContent>
            <StatValue>{webinars.length}</StatValue>
            <StatLabel>Total Webinars</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon color="success">
            <FaVideo />
          </StatIcon>
          <StatContent>
            <StatValue>{upcomingWebinars}</StatValue>
            <StatLabel>Upcoming Webinars</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon color="danger">
            <FaVideo />
          </StatIcon>
          <StatContent>
            <StatValue>{liveWebinars}</StatValue>
            <StatLabel>Live Now</StatLabel>
          </StatContent>
        </StatCard>
      </DashboardGrid>
      
      <div className="grid grid-cols-2 gap-4">
        <RecentWebinars>
          <SectionTitle>Recent Webinars</SectionTitle>
          
          {webinars.length === 0 ? (
            <p>No webinars found.</p>
          ) : (
            <WebinarList>
              {webinars.slice(0, 5).map(webinar => (
                <WebinarCard key={webinar.webinarKey} to={`/webinars/${webinar.webinarKey}`}>
                  <WebinarTitle>
                    {webinar.subject}
                    <WebinarStatus status={webinar.status}>{webinar.status}</WebinarStatus>
                  </WebinarTitle>
                  <WebinarDate>
                    {webinar.times && webinar.times[0] ? 
                      new Date(webinar.times[0].startTime).toLocaleString() : 'No date specified'}
                  </WebinarDate>
                </WebinarCard>
              ))}
            </WebinarList>
          )}
          
          <div className="text-right mt-3">
            <Link to="/webinars" className="btn btn-outline">View All Webinars</Link>
          </div>
        </RecentWebinars>
        
        <QuickActions>
          <SectionTitle>Quick Actions</SectionTitle>
          
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
        </QuickActions>
      </div>
    </div>
  );
};

export default Dashboard;
