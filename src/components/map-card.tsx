'use client';

import Image from 'next/image';
import { Eye, Heart, Star, Users, Gamepad2, Clock, MapPin, ThumbsUp, ThumbsDown, ImageOff } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { useState, useEffect } from 'react';
import { Map } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { FirestoreService } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/components/analytics';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Default fallback image for maps without cover images
const FALLBACK_IMAGE = '/craftlandpreview.png';

interface MapCardProps {
  map: Map;
  className?: string;
}

export function MapCard({ map, className }: MapCardProps) {
  const t = useTranslations('mapCard');
  const format = useFormatter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get the image URL with fallback
  const imageUrl = imageError || !map.coverImageUrl ? FALLBACK_IMAGE : map.coverImageUrl;
  
  // Format numbers with locale-specific formatting
  const formattedViews = format.number(map.views, {
    notation: map.views >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  });
  
  const formattedLikes = format.number(map.likeCount, {
    notation: map.likeCount >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1
  });
  
  // Format relative time (e.g., "2 hours ago")
  const relativeTime = format.relativeTime(map.createdAt, new Date());

  // Handle voting
  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast({
        title: t('authRequired'),
        description: t('authRequiredDesc'),
        variant: 'destructive',
      });
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    try {
      await FirestoreService.voteOnMap(user.uid, map.id, voteType);
      
      // Track vote
      analytics.mapVote(map.id, voteType);
      
      // Update local state
      if (userVote === voteType) {
        setUserVote(null); // Remove vote
      } else {
        setUserVote(voteType); // Set new vote
      }
      
      toast({
        title: t('voteSuccess'),
        description: voteType === 'up' ? t('upvoted') : t('downvoted'),
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: t('voteError'),
        description: t('voteErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  const handleCardClick = () => {
    // Use the map ID directly - the page will handle slug extraction
    window.location.href = `/map/${map.id}`;
  };

  return (
    <Card 
      className={cn("overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 cursor-pointer", className)}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        <Image
          src={imageUrl}
          alt={map.name}
          width={600}
          height={400}
          className="aspect-video object-cover w-full transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="gameplay screenshot"
          onError={() => setImageError(true)}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLb+3bXUNMguZLy5jkkXkUjKYFPwHHdKUqmzIzEk9lZKoUYn/9k="
        />
        <div className="absolute top-2 end-2 flex gap-2">
            <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm border-primary/30 transition-all duration-200 group-hover:bg-primary/90 group-hover:text-primary-foreground">
                <Star className="w-3 h-3 me-1 text-yellow-400 group-hover:text-white" /> {format.number(map.voteScore, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-base font-bold font-headline truncate group-hover:text-primary transition-colors duration-200">
          {map.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{t('author')} {map.author}</p>
        <p className="text-xs text-muted-foreground mt-1">{relativeTime}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {map.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-primary">
          <Eye className="w-3.5 h-3.5" />
          <span>{formattedViews}</span>
        </div>
        <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-red-500">
          <Heart className="w-3.5 h-3.5" />
          <span>{formattedLikes}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 transition-all duration-200",
              userVote === 'up' && "text-green-500 bg-green-50 hover:bg-green-100",
              !user && "opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVote('up');
            }}
            disabled={!user || isVoting}
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          <span className="text-xs font-medium">{format.number(map.netVotes, { notation: 'standard' })}</span>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0 transition-all duration-200",
              userVote === 'down' && "text-red-500 bg-red-50 hover:bg-red-100",
              !user && "opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleVote('down');
            }}
            disabled={!user || isVoting}
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-primary">
          <Users className="w-3.5 h-3.5" />
          <span>{map.teamSize}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
