import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const AUTH_URL = 'https://authentication.logmeininc.com/oauth/token';

// Your credentials
const clientId = process.env.GTW_CLIENT_ID || '3610573d-7761-482c-94bf-5f8a4e92';
const clientSecret = process.env.GTW_CLIENT_SECRET || 'C3iBwJuGpFRpzQzrp4zVfkuO';
const redirectUri = process.env.GTW_REDIRECT_URI || 'https://gtw-tools.vercel.app/oauth-callback';

// Replace this with your actual authorization code
const authCode = process.argv[2]; // Pass the authorization code as a command line argument

if (!authCode) {
  console.error('Error: Authorization code is required. Run with: node get-token.js YOUR_AUTH_CODE');
  process.exit(1);
}

async function getAccessToken() {
  try {
    console.log('Making request to GoToWebinar API for access token...');
    console.log('Using client ID:', clientId);
    console.log('Using redirect URI:', redirectUri);
    
    const response = await axios({
      method: 'post',
      url: AUTH_URL,
      params: {
        grant_type: 'authorization_code',
        code: authCode,
        client_id: clientId,
        redirect_uri: redirectUri
      },
      auth: {
        username: clientId,
        password: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    
    console.log('\nSuccess! Access token obtained:\n');
    console.log('Access Token:', response.data.access_token);
    console.log('Refresh Token:', response.data.refresh_token);
    console.log('Organizer Key:', response.data.organizer_key);
    console.log('\nAdd these to your Vercel environment variables:');
    console.log('GTW_ACCESS_TOKEN=', response.data.access_token);
    console.log('GTW_REFRESH_TOKEN=', response.data.refresh_token);
    console.log('GTW_ORGANIZER_KEY=', response.data.organizer_key);
    
  } catch (error) {
    console.error('Error getting access token:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    console.error('Response data:', error.response?.data);
  }
}

getAccessToken(); 