# How to Get a Valid GoToWebinar Access Token

This guide will help you get a valid access token for the GoToWebinar API. The `InvalidToken` error you're experiencing is because your access token has expired or is invalid.

## Method 1: Using the App's Login Flow (Easiest)

1. Go to your deployed app at https://gtw-tools.vercel.app
2. Click on "Login with GoToWebinar"
3. Authorize the application when prompted
4. You'll be redirected back to your app. Look in your browser console (F12) to see the authorization code and token response
5. Copy these values into your Vercel environment variables

## Method 2: Using the PowerShell Script

1. First, get an authorization code by visiting this URL in your browser:
   ```
   https://api.getgo.com/oauth/v2/authorize?client_id=3610573d-7761-482c-94bf-5f8a4e92&response_type=code&redirect_uri=https://gtw-tools.vercel.app/oauth-callback
   ```

2. After you authorize, you'll be redirected to a URL that looks like:
   ```
   https://gtw-tools.vercel.app/oauth-callback?code=YOUR_AUTH_CODE
   ```

3. Copy the value of `YOUR_AUTH_CODE` from the URL

4. Run the PowerShell script with your authorization code:
   ```powershell
   .\get-token.ps1 YOUR_AUTH_CODE
   ```

5. The script will output your access token, refresh token, and organizer key

6. Update your Vercel environment variables with these values:
   - `GTW_ACCESS_TOKEN`
   - `GTW_REFRESH_TOKEN`
   - `GTW_ORGANIZER_KEY`

## Method 3: Using cURL

You can also use cURL to get an access token:

```bash
curl -X POST "https://authentication.logmeininc.com/oauth/token" \
  -H "Authorization: Basic MzYxMDU3M2QtNzc2MS00ODJjLTk0YmYtNWY4YTRlOTIrOkMzaUJ3SnVHcEZScHpRenJwNHpWZmt1Tw==" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "redirect_uri=https://gtw-tools.vercel.app/oauth-callback&grant_type=authorization_code&code=YOUR_AUTH_CODE"
```

Replace `YOUR_AUTH_CODE` with the actual authorization code.

## Important Notes

- Access tokens expire after a certain period (usually a few hours)
- When you get a new access token, also store the refresh token
- The app is set up to use the refresh token to get a new access token when needed
- Make sure all these values are set in your Vercel environment variables:
  - `GTW_CLIENT_ID`
  - `GTW_CLIENT_SECRET`
  - `GTW_ACCESS_TOKEN`
  - `GTW_REFRESH_TOKEN`
  - `GTW_ORGANIZER_KEY`
  - `GTW_REDIRECT_URI`
  - `BASE_CHECKOUT_URL` 