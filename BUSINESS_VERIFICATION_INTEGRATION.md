# Business Verification Integration Guide

## Overview
The business verification flow has been integrated into your authentication system. After a user logs in or signs up, if they are not an admin, they will be redirected to verify their business details.

## Components Created

### 1. BusinessVerification Component
**Location**: `src/components/businessVerification/businessVerification.jsx`

A reusable form component with the following fields:
- Business Information: businessName, businessDescription, businessId, roleId
- Contact Information: phoneNumber, address
- Social Media Links: socialMediaLinks

Features:
- Form validation on all fields
- Phone number format validation
- Error/success handling
- Responsive design
- Built with Ant Design (matches your project)

### 2. BusinessVerificationContainer
**Location**: `src/containers/businessVerification.jsx`

Manages the complete business verification flow:
- Retrieves pending user data from cookies
- Handles form submission
- Calls API to submit verification details
- Redirects to appropriate dashboard after verification
- Handles session expiration

### 3. Business Verification API
**Location**: `src/components/server/businessVerification.js`

Provides three API functions:
- `submitBusinessVerification()` - Submit new verification
- `getBusinessVerificationStatus()` - Check verification status
- `updateBusinessVerification()` - Update existing verification

## How It Works

### Login Flow
1. User logs in via Login component
2. Server validates credentials and returns user data
3. If user is **NOT admin**:
   - User data is stored in `pending_user_data` cookie
   - User is redirected to `/businessVerification`
   - BusinessVerificationContainer loads and displays the form
4. User fills out business details
5. On submission:
   - Verification data is sent to backend
   - User is redirected to first accessible route
   - `pending_user_data` cookie is cleared

### Signup Flow
Same as login flow - all new users (except admins) must verify their business.

## Configuration Required

### 1. Update Routes
Add the following route to your main routing file (likely `src/App.jsx` or `src/main.jsx`):

```jsx
import BusinessVerificationContainer from './containers/businessVerification';

// In your routes configuration:
{
  path: '/businessVerification',
  element: <BusinessVerificationContainer />,
  // Optionally wrap with ProtectedRoute if needed
}
```

### 2. Update Config
Add the business verification endpoint to your config file:

```javascript
// In src/config.js
export default {
  // ... existing config
  businessVerification: 'https://your-api.com/api/business/verify',
  // Or use apiBaseURL as fallback:
  apiBaseURL: 'https://your-api.com/api'
}
```

### 3. Update Constants (Optional)
Add translation key to `src/utlis/constant.js`:

```javascript
export const PLEASE_VERIFY_BUSINESS = "PLEASE_VERIFY_BUSINESS";
```

## Admin Detection
The system checks if a user is admin by examining `rolePermission`:
```javascript
rolePermission.role?.toLowerCase() === 'admin' || 
rolePermission.name?.toLowerCase() === 'admin'
```

Adjust this logic if your role naming convention differs.

## Backend API Contract

The backend should accept a POST request at:
```
POST /api/business/verify
```

Request body:
```json
{
  "userId": "string",
  "businessName": "string",
  "businessDescription": "string",
  "businessId": "string",
  "roleId": "string",
  "phoneNumber": "string",
  "address": "string",
  "socialMediaLinks": "string (multiple links separated by newlines)"
}
```

Expected response:
```json
{
  "success": true,
  "message": "Business verification submitted successfully",
  "data": { ... }
}
```

## Styling
The BusinessVerification component includes responsive styling for:
- Desktop: Full-width form with proper spacing
- Tablet: Optimized for mid-size screens
- Mobile: Compact layout with adjusted font sizes

## Future Enhancements
- Add email verification step
- Add document upload for business proof
- Add admin review/approval process
- Add verification status tracking dashboard
- Add resubmission capability if rejected
