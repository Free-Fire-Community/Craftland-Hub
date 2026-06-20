'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapGrid } from '@/components/map-grid';
import { Loader2, Upload, ThumbsUp, Settings, LogOut } from 'lucide-react';
import type { Map } from '@/lib/types';

export default function ProfilePage() {
  const { user, firebaseUser } = useContext(AuthContext);
  const router = useRouter();
  const t = useTranslations('profile');
  const [submittedMaps, setSubmittedMaps] = useState<Map[]>([]);
  const [votedMaps, setVotedMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize
    if (!user) {
      return;
    }

    // Redirect anonymous users to home
    if (firebaseUser?.isAnonymous) {
      router.push('/');
      return;
    }

    // Fetch user's submitted and voted maps from Firestore
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Import FirestoreService dynamically to avoid SSR issues
        const { FirestoreService } = await import('@/lib/firestore-service');
        
        const [submitted, voted] = await Promise.all([
          FirestoreService.getUserSubmittedMaps(user.uid),
          FirestoreService.getUserVotedMaps(user.uid),
        ]);

        setSubmittedMaps(submitted);
        setVotedMaps(voted);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, firebaseUser, router]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  // Show loading while auth initializes
  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render anything if anonymous (will redirect)
  if (firebaseUser?.isAnonymous) {
    return null;
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold">{user.displayName || 'Anonymous User'}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                {t('signOut')}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs for Submissions and Votes */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="submissions" className="gap-2">
              <Upload className="h-4 w-4" />
              {t('mySubmissions')}
            </TabsTrigger>
            <TabsTrigger value="votes" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              {t('myVotes')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-4">
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t('submittedMaps')}</CardTitle>
                <CardDescription>{t('submittedMapsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {submittedMaps.length > 0 ? (
                  <MapGrid maps={submittedMaps} />
                ) : (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">{t('noSubmissions')}</p>
                    <Button onClick={() => router.push('/submit')}>
                      {t('submitFirstMap')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes" className="space-y-4">
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t('votedMaps')}</CardTitle>
                <CardDescription>{t('votedMapsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {votedMaps.length > 0 ? (
                  <MapGrid maps={votedMaps} />
                ) : (
                  <div className="text-center py-12">
                    <ThumbsUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">{t('noVotes')}</p>
                    <Button onClick={() => router.push('/')}>
                      {t('exploreMaps')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
