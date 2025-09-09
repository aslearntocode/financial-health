# Firebase Authentication Setup Guide

## Issues Fixed

I've identified and fixed several issues with your Firebase authentication setup:

### 1. **Missing Environment Variables**
- Created fallback values in `lib/firebase.ts` to prevent crashes
- You need to create a `.env.local` file with your actual Firebase credentials

### 2. **Inconsistent Firebase Imports**
- Standardized all Firebase imports to use `@/lib/firebase`
- Fixed import path in `LoginModal.tsx`

### 3. **Missing AuthProvider**
- Added `AuthProvider` to `app/layout.tsx` to wrap the entire app
- This ensures authentication state is available throughout the app

### 4. **Enhanced Error Handling**
- Added specific error messages for different authentication failures
- Added loading states and better user feedback

## Setup Instructions

### Step 1: Create Environment Variables

Create a `.env.local` file in your project root with your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id

# Supabase Configuration (if using)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 2: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app icon (`</>`) or add a new web app
6. Copy the configuration values to your `.env.local` file

### Step 3: Enable Google Authentication

1. In Firebase Console, go to Authentication
2. Click on "Sign-in method" tab
3. Enable "Google" provider
4. Add your domain to authorized domains if needed

### Step 4: Test Authentication

1. Visit `/test-auth` to test the authentication flow
2. Try logging in with Google
3. Check if the user information is displayed correctly

## Files Modified

- `app/layout.tsx` - Added AuthProvider wrapper
- `app/components/LoginModal.tsx` - Fixed imports and enhanced error handling
- `lib/firebase.ts` - Added fallback values for missing env vars
- `app/test-auth/page.tsx` - Created test page for authentication

## Common Issues and Solutions

### 1. "Firebase: Error (auth/invalid-api-key)"
- Make sure your `.env.local` file has the correct API key
- Restart your development server after adding environment variables

### 2. "Popup blocked by browser"
- Allow popups for your domain in browser settings
- Try using a different browser or incognito mode

### 3. "Network request failed"
- Check your internet connection
- Verify Firebase project is active and not suspended

### 4. "Auth domain not authorized"
- Add your domain to authorized domains in Firebase Console
- For local development, add `localhost` to authorized domains

## Testing

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/test-auth`
3. Click "Test Login" to open the login modal
4. Try signing in with Google
5. Verify that user information is displayed after successful login

## Next Steps

Once authentication is working:

1. Remove the test page (`app/test-auth/page.tsx`) if not needed
2. Update your main pages to use the `useAuth` hook
3. Add logout functionality to your header component
4. Implement protected routes for authenticated users only

## Support

If you're still experiencing issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Test with a fresh browser session or incognito mode
