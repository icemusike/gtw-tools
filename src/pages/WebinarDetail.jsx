import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaPaperPlane, FaUser, FaUsers, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getWebinarDetails, getAttendees, sendMessagesToAll } from '../api/webinars';
import { getSettings } from '../api/settings';

const WebinarDetailContainer = styled.div`
  margin-bottom: 2rem;
`;

const WebinarHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.875rem;
  cursor: pointer;
  margin-right: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const WebinarTitle = styled.h1`
  margin: 0;
  flex: 1;
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

const WebinarInfo = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const WebinarInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const WebinarInfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const WebinarInfoLabel = styled.span`
  font-size: 0.75rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
`;

const WebinarInfoValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

const WebinarDescription = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-200);
`;

const WebinarDescriptionLabel = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const WebinarDescriptionContent = styled.p`
  font-size: 0.875rem;
  color: var(--gray-700);
  white-space: pre-line;
`;

const WebinarActions = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const WebinarActionsTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const MessageForm = styled.form`
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.25);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.25);
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
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
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const AttendeesSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const AttendeesSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AttendeesSectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const AttendeeCount = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: var(--gray-100);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const AttendeesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const AttendeesTableHead = styled.thead`
  background-color: var(--gray-100);
`;

const AttendeesTableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
`;

const AttendeesTableBody = styled.tbody``;

const AttendeesTableRow = styled.tr`
  border-bottom: 1px solid var(--gray-200);
  
  &:hover {
    background-color: var(--gray-50);
  }
`;

const AttendeesTableCell = styled.td`
  padding: 0.75rem;
  font-size: 0.875rem;
`;

const ResultsSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
`;

const ResultsSummary = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ResultsStat = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--gray-100);
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const WebinarDetail = () => {
  const { webinarKey } = useParams();
  const navigate = useNavigate();
  
  const [webinar, setWebinar] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [settings, setSettings] = useState({});
  const [messageTemplate, setMessageTemplate] = useState('');
  const [defaultAffiliateId, setDefaultAffiliateId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [webinarData, attendeesData, settingsData] = await Promise.all([
          getWebinarDetails(webinarKey),
          getAttendees(webinarKey),
          getSettings()
        ]);
        
        setWebinar(webinarData);
        setAttendees(attendeesData);
        setSettings(settingsData);
        setMessageTemplate(settingsData.messageTemplate || 'Here is your personal checkout link: {{checkoutLink}}');
        setDefaultAffiliateId(settingsData.defaultAffiliateId || 'default');
      } catch (error) {
        console.error('Error fetching webinar details:', error);
        toast.error('Failed to load webinar details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [webinarKey]);
  
  const handleBack = () => {
    navigate('/webinars');
  };
  
  const handleSendMessages = async (e) => {
    e.preventDefault();
    
    if (!messageTemplate.includes('{{checkoutLink}}')) {
      toast.error('Message template must include {{checkoutLink}} placeholder');
      return;
    }
    
    if (!webinar.times || webinar.times.length === 0) {
      toast.error('No session found for this webinar');
      return;
    }
    
    const sessionKey = webinar.times[0].sessionKey;
    
    setIsSending(true);
    
    try {
      const results = await sendMessagesToAll(
        webinarKey,
        sessionKey,
        messageTemplate,
        defaultAffiliateId
      );
      
      setResults(results);
      toast.success(`Successfully sent ${results.success} messages`);
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error('Failed to send messages');
    } finally {
      setIsSending(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
        <p className="ml-3">Loading webinar details...</p>
      </div>
    );
  }
  
  if (!webinar) {
    return (
      <div className="text-center p-4">
        <h2>Webinar not found</h2>
        <button className="btn btn-primary mt-3" onClick={handleBack}>
          Back to Webinars
        </button>
      </div>
    );
  }
  
  const isLive = webinar.status === 'LIVE';
  const startTime = webinar.times && webinar.times[0] 
    ? new Date(webinar.times[0].startTime) 
    : null;
  
  return (
    <WebinarDetailContainer>
      <WebinarHeader>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back
        </BackButton>
        <WebinarTitle>
          {webinar.subject}
          <WebinarStatus status={webinar.status}>{webinar.status}</WebinarStatus>
        </WebinarTitle>
      </WebinarHeader>
      
      <WebinarInfo>
        <WebinarInfoGrid>
          <WebinarInfoItem>
            <WebinarInfoLabel>Date</WebinarInfoLabel>
            <WebinarInfoValue>
              {startTime ? startTime.toLocaleDateString() : 'Not specified'}
            </WebinarInfoValue>
          </WebinarInfoItem>
          
          <WebinarInfoItem>
            <WebinarInfoLabel>Time</WebinarInfoLabel>
            <WebinarInfoValue>
              {startTime ? startTime.toLocaleTimeString() : 'Not specified'}
            </WebinarInfoValue>
          </WebinarInfoItem>
          
          <WebinarInfoItem>
            <WebinarInfoLabel>Duration</WebinarInfoLabel>
            <WebinarInfoValue>
              {webinar.times && webinar.times[0] 
                ? `${Math.round(webinar.times[0].durationInMinutes)} minutes` 
                : 'Not specified'}
            </WebinarInfoValue>
          </WebinarInfoItem>
          
          <WebinarInfoItem>
            <WebinarInfoLabel>Webinar Key</WebinarInfoLabel>
            <WebinarInfoValue>{webinar.webinarKey}</WebinarInfoValue>
          </WebinarInfoItem>
        </WebinarInfoGrid>
        
        {webinar.description && (
          <WebinarDescription>
            <WebinarDescriptionLabel>Description</WebinarDescriptionLabel>
            <WebinarDescriptionContent>{webinar.description}</WebinarDescriptionContent>
          </WebinarDescription>
        )}
      </WebinarInfo>
      
      {isLive && (
        <WebinarActions>
          <WebinarActionsTitle>Send Messages to Attendees</WebinarActionsTitle>
          
          <MessageForm onSubmit={handleSendMessages}>
            <FormGroup>
              <FormLabel htmlFor="messageTemplate">Message Template</FormLabel>
              <FormTextarea 
                id="messageTemplate"
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                placeholder="Enter your message template. Use {{checkoutLink}} as a placeholder for the personalized checkout link."
                required
              />
              <small className="text-muted">
                Include {{checkoutLink}} where you want the personalized checkout link to appear.
              </small>
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="defaultAffiliateId">Default Affiliate ID</FormLabel>
              <FormInput 
                id="defaultAffiliateId"
                value={defaultAffiliateId}
                onChange={(e) => setDefaultAffiliateId(e.target.value)}
                placeholder="Enter default affiliate ID for attendees without one"
                required
              />
              <small className="text-muted">
                This will be used for attendees who don't have an affiliate ID in their registration data.
              </small>
            </FormGroup>
            
            <SendButton type="submit" disabled={isSending || attendees.length === 0}>
              {isSending ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send to All Attendees ({attendees.length})
                </>
              )}
            </SendButton>
          </MessageForm>
          
          {results && (
            <ResultsSection>
              <h3 className="mb-3">Results</h3>
              
              <ResultsSummary>
                <ResultsStat>
                  <FaUsers />
                  Total: {results.total}
                </ResultsStat>
                
                <ResultsStat style={{ color: 'var(--success)' }}>
                  <FaCheck />
                  Successful: {results.success}
                </ResultsStat>
                
                {results.failed > 0 && (
                  <ResultsStat style={{ color: 'var(--danger)' }}>
                    <FaTimes />
                    Failed: {results.failed}
                  </ResultsStat>
                )}
              </ResultsSummary>
            </ResultsSection>
          )}
        </WebinarActions>
      )}
      
      <AttendeesSection>
        <AttendeesSectionHeader>
          <AttendeesSectionTitle>Attendees</AttendeesSectionTitle>
          <AttendeeCount>
            <FaUsers />
            {attendees.length} {attendees.length === 1 ? 'Attendee' : 'Attendees'}
          </AttendeeCount>
        </AttendeesSectionHeader>
        
        {attendees.length === 0 ? (
          <p>No attendees found for this webinar.</p>
        ) : (
          <AttendeesTable>
            <AttendeesTableHead>
              <tr>
                <AttendeesTableHeaderCell>Name</AttendeesTableHeaderCell>
                <AttendeesTableHeaderCell>Email</AttendeesTableHeaderCell>
                <AttendeesTableHeaderCell>Join Time</AttendeesTableHeaderCell>
                <AttendeesTableHeaderCell>Status</AttendeesTableHeaderCell>
              </tr>
            </AttendeesTableHead>
            <AttendeesTableBody>
              {attendees.map(attendee => (
                <AttendeesTableRow key={attendee.registrantKey}>
                  <AttendeesTableCell>
                    {attendee.firstName} {attendee.lastName}
                  </AttendeesTableCell>
                  <AttendeesTableCell>{attendee.email}</AttendeesTableCell>
                  <AttendeesTableCell>
                    {attendee.joinTime ? new Date(attendee.joinTime).toLocaleString() : 'N/A'}
                  </AttendeesTableCell>
                  <AttendeesTableCell>
                    {attendee.status === 'ACTIVE' ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-secondary">{attendee.status || 'Unknown'}</span>
                    )}
                  </AttendeesTableCell>
                </AttendeesTableRow>
              ))}
            </AttendeesTableBody>
          </AttendeesTable>
        )}
      </AttendeesSection>
    </WebinarDetailContainer>
  );
};

export default WebinarDetail;
