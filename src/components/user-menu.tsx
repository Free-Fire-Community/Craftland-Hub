'use client';

import { useState, useEffect } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon, Settings, BarChart3, Star } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';

export function UserMenu() {
  const { user, firebaseUser } = useAuth();
  const [submissionCount, setSubmissionCount] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    if (user && !firebaseUser?.isAnonymous) {
      // Fetch real counts
      const fetchCounts = async () => {
        try {
          const { FirestoreService } = await import('@/lib/firestore-service');
          const [submitted, voted] = await Promise.all([
            FirestoreService.getUserSubmittedMaps(user.uid),
            FirestoreService.getUserVotedMaps(user.uid),
          ]);
          setSubmissionCount(submitted.length);
          setVoteCount(voted.length);
        } catch (error) {
          console.error('Error fetching user counts:', error);
        }
      };
      fetchCounts();
    }
  }, [user, firebaseUser]);

  const handleSignIn = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Successfully signed in:', result.user.displayName);
      // Force reload to update auth state
      window.location.reload();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }
    try {
      await signOut(auth);
      console.log('Successfully signed out');
      // Force reload to update auth state
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const isAnonymous = firebaseUser?.isAnonymous ?? true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/50">
            <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
            <AvatarFallback className="bg-primary/20 font-bold">
              {getInitials(user?.displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {isAnonymous ? (
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Guest User</p>
              <p className="text-xs leading-none text-muted-foreground">
                Sign in to save your progress
              </p>
            </div>
          </DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        {!isAnonymous && (
          <>
            <DropdownMenuItem asChild>
              <a href="/profile">
                <UserIcon className="me-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {isAnonymous ? (
          <DropdownMenuItem onClick={handleSignIn}>
            <LogIn className="me-2 h-4 w-4 rtl-mirror" />
            Sign in with Google
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="me-2 h-4 w-4 rtl-mirror" />
            Sign out
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
