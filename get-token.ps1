# PowerShell script to get an access token from GoToWebinar using an authorization code

# Check if auth code was provided
param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$AuthCode
)

# Your credentials (replace with your actual values if needed)
$clientId = "3610573d-7761-482c-94bf-5f8a4e92"
$clientSecret = "C3iBwJuGpFRpzQzrp4zVfkuO"
$redirectUri = "https://gtw-tools.vercel.app/oauth-callback"

# Create Basic Auth header
$authString = "$($clientId):$($clientSecret)"
$authBytes = [System.Text.Encoding]::UTF8.GetBytes($authString)
$authEncoded = [System.Convert]::ToBase64String($authBytes)

Write-Host "Making request to GoToWebinar API for access token..."
Write-Host "Using Authorization Code: $AuthCode"

# Prepare request parameters
$headers = @{
    Authorization = "Basic $authEncoded"
    Accept = "application/json"
    "Content-Type" = "application/x-www-form-urlencoded"
}

$body = "redirect_uri=$redirectUri&grant_type=authorization_code&code=$AuthCode"

# Execute request
try {
    $response = Invoke-RestMethod -Uri "https://authentication.logmeininc.com/oauth/token" -Method Post -Headers $headers -Body $body

    Write-Host "`nSuccess! Access token obtained:`n"
    Write-Host "Access Token: $($response.access_token)"
    Write-Host "Refresh Token: $($response.refresh_token)"
    Write-Host "Organizer Key: $($response.organizer_key)"
    Write-Host "`nAdd these to your Vercel environment variables:"
    Write-Host "GTW_ACCESS_TOKEN=$($response.access_token)"
    Write-Host "GTW_REFRESH_TOKEN=$($response.refresh_token)"
    Write-Host "GTW_ORGANIZER_KEY=$($response.organizer_key)"
} catch {
    Write-Host "Error obtaining access token. Response:"
    Write-Host $_.Exception.Message
    Write-Host $_.Exception.Response.StatusCode
    
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
} 