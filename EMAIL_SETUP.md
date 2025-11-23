# Email Setup Instructions

The contact form is currently configured to use **FormSubmit** which works immediately. For a more reliable solution, set up **EmailJS** (free).

## Quick Setup with EmailJS (Recommended)

1. **Create a free account** at [https://www.emailjs.com](https://www.emailjs.com)

2. **Add an Email Service:**
   - Go to "Email Services" → "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Follow the setup instructions
   - Copy your **Service ID**

3. **Create an Email Template:**
   - Go to "Email Templates" → "Create New Template"
   - Use this template:
     ```
     From: {{from_name}} <{{from_email}}>
     To: {{to_email}}
     Subject: Contact Form - {{from_name}}
     
     Name: {{from_name}}
     Email: {{from_email}}
     Organization: {{organization}}
     
     Message:
     {{message}}
     ```
   - Copy your **Template ID**

4. **Get your Public Key:**
   - Go to "Account" → "General"
   - Copy your **Public Key**

5. **Create `.env` file** in the root directory:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

6. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Current Setup (FormSubmit)

The form currently uses FormSubmit which sends emails directly to `globaltimespanel@gmail.com` without any setup. This should work immediately, but EmailJS is more reliable for production use.

## Testing

After setup, test the form by:
1. Filling out all fields
2. Clicking "Send Message"
3. Checking your email inbox at `globaltimespanel@gmail.com`

