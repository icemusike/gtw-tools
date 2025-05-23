import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// GoToWebinar API endpoints
const AUTH_URL = 'https://authentication.logmeininc.com/oauth/token';
const API_BASE = 'https://api.getgo.com/G2W/rest/v2';

// App configuration
const appConfig = {
  clientId: process.env.GTW_CLIENT_ID,
  clientSecret: process.env.GTW_CLIENT_SECRET,
  redirectUri: process.env.GTW_REDIRECT_URI || 'https://gtw-tools.vercel.app/oauth-callback',
  baseCheckoutUrl: process.env.BASE_CHECKOUT_URL || 'https://example.com/checkout'
};

// In-memory storage for tokens (in production, use a proper database)
let tokenStore = {
  accessToken: process.env.GTW_ACCESS_TOKEN || null,
  refreshToken: process.env.GTW_REFRESH_TOKEN || null,
  organizerKey: process.env.GTW_ORGANIZER_KEY || null
};

// Log environment variable status
console.log('Environment variables status:');
console.log('- GTW_CLIENT_ID available:', !!process.env.GTW_CLIENT_ID);
console.log('- GTW_CLIENT_SECRET available:', !!process.env.GTW_CLIENT_SECRET);
console.log('- GTW_ACCESS_TOKEN available:', !!process.env.GTW_ACCESS_TOKEN);
console.log('- GTW_ORGANIZER_KEY available:', !!process.env.GTW_ORGANIZER_KEY);

// Initialize token store
console.log('Token store initialized:');
console.log('- Access token available:', !!tokenStore.accessToken);
console.log('- Refresh token available:', !!tokenStore.refreshToken);
console.log('- Organizer key available:', !!tokenStore.organizerKey);

// Load tokens from file if exists (for local development)
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const tokenPath = join(__dirname, '.tokens.json');
  if (fs.existsSync(tokenPath)) {
    tokenStore = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  }
} catch (error) {
  console.error('Error loading tokens:', error);
}

// Save tokens to file (for local development)
function saveTokens() {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const tokenPath = join(__dirname, '.tokens.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokenStore), 'utf8');
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
}

// Settings storage
let settings = {
  messageTemplate: 'Here is your personal checkout link: {{checkoutLink}}',
  defaultAffiliateId: 'default',
  baseCheckoutUrl: process.env.BASE_CHECKOUT_URL || 'https://example.com/checkout'
};

// Load settings from file if exists (for local development)
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const settingsPath = join(__dirname, '.settings.json');
  if (fs.existsSync(settingsPath)) {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  }
} catch (error) {
  console.error('Error loading settings:', error);
}

