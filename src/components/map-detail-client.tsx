'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Eye, Heart, Users, Clock, MapPin, Calendar, ThumbsUp, Copy, ExternalLink, Check, ImageOff, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/components/analytics';
import { LoadingSpinner } from '@/components/loading-spinner';
import { AdUnit } from '@/components/ads';
import type { Map } from '@/lib/types';

// Default fallback image for maps without cover images
const FALLBACK_IMAGE = '/craftlandpreview.png';

interface MapDetailClientProps {
  map: Map;
}

export function MapDetailClient({ map }: MapDetailClientProps) {
  const t = useTranslations('mapDetail');
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get the image URL with fallback
  const imageUrl = imageError || !map.coverImageUrl ? FALLBACK_IMAGE : map.coverImageUrl;

  useEffect(() => {
    setMounted(true);
    // Track map view
    analytics.mapView(map.id, map.name);
  }, [map.id, map.name]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(map.mapCode);
      setCopied(true);
      analytics.copyMapCode(map.mapCode);
      toast({
        title: t('copySuccess'),
        description: t('copySuccessDescription'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: t('copyError'),
        description: t('copyErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  const handleOpenInGame = () => {
    // Remove # from map code for deeplink
    const cleanCode = map.mapCode.replace('#', '');
    const deeplink = `freefire://mapshare?action=ugc_mapdetail&map_code=${cleanCode}&region=${map.region}`;
    
    // Try to open the deeplink
    window.location.href = deeplink;
    
    // Show toast with fallback
    toast({
      title: t('openingGame'),
      description: t('openingGameDescription'),
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out "${map.name}" on Craftland Hub! Map code: ${map.mapCode}`;
    
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: map.name,
          text: shareText,
          url: shareUrl,
        });
        analytics.shareMap(map.id, 'native');
        return;
      } catch (error) {
        // User cancelled or share failed, fall back to clipboard
      }
    }
    
    // Fall back to copying link
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('linkCopied') || 'Link Copied!',
        description: t('linkCopiedDescription') || 'Share link copied to clipboard',
      });
      analytics.shareMap(map.id, 'clipboard');
    } catch (error) {
      toast({
        title: t('shareError') || 'Share Failed',
        description: t('shareErrorDescription') || 'Could not share this map',
        variant: 'destructive',
      });
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" text="Loading map details..." variant="gaming" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl group">
          <Image
            src={imageUrl}
            alt={map.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            onError={() => setImageError(true)}
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <ImageOff className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {/* Category badge overlay */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {map.category}
            </Badge>
          </div>
          {/* Difficulty badge overlay */}
          <div className="absolute top-4 right-4">
            <Badge 
              variant={map.difficulty === 'Easy' ? 'default' : map.difficulty === 'Medium' ? 'secondary' : 'destructive'}
              className="backdrop-blur-sm"
            >
              {map.difficulty}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">{map.name}</h1>
            <p className="text-base md:text-lg text-muted-foreground">{t('by')} {map.author}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 md:h-5 w-4 md:w-5" />
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{map.views.toLocaleString()}</p>
                    <p className="text-xs md:text-sm">{t('views')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-4 md:h-5 w-4 md:w-5 text-red-500" />
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{map.likeCount.toLocaleString()}</p>
                    <p className="text-xs md:text-sm">{t('likes')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ThumbsUp className="h-4 md:h-5 w-4 md:w-5 text-green-500" />
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{map.netVotes}</p>
                    <p className="text-xs md:text-sm">{t('votes')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 md:h-5 w-4 md:w-5" />
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{map.subscribeCount.toLocaleString()}</p>
                    <p className="text-xs md:text-sm">{t('subscribers')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Code */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{t('mapCode')}</p>
                  <p className="text-lg md:text-2xl font-bold font-mono break-all">{map.mapCode}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full sm:w-auto"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t('copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {t('copy')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ad: Display ad after map code (high visibility) */}
          <AdUnit format="display" className="mt-4" />
        </div>
      </div>

      {/* Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('details')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">{t('description')}</h3>
            <p className="text-muted-foreground leading-relaxed">{map.description}</p>
          </div>

          <Separator />

          {/* Game Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('category')}</p>
              <Badge variant="secondary" className="text-sm md:text-base">
                {map.category}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('gameMode')}</p>
              <p className="font-semibold text-sm md:text-base">{map.gameMode}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('teamSize')}</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <p className="font-semibold text-sm md:text-base">{map.teamSize}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('playTime')}</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <p className="font-semibold text-sm md:text-base">{map.playTimeEstimate}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('difficulty')}</p>
              <Badge 
                variant={map.difficulty === 'Easy' ? 'default' : map.difficulty === 'Medium' ? 'secondary' : 'destructive'}
              >
                {map.difficulty}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('region')}</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <p className="font-semibold text-sm md:text-base">{map.region}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('submittedBy')}</p>
              <p className="font-semibold text-sm md:text-base">{map.submitterName || 'Anonymous'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('submittedOn')}</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <p className="font-semibold text-sm md:text-base">{new Date(map.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-3">{t('tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {map.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Submitter Notes */}
          {map.submitterNotes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">{t('submitterNotes')}</h3>
                <p className="text-muted-foreground italic">{map.submitterNotes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Ad: In-article ad at end of details */}
          <AdUnit format="in-article" />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
        <Button size="lg" className="gap-2 w-full sm:w-auto" onClick={handleOpenInGame}>
          <ExternalLink className="h-5 w-5" />
          {t('openInGame')}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="gap-2 w-full sm:w-auto"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          {t('share') || 'Share'}
        </Button>
        <Link href={`/category/${map.category.toLowerCase().replace(/\s+/g, '-')}`} className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full">
            {t('moreLikeThis')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
