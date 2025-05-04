import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getSettings, updateSettings } from '../api/settings';

const SettingsContainer = styled.div`
  margin-bottom: 2rem;
`;

const SettingsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
`;

const SettingsIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
`;

const SettingsTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.25);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 120, 215, 0.25);
  }
`;

const FormHelp = styled.small`
  display: block;
  margin-top: 0.25rem;
  color: var(--gray-600);
  font-size: 0.75rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
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

const Settings = () => {
  const [settings, setSettings] = useState({
    messageTemplate: '',
    defaultAffiliateId: '',
    baseCheckoutUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings({
          messageTemplate: data.messageTemplate || 'Here is your personal checkout link: {{checkoutLink}}',
          defaultAffiliateId: data.defaultAffiliateId || 'default',
          baseCheckoutUrl: data.baseCheckoutUrl || 'https://example.com/checkout'
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
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!settings.messageTemplate.includes('{{checkoutLink}}')) {
      toast.error('Message template must include {{checkoutLink}} placeholder');
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
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
      <h1 className="mb-4">Settings</h1>
      
      <form onSubmit={handleSubmit}>
        <SettingsCard>
          <SettingsHeader>
            <SettingsIcon>
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
        
        <div className="text-right">
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
