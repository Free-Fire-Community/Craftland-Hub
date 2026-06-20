'use client';

import { useEffect, useRef } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

const GSI_SRC = 'https://accounts.google.com/gsi/client';

interface CredentialResponse {
  credential?: string;
  select_by?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (listener?: (notification: unknown) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('window is not available'));
      return;
    }
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')));
      return;
    }
    const script = document.createElement('script');
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

/**
 * Shows the Google One Tap prompt to guests when they visit the site.
 *
 * A "guest" is a visitor who is either not signed in or only signed in
 * anonymously. When they pick an account, the returned Google ID token is
 * exchanged for a Firebase credential so they end up in the same auth session
 * used by the rest of the app.
 *
 * Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID (the OAuth 2.0 Web client ID from the
 * Firebase/Google Cloud project). One Tap also only renders on origins listed
 * as Authorized JavaScript origins for that client ID.
 */
export function GoogleOneTap() {
  const { firebaseUser, loading } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Nothing to do until auth state is known.
    if (loading) return;
    // Misconfigured or Firebase unavailable — fail silently.
    if (!clientId || !auth) return;
    // Only prompt guests: not signed in, or anonymous session.
    const isGuest = !firebaseUser || firebaseUser.isAnonymous;
    if (!isGuest) return;
    // Initialize the prompt only once per mount.
    if (initialized.current) return;
    initialized.current = true;

    let cancelled = false;

    const handleCredential = async (response: CredentialResponse) => {
      if (!response.credential || !auth) return;
      try {
        const credential = GoogleAuthProvider.credential(response.credential);
        await signInWithCredential(auth, credential);
        // Reload so auth-dependent UI updates (matches the existing popup flow).
        window.location.reload();
      } catch (error) {
        console.error('Google One Tap sign-in failed:', error);
      }
    };

    loadGsiScript()
      .then(() => {
        if (cancelled || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
          use_fedcm_for_prompt: true,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: 'signin',
        });
        window.google.accounts.id.prompt();
      })
      .catch((error) => {
        console.error('Failed to initialize Google One Tap:', error);
        // Allow a retry on a subsequent render.
        initialized.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, loading]);

  return null;
}
