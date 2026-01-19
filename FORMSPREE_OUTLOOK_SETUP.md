# Formspree Outlook Email Setup

## Overview

Your contact form uses Formspree to send emails. To receive form submissions in your Outlook email, you need to configure Formspree to forward emails to your Outlook address.

## Current Configuration

- **Formspree Form ID:** `xeeegyek`
- **Display Email:** `rannegerodias@gmail.com` (shown on website)
- **Receiving Email:** Needs to be configured in Formspree dashboard

## Setup Steps

### 1. Access Formspree Dashboard

1. Go to [Formspree.io](https://formspree.io)
2. Log in to your account
3. Find your form with ID `xeeegyek`

### 2. Configure Email Forwarding

1. Click on your form (`xeeegyek`)
2. Go to **Settings** or **Notifications** tab
3. Find **Email Notifications** section
4. Add your Outlook email address:
   - **Email:** `your-outlook-email@outlook.com` (or `@hotmail.com`, `@live.com`)
   - **Enable:** Email notifications
   - **Save** changes

### 3. Verify Email (if required)

- Formspree may send a verification email to your Outlook address
- Click the verification link in the email
- This ensures emails are delivered correctly

### 4. Test the Form

1. Visit your portfolio: https://rannegerodias.com
2. Go to the "Save Point" (Contact) section
3. Fill out and submit the form
4. Check your Outlook inbox for the submission

## Alternative: Formspree Webhooks

If you prefer more control, you can also:

1. Set up a webhook in Formspree
2. Forward submissions to a custom endpoint
3. Process and forward to Outlook programmatically

## Email Format

Form submissions will include:
- **From:** Formspree (or your configured sender)
- **Subject:** "New message from [Name]"
- **Body:** 
  - Name
  - Email
  - Message content

## Troubleshooting

### Emails Not Arriving

1. **Check Spam/Junk folder** in Outlook
2. **Verify email address** in Formspree settings
3. **Check Formspree dashboard** for submission logs
4. **Verify form ID** is correct (`xeeegyek`)

### Form Not Submitting

1. Check browser console for errors
2. Verify Formspree form ID is correct
3. Check Formspree account limits (free tier has limits)

## Current Form Configuration

- **Form ID:** `xeeegyek`
- **Endpoint:** `https://formspree.io/f/xeeegyek`
- **Method:** POST
- **Content-Type:** application/json

## Security

- Formspree includes spam protection
- Rate limiting is enabled
- Submissions are logged in Formspree dashboard

---

**Note:** The email displayed on your website (`rannegerodias@gmail.com`) is for display purposes. Actual form submissions will be sent to the email configured in your Formspree dashboard.

