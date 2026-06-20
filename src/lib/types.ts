import type { User as FirebaseUser } from 'firebase/auth';

export type UserProfile = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  submissionCount: number;
  totalVotesGiven: number;
};

export type Map = {
  id: string;
  mapCode: string;
  region: string;
  name: string;
  description: string;
  author: string;
  coverImageUrl: string;
  gameMode: string;
  teamSize: string;
  playTimeEstimate: string;
  subscribeCount: number;
  likeCount: number;
  views: number;
  netVotes: number;
  voteScore: number;
  createdAt: Date;
  submitterName?: string;
  submitterNotes?: string;
  tags: string[];
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

export type Category = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  mapCount: number;
};