// Save settings to file (for local development)
function saveSettings() {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const settingsPath = join(__dirname, '.settings.json');
    fs.writeFileSync(settingsPath, JSON.stringify(settings), 'utf8');
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// OAuth callback route
app.get('/oauth-callback', (req, res) => {
  const code = req.query.code;
  
  if (!code) {
    return res.status(400).send('Authorization code is required');
  }
  
  console.log('Received authorization code:', code);
  
  // Send an HTML page that displays the code
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authorization Code</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .code-box {
          background-color: #f5f5f5;
          border-radius: 4px;
          padding: 15px;
          margin: 20px 0;
          overflow-wrap: break-word;
          word-break: break-all;
        }
        .btn {
          display: inline-block;
          background-color: #4f46e5;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <h1>Authorization Code Received</h1>
      <p>Your authorization code has been successfully generated:</p>
      <div class="code-box">
        <code>${code}</code>
      </div>
      <p>Copy this code and use it to get your access token with the get-token.ps1 script.</p>
      <a href="/" class="btn">Continue to Application</a>
      <script>
        console.log('Authorization Code:', '${code}');
      </script>
    </body>
    </html>
  `);
});

// API Routes

// Get auth URL
app.get('/api/auth-url', (req, res) => {
  const authUrl = `https://api.getgo.com/oauth/v2/authorize?client_id=${appConfig.clientId}&response_type=code&redirect_uri=${encodeURIComponent(appConfig.redirectUri)}`;
  res.json({ url: authUrl });
});

// Exchange code for token
app.post('/api/auth/token', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }
  
  try {
    const response = await axios({
      method: 'post',
      url: AUTH_URL,
      params: {
        grant_type: 'authorization_code',
        code: code,
        client_id: appConfig.clientId,
        redirect_uri: appConfig.redirectUri
      },
      auth: {
        username: appConfig.clientId,
        password: appConfig.clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    tokenStore.accessToken = response.data.access_token;
    tokenStore.refreshToken = response.data.refresh_token;
    tokenStore.organizerKey = response.data.organizer_key;
    
    saveTokens();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    res.status(401).json({ error: 'Authentication failed', details: error.response?.data || error.message });
  }
});

// Refresh token
app.post('/api/auth/refresh', async (req, res) => {
  if (!tokenStore.refreshToken) {
    return res.status(401).json({ error: 'No refresh token available' });
  }
  
  try {
    const response = await axios({
      method: 'post',
      url: AUTH_URL,
      params: {
        grant_type: 'refresh_token',
        refresh_token: tokenStore.refreshToken,
        client_id: appConfig.clientId
      },
      auth: {
        username: appConfig.clientId,
        password: appConfig.clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    tokenStore.accessToken = response.data.access_token;
    tokenStore.refreshToken = response.data.refresh_token;
    tokenStore.organizerKey = response.data.organizer_key;
    
    saveTokens();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    res.status(401).json({ error: 'Token refresh failed', details: error.response?.data || error.message });
  }
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
  const accessTokenAvailable = !!tokenStore.accessToken;
  console.log('Auth status check:');
  console.log('- Access token available:', accessTokenAvailable);
  console.log('- Organizer key:', tokenStore.organizerKey);

  res.json({ 
    authenticated: accessTokenAvailable,
    organizerKey: tokenStore.organizerKey,
    accessTokenStart: accessTokenAvailable ? tokenStore.accessToken.substring(0, 15) + '...' : null,
    accessTokenLength: accessTokenAvailable ? tokenStore.accessToken.length : 0
  });
});

// Get webinars
app.get('/api/webinars', async (req, res) => {
  if (!tokenStore.accessToken) {
    return res.status(401).json({ error: 'Not authenticated', message: 'No access token available' });
  }
  
  try {
    console.log(`Making request to GTW API with organizerKey: ${tokenStore.organizerKey.substring(0, 8)}...`);
    console.log(`Access token starts with: ${tokenStore.accessToken.substring(0, 15)}...`);
    
    const response = await axios.get(`${API_BASE}/organizers/${tokenStore.organizerKey}/webinars`, {
      headers: {
        'Authorization': `Bearer ${tokenStore.accessToken}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching webinars:', error.message);
    console.error('Response details:', error.response?.data);
    
    // Check if it's an auth error and try to refresh
    if (error.response?.status === 401 && tokenStore.refreshToken) {
      try {
        console.log('Attempting to refresh token...');
        await refreshToken();
        
        // Retry the request
        const response = await axios.get(`${API_BASE}/organizers/${tokenStore.organizerKey}/webinars`, {
          headers: {
            'Authorization': `Bearer ${tokenStore.accessToken}`
          }
        });
        
        return res.json(response.data);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.message);
        return res.status(401).json({ 
          error: 'Authentication failed after refresh attempt', 
          details: refreshError.message,
          originalError: error.message
        });
      }
    }
    
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch webinars', 
      details: error.response?.data || error.message,
      statusCode: error.response?.status
    });
  }
});

// Get webinar details
app.get('/api/webinars/:webinarKey', async (req, res) => {
  if (!tokenStore.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { webinarKey } = req.params;
  
  try {
    const response = await axios.get(`${API_BASE}/organizers/${tokenStore.organizerKey}/webinars/${webinarKey}`, {
      headers: {
        'Authorization': `Bearer ${tokenStore.accessToken}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch webinar details', 
      details: error.response?.data || error.message 
    });
  }
});

// Get attendees
app.get('/api/webinars/:webinarKey/attendees', async (req, res) => {
  if (!tokenStore.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { webinarKey } = req.params;
  
  try {
    const response = await axios.get(`${API_BASE}/organizers/${tokenStore.organizerKey}/webinars/${webinarKey}/attendees`, {
      headers: {
        'Authorization': `Bearer ${tokenStore.accessToken}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch attendees', 
      details: error.response?.data || error.message 
    });
  }
});

// Get registrant details
app.get('/api/webinars/:webinarKey/registrants/:registrantKey', async (req, res) => {
  if (!tokenStore.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { webinarKey, registrantKey } = req.params;
  
  try {
    const response = await axios.get(
      `${API_BASE}/organizers/${tokenStore.organizerKey}/webinars/${webinarKey}/registrants/${registrantKey}`, 
      {
        headers: {
          'Authorization': `Bearer ${tokenStore.accessToken}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch registrant details', 
      details: error.response?.data || error.message 
    });
  }
});

// Send message
app.post('/api/webinars/:webinarKey/sessions/:sessionKey/attendees/:registrantKey/message', async (req, res) => {
  if (!tokenStore.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { webinarKey, sessionKey, registrantKey } = req.params;
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    await axios.post(
      `${API_BASE}/organizers/${tokenStore.organizerKey}/webinars/${webinarKey}/sessions/${sessionKey}/attendees/${registrantKey}/chats`, 
      { message },
      {
        headers: {
          'Authorization': `Bearer ${tokenStore.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to send message', 
      details: error.response?.data || error.message 
    });
  }
});

// Send messages to all attendees
app.post('/api/webinars/:webinarKey/sessions/:sessionKey/messages', async (req, res) => {
  if (!tokenStore.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { webinarKey, sessionKey } = req.params;
  const { messageTemplate, defaultAffiliateId } = req.body;
  
  if (!messageTemplate) {
    return res.status(400).json({ error: 'Message template is required' });
  }
  
  try {
    // Get attendees
    const attendeesResponse = await axios.get(
      `${API_BASE}/organizers/${tokenStore.organizerKey}/webinars/${webinarKey}/attendees`, 
      {
        headers: {
          'Authorization': `Bearer ${tokenStore.accessToken}`
        }
      }
    );
    
    const attendees = attendeesResponse.data;
    const results = [];
    
    // Process each attendee
    for (const attendee of attendees) {
      try {
        // Get registrant details
        const registrantResponse = await axios.get(
          `${API_BASE}/organizers/${tokenStore.organizerKey}/webinars/${webinarKey}/registrants/${attendee.registrantKey}`, 
          {
            headers: {
              'Authorization': `Bearer ${tokenStore.accessToken}`
            }
          }
        );
        
        // Extract affiliate ID
        let affiliateId = defaultAffiliateId;
        
        if (registrantResponse.data.questions) {
          const affiliateQuestion = registrantResponse.data.questions.find(q => 
            q.question.toLowerCase().includes('affiliate') || 
            q.question.toLowerCase().includes('referral')
          );
          
          if (affiliateQuestion && affiliateQuestion.answer) {
            affiliateId = affiliateQuestion.answer;
          }
        }
        
        // Create personalized checkout link
        const email = attendee.email.toLowerCase();
        const checkoutLink = `${settings.baseCheckoutUrl}?aid=${affiliateId}&email=${encodeURIComponent(email)}`;
        
        // Create personalized message
        const personalizedMessage = messageTemplate.replace('{{checkoutLink}}', checkoutLink);
        
        // Send message
        await axios.post(
          `${API_BASE}/organizers/${tokenStore.organizerKey}/webinars/${webinarKey}/sessions/${sessionKey}/attendees/${attendee.registrantKey}/chats`, 
          { message: personalizedMessage },
          {
            headers: {
              'Authorization': `Bearer ${tokenStore.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        results.push({
          email: attendee.email,
          affiliateId,
          status: 'success'
        });
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        results.push({
          email: attendee.email,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    res.json({
      total: attendees.length,
      success: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to send messages', 
      details: error.response?.data || error.message 
    });
  }
});

// Get settings
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

// Update settings
app.post('/api/settings', (req, res) => {
  const { messageTemplate, defaultAffiliateId, baseCheckoutUrl } = req.body;
  
  if (messageTemplate) {
    settings.messageTemplate = messageTemplate;
  }
  
  if (defaultAffiliateId) {
    settings.defaultAffiliateId = defaultAffiliateId;
  }
  
  if (baseCheckoutUrl) {
    settings.baseCheckoutUrl = baseCheckoutUrl;
  }
  
  saveSettings();
  
  res.json({ success: true, settings });
});

// Helper function to refresh token
async function refreshToken() {
  const response = await axios({
    method: 'post',
    url: AUTH_URL,
    params: {
      grant_type: 'refresh_token',
      refresh_token: tokenStore.refreshToken,
      client_id: appConfig.clientId
    },
    auth: {
      username: appConfig.clientId,
      password: appConfig.clientSecret
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  tokenStore.accessToken = response.data.access_token;
  tokenStore.refreshToken = response.data.refresh_token;
  tokenStore.organizerKey = response.data.organizer_key;
  
  saveTokens();
}

// Debug endpoint to check token status
app.get('/api/debug/token', (req, res) => {
  res.json({
    hasAccessToken: !!tokenStore.accessToken,
    accessTokenPrefix: tokenStore.accessToken ? tokenStore.accessToken.substring(0, 20) + '...' : null,
    hasRefreshToken: !!tokenStore.refreshToken,
    organizerKey: tokenStore.organizerKey,
    clientId: appConfig.clientId ? appConfig.clientId.substring(0, 10) + '...' : 'undefined',
    clientSecret: appConfig.clientSecret ? 'present (hidden)' : 'undefined',
    envVars: {
      GTW_CLIENT_ID: process.env.GTW_CLIENT_ID ? 'present' : 'undefined',
      GTW_CLIENT_SECRET: process.env.GTW_CLIENT_SECRET ? 'present' : 'undefined',
      GTW_ACCESS_TOKEN: process.env.GTW_ACCESS_TOKEN ? 'present' : 'undefined',
      GTW_ORGANIZER_KEY: process.env.GTW_ORGANIZER_KEY ? 'present' : 'undefined'
    }
  });
});

// Serve static files from the frontend build directory
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, 'dist')));

// For any other request, send the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
