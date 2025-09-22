# Firebase Setup Guide for SightReadPro 🔥

This guide will walk you through setting up Firebase for authentication and database functionality in your SightReadPro app.

## Prerequisites 📋

- Google account
- Firebase project (we'll create one)
- React Native development environment

## Step 1: Create Firebase Project 🚀

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "sightreadpro-app")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Authentication 🔐

1. In your Firebase project, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable it and click "Save"
6. Optionally, you can also enable other providers like Google Sign-In

## Step 3: Set Up Firestore Database 🗄️

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (we'll secure it later)
4. Select a location closest to your users
5. Click "Done"

## Step 4: Configure Firestore Security Rules 🔒

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access to exercises (if you add them later)
    match /exercises/{exerciseId} {
      allow read: if true;
      allow write: if false; // Only admins can modify exercises
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Firebase Configuration 🔑

1. In your Firebase project, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "SightReadPro Web")
6. Click "Register app"
7. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## Step 6: Update Your App Configuration 📱

1. Open `src/config/firebase.ts` in your SightReadPro project
2. Replace the placeholder config with your actual Firebase config:

```typescript
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

## Step 7: Test Your Setup ✅

1. Start your React Native app
2. Try to create a new account
3. Check Firebase Console > Authentication > Users to see if the user was created
4. Check Firebase Console > Firestore Database to see if the user profile was created

## Step 8: Production Considerations 🚀

### Update Security Rules
Before going to production, update your Firestore rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /exercises/{exerciseId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Enable Additional Security Features
1. **Authentication**: Enable email verification
2. **Firestore**: Set up proper indexes for queries
3. **App Check**: Enable App Check for additional security
4. **Monitoring**: Set up Firebase Performance Monitoring

## Troubleshooting 🔧

### Common Issues

**"Firebase: Error (auth/invalid-api-key)"**
- Verify your API key in the config
- Check if the API key is restricted in Google Cloud Console

**"Firebase: Error (auth/network-request-failed)"**
- Check your internet connection
- Verify Firebase project is active
- Check if your IP is whitelisted (if restrictions are enabled)

**"Firestore: Missing or insufficient permissions"**
- Check your Firestore security rules
- Ensure the user is authenticated
- Verify the user ID matches the document path

**"Firebase: Error (auth/too-many-requests)"**
- You've hit the Firebase free tier limits
- Consider upgrading to a paid plan

### Testing Authentication

You can test authentication in Firebase Console:
1. Go to Authentication > Users
2. Click "Add user" to manually create test accounts
3. Use these accounts to test your app

### Testing Firestore

1. Go to Firestore Database > Data
2. Manually add test documents
3. Verify your app can read/write to the database

## Additional Firebase Services (Optional) 🌟

### Cloud Functions
- Create serverless functions for complex operations
- Handle user analytics and reporting
- Process exercise completion data

### Cloud Storage
- Store audio recordings of performances
- Save user-generated content
- Host exercise media files

### Analytics
- Track user engagement
- Monitor app performance
- Understand user behavior

### Crashlytics
- Monitor app crashes
- Get detailed crash reports
- Improve app stability

## Support Resources 📚

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Community](https://firebase.google.com/community)
- [Stack Overflow Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)

## Next Steps 🚀

After setting up Firebase:
1. Test the authentication flow
2. Verify user profiles are created in Firestore
3. Test the XP and progress tracking
4. Consider implementing additional Firebase services
5. Set up monitoring and analytics

---

**Need help?** Check the troubleshooting section above or create an issue in the project repository.


