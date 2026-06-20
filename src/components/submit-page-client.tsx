'use client';

import { useAuth } from '@/hooks/use-auth';
import { MapSubmissionForm } from '@/components/map-submission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, Lock } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useTranslations } from 'next-intl';

export function SubmitPageClient() {
  const { firebaseUser, loading } = useAuth();
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const isAnonymous = firebaseUser?.isAnonymous ?? true;

  const handleSignIn = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // No need to reload, auth state will update automatically
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAnonymous) {
    return (
      <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('signInRequiredToSubmit')}</CardTitle>
          <CardDescription className="text-base">
            {t('signInRequiredDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pb-8">
          <Button
            onClick={handleSignIn}
            size="lg"
            className="w-full max-w-sm h-12 text-base font-semibold"
          >
            <LogIn className="me-2 h-5 w-5" />
            {t('signInWithGoogle')}
          </Button>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            By signing in, you agree to our terms of service and privacy policy. Your Google account information will only be used for authentication.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <MapSubmissionForm />;
}
