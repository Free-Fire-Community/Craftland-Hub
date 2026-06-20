import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminAuth: Auth | undefined;

try {
  // Check if Firebase Admin is already initialized
  if (getApps().length === 0) {
    // Initialize Firebase Admin with service account
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccount) {
      try {
        const serviceAccountJson = JSON.parse(serviceAccount);
        adminApp = initializeApp({
          credential: cert(serviceAccountJson),
        });
        console.log('Firebase Admin initialized successfully with service account');
      } catch (parseError) {
        console.error('Error parsing service account JSON:', parseError);
      }
    } else {
      // Fallback: Try to initialize with individual environment variables
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey) {
        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        console.log('Firebase Admin initialized successfully with environment variables');
      } else {
        console.warn('Firebase Admin credentials not found. Authentication verification will be disabled.');
      }
    }
  } else {
    adminApp = getApps()[0];
    console.log('Firebase Admin already initialized');
  }

  if (adminApp) {
    adminAuth = getAuth(adminApp);
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export { adminApp, adminAuth };
