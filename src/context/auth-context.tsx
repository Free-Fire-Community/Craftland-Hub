'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInAnonymously, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Auth not initialized. Please check your Firebase configuration.');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        // Create user profile based on auth type
        const userProfile: UserProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || (fbUser.isAnonymous ? 'Anonymous User' : 'User'),
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          submissionCount: fbUser.isAnonymous ? 0 : Math.floor(Math.random() * 20),
          totalVotesGiven: fbUser.isAnonymous ? 0 : Math.floor(Math.random() * 100),
        };
        setUser(userProfile);
      } else {
        // If no user, sign in anonymously for basic access
        try {
          if (auth) {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error('Failed to sign in anonymously:', error);
          // Continue without auth - user can still browse
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Don't block rendering - let the page load while auth initializes in background
  // Components that need auth can check the loading state themselves
  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
