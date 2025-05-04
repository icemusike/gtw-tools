# GoToWebinar Private Message Sender

A production-ready CLI application to send private messages with personalized checkout links to GoToWebinar attendees. Each message includes a checkout link with the appropriate affiliate ID appended.

## Features

- ✅ Beautiful terminal interface with colors and formatting
- ✅ Extracts affiliate IDs directly from GoToWebinar registration data
- ✅ Persistent configuration with saved preferences
- ✅ OAuth token management with automatic refresh
- ✅ Interactive command-line interface
- ✅ Detailed progress reporting and results
- ✅ Command-based operation for easy automation

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your environment variables in the `.env` file:
   - `GTW_CLIENT_ID`: Your GoToWebinar OAuth client ID
   - `GTW_CLIENT_SECRET`: Your GoToWebinar OAuth client secret
   - `GTW_REDIRECT_URI`: Your OAuth redirect URI (typically http://localhost:3000/oauth-callback)
   - `BASE_CHECKOUT_URL`: Your base checkout URL (e.g., https://example.com/checkout)

3. Make the script executable (optional):
   ```
   chmod +x index.js
   ```

## Usage

### Basic Usage

Run the script:
```
npm start
```

### Commands

The application supports the following commands:

#### Send Messages

```
npm start send
```

Options:
- `-w, --webinar <key>`: Specify a webinar key directly
- `-t, --template <template>`: Use a specific message template
- `-d, --default-affiliate <id>`: Set the default affiliate ID
- `-y, --yes`: Skip confirmation prompts (useful for automation)

#### Configure Settings

```
npm start config
```

This interactive command allows you to configure:
- Base checkout URL
- Message template
- Default affiliate ID

#### Authenticate

```
npm start auth
```

Manually trigger the authentication process.

#### List Webinars

```
npm start list
```

Display a table of your upcoming webinars.

## Affiliate ID Integration

The application looks for affiliate IDs in the GoToWebinar registration data. To use this feature:

1. Add a custom question to your webinar registration form with "affiliate" or "referral" in the question text
2. When attendees register, they can provide their affiliate ID
3. The application will extract this information automatically

If no affiliate ID is found, the default affiliate ID will be used.

## Message Template

Your message template should include the `{{checkoutLink}}` placeholder, which will be replaced with the personalized checkout URL including the affiliate ID.

Example: "Here is your personal checkout link: {{checkoutLink}}"

## Affiliate Tracking

The script appends the affiliate ID to the checkout URL as the `aid` parameter and also includes the attendee's email. The resulting URL will look like:

```
https://example.com/checkout?aid=aff123&email=john.doe%40example.com
```

This allows you to track which affiliate should be credited for each sale.

## Automation

For automated use in scripts or scheduled tasks, use the `-y` flag to skip confirmation prompts:

```
npm start send -y
```

This will use the last selected webinar and saved settings.
