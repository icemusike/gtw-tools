import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaCog, FaLink, FaUserTag, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSettings, updateSettings } from '../api/settings';

const SettingsContainer = styled.div`
  margin-bottom: 2rem;
`;

const PageHeader = styled.div`
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

const PageDescription = styled.p`
  color: var(--gray-600);
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
`;

const SettingsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--gray-100);
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
`;

const SettingsIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 10px;
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
  font-size: 1.25rem;
  margin-right: 1rem;
`;

const SettingsTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
`;

const FormGroup = styled.div`
  margin-bottom: 1.75rem;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--gray-700);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.875rem;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.95rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

const FormHelp = styled.small`
  display: block;
  margin-top: 0.5rem;
  color: var(--gray-600);
  font-size: 0.75rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  
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

const SaveSuccess = styled.span`
  display: flex;
  align-items: center;
  color: var(--secondary);
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 1rem;
  
  svg {
    margin-right: 0.375rem;
  }
`;

const Settings = () => {
  const [settings, setSettings] = useState({
    messageTemplate: '',
    defaultAffiliateId: '',
    baseCheckoutUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings({
          messageTemplate: data.messageTemplate || 'Here is your personal checkout link: {{checkoutLink}}',
          defaultAffiliateId: data.defaultAffiliateId || 'default',
          baseCheckoutUrl: data.baseCheckoutUrl || process.env.BASE_CHECKOUT_URL || 'https://example.com/checkout'
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset success state when form is changed
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Fix for the checkoutLink reference error
      if (!settings.messageTemplate.includes('{{checkoutLink}}')) {
        toast.error('Message template must include {{checkoutLink}} placeholder');
        return;
      }
      
      setIsSaving(true);
      
      await updateSettings(settings);
      setSaveSuccess(true);
      toast.success('Settings saved successfully');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
        <p className="ml-3">Loading settings...</p>
      </div>
    );
  }
  
  return (
    <SettingsContainer>
      <PageHeader>
        <div>
          <PageTitle>Settings</PageTitle>
          <PageDescription>Configure your webinar message settings</PageDescription>
        </div>
      </PageHeader>
      
      <form onSubmit={handleSubmit}>
        <SettingsCard>
          <SettingsHeader>
            <SettingsIcon type="primary">
              <FaCog />
            </SettingsIcon>
            <SettingsTitle>Message Settings</SettingsTitle>
          </SettingsHeader>
          
          <FormGroup>
            <FormLabel htmlFor="messageTemplate">Message Template</FormLabel>
            <FormTextarea 
              id="messageTemplate"
              name="messageTemplate"
              value={settings.messageTemplate}
              onChange={handleChange}
              placeholder="Enter your message template"
              required
            />
            <FormHelp>
              Include {{checkoutLink}} where you want the personalized checkout link to appear.
            </FormHelp>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="defaultAffiliateId">Default Affiliate ID</FormLabel>
            <FormInput 
              id="defaultAffiliateId"
              name="defaultAffiliateId"
              value={settings.defaultAffiliateId}
              onChange={handleChange}
              placeholder="Enter default affiliate ID"
              required
            />
            <FormHelp>
              This will be used for attendees who don't have an affiliate ID in their registration data.
            </FormHelp>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="baseCheckoutUrl">Base Checkout URL</FormLabel>
            <FormInput 
              id="baseCheckoutUrl"
              name="baseCheckoutUrl"
              value={settings.baseCheckoutUrl}
              onChange={handleChange}
              placeholder="Enter base checkout URL"
              required
            />
            <FormHelp>
              The base URL for checkout links. Affiliate ID and email will be appended as query parameters.
            </FormHelp>
          </FormGroup>
        </SettingsCard>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {saveSuccess && (
            <SaveSuccess>
              <FaCheckCircle /> Settings saved successfully
            </SaveSuccess>
          )}
          <SaveButton type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave />
                Save Settings
              </>
            )}
          </SaveButton>
        </div>
      </form>
    </SettingsContainer>
  );
};

export default Settings;
