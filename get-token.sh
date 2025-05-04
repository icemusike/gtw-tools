#!/bin/bash

# This script gets an access token from GoToWebinar using an authorization code

# Check if auth code was provided
if [ -z "$1" ]; then
  echo "Error: Authorization code is required."
  echo "Usage: ./get-token.sh YOUR_AUTHORIZATION_CODE"
  exit 1
fi

# Your credentials (replace with your actual values if needed)
CLIENT_ID="3610573d-7761-482c-94bf-5f8a4e92"
CLIENT_SECRET="C3iBwJuGpFRpzQzrp4zVfkuO"
REDIRECT_URI="https://gtw-tools.vercel.app/oauth-callback"
AUTH_CODE="$1"

# Create Basic Auth header
AUTH_STRING="${CLIENT_ID}:${CLIENT_SECRET}"
AUTH_ENCODED=$(echo -n "${AUTH_STRING}" | base64)

echo "Making request to GoToWebinar API for access token..."
echo "Using Authorization Code: ${AUTH_CODE}"

# Execute curl command
RESPONSE=$(curl -s -X POST "https://authentication.logmeininc.com/oauth/token" \
  -H "Authorization: Basic ${AUTH_ENCODED}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "redirect_uri=${REDIRECT_URI}&grant_type=authorization_code&code=${AUTH_CODE}")

# Extract important values
ACCESS_TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')
REFRESH_TOKEN=$(echo $RESPONSE | grep -o '"refresh_token":"[^"]*' | sed 's/"refresh_token":"//')
ORGANIZER_KEY=$(echo $RESPONSE | grep -o '"organizer_key":"[^"]*' | sed 's/"organizer_key":"//')

if [ -n "$ACCESS_TOKEN" ]; then
  echo "Success! Access token obtained:"
  echo ""
  echo "Access Token: $ACCESS_TOKEN"
  echo "Refresh Token: $REFRESH_TOKEN"
  echo "Organizer Key: $ORGANIZER_KEY"
  echo ""
  echo "Add these to your Vercel environment variables:"
  echo "GTW_ACCESS_TOKEN=$ACCESS_TOKEN"
  echo "GTW_REFRESH_TOKEN=$REFRESH_TOKEN"
  echo "GTW_ORGANIZER_KEY=$ORGANIZER_KEY"
else
  echo "Error obtaining access token. Response:"
  echo $RESPONSE
fi 