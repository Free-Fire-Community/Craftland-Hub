
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required config values are present
const requiredFields = ['apiKey', 'authDomain', 'projectId'];
const isConfigValid = requiredFields.every(field => firebaseConfig[field as keyof FirebaseOptions]);

// Initialize Firebase only if config is valid
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isConfigValid) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');

    auth = getAuth(app);
    console.log('Firebase Auth initialized successfully');

    db = getFirestore(app);
    console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase services:', error);
    console.error('Please check your Firebase configuration in .env.local');
  }
} else {
  console.warn('Firebase configuration is incomplete. Please check your .env.local file.');
  console.warn('Required fields:', requiredFields.join(', '));
}

export { app, auth, db, firebaseConfig };
