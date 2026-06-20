'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { analytics } from '@/components/analytics';
import { ButtonLoader } from '@/components/loading-spinner';
import { 
  moderateContent, 
  validateMapCode, 
  validateTags,
  checkRateLimit,
  getModerationErrorMessage 
} from '@/lib/content-moderation';
import { categories } from '@/lib/mock-data';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Default fallback image for maps without cover images
const FALLBACK_IMAGE = '/craftlandpreview.png';

interface FetchedMapData {
  success: boolean;
  map_details?: {
    workshop_name: string;
    author_name: string;
    workshop_desc: string;
    map_cover_url: string;
    team_count: number;
    subscribe_count: number;
    like_count: number;
    min_est_play_time: number;
    max_est_play_time: number;
    game_mode?: number;
    tags?: number[];
  };
  error?: string;
}

export function MapSubmissionForm() {
  const t = useTranslations('submit');
  const format = useFormatter();
  const { toast } = useToast();
  const router = useRouter();
  const [fetchedData, setFetchedData] = useState<FetchedMapData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    mapCode: z
      .string()
      .min(1, t('mapCodeRequired'))
      .transform((val) => (val.startsWith('#') ? val : `#${val}`)),
    region: z.string().min(1, t('regionRequired')),
    category: z.string().optional(),
    tags: z.string().optional(),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mapCode: '',
      region: '',
      category: '',
      tags: '',
      notes: '',
    },
  });

  async function fetchMapData(values: z.infer<typeof formSchema>) {
    setIsFetching(true);
    try {
      const response = await fetch('/api/fetch-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
        },
        body: JSON.stringify({
          map_code: values.mapCode,
          region: values.region,
        }),
      });

      const data: FetchedMapData = await response.json();
      setFetchedData(data);

      if (data.success && data.map_details) {
        toast({
          title: t('toast.fetchSuccess'),
          description: t('toast.fetchSuccessDescription', {
            mapName: data.map_details.workshop_name,
            authorName: data.map_details.author_name
          }),
        });
      } else {
        toast({
          title: t('toast.fetchError'),
          description: data.error || t('toast.fetchErrorDescription'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching map:', error);
      toast({
        title: t('toast.fetchFailed'),
        description: t('toast.fetchFailedDescription'),
        variant: "destructive",
      });
      setFetchedData(null);
    } finally {
      setIsFetching(false);
    }
  }

  async function submitToCommunity() {
    if (!fetchedData?.success || !fetchedData.map_details) {
      toast({
        title: t('toast.submitNoData'),
        description: t('toast.submitNoDataDescription'),
        variant: "destructive",
      });
      return;
    }

    // Check rate limit (max 3 submissions per minute)
    if (!checkRateLimit('mapSubmission', 3, 60000)) {
      toast({
        title: t('toast.rateLimitTitle'),
        description: t('toast.rateLimitDescription'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get Firebase auth token
      const { auth } = await import('@/lib/firebase');
      const currentUser = auth?.currentUser;
      
      if (!currentUser || currentUser.isAnonymous) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in with Google to submit maps.',
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Force refresh the token to ensure it's valid
      const idToken = await currentUser.getIdToken(true);
      // Get form values
      const mapCode = form.getValues('mapCode');
      const notes = form.getValues('notes') || '';
      const tags = form.getValues('tags') || '';
      const category = form.getValues('category') || '';

      // Validate map code
      const mapCodeValidation = validateMapCode(mapCode);
      if (!mapCodeValidation.isClean) {
        toast({
          title: t('toast.validationError'),
          description: getModerationErrorMessage(mapCodeValidation.issues),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Moderate notes field
      const notesModeration = moderateContent(notes, 'Notes');
      if (!notesModeration.isClean) {
        toast({
          title: t('toast.moderationError'),
          description: getModerationErrorMessage(notesModeration.issues),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate tags
      const tagsValidation = validateTags(tags);
      if (!tagsValidation.isClean) {
        toast({
          title: t('toast.validationError'),
          description: getModerationErrorMessage(tagsValidation.issues),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const submissionData = {
        mapCode: mapCode,
        region: form.getValues('region'),
        category: category,
        tags: tagsValidation.sanitizedText.split(',').map(tag => tag.trim()).filter(tag => tag),
        notes: notesModeration.sanitizedText,
        fetchedData: {
          workshop_name: fetchedData.map_details.workshop_name,
          author_name: fetchedData.map_details.author_name,
          workshop_desc: fetchedData.map_details.workshop_desc,
          map_cover_url: fetchedData.map_details.map_cover_url || '/craftlandpreview.png',
          team_count: fetchedData.map_details.team_count,
          subscribe_count: fetchedData.map_details.subscribe_count,
          like_count: fetchedData.map_details.like_count,
          min_est_play_time: fetchedData.map_details.min_est_play_time,
          max_est_play_time: fetchedData.map_details.max_est_play_time,
          game_mode: fetchedData.map_details?.game_mode,
          tags: fetchedData.map_details?.tags,
        },
      };
      
      console.log('Submitting data:', submissionData);

      const response = await fetch('/api/submit-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Track map submission
        analytics.mapSubmit(form.getValues('mapCode'));
        
        toast({
          title: t('toast.submitSuccess'),
          description: t('toast.submitSuccessDescription'),
        });

        // Reset form and fetched data
        form.reset();
        setFetchedData(null);

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        toast({
          title: t('toast.submitFailed'),
          description: result.error || t('toast.submitFailedDescription'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting to community:', error);
      toast({
        title: t('toast.submitError'),
        description: t('toast.submitErrorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // First fetch the map data
    fetchMapData(values);
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-8 space-y-8">
              <FormField
                control={form.control}
                name="mapCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('mapCode')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('mapCodePlaceholder')}
                        {...field}
                        className="h-12 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </FormControl>
                    <FormDescription>
                      {t('mapCodeDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('region')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-lg">
                          <SelectValue placeholder={t('regionPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IND">{t('regions.IND')}</SelectItem>
                        <SelectItem value="BR">{t('regions.BR')}</SelectItem>
                        <SelectItem value="US">{t('regions.US')}</SelectItem>
                        <SelectItem value="EU">{t('regions.EU')}</SelectItem>
                        <SelectItem value="SEA">{t('regions.SEA')}</SelectItem>
                        <SelectItem value="MENA">{t('regions.MENA')}</SelectItem>
                        <SelectItem value="other">{t('regions.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('regionDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('category') || 'Category'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-lg">
                          <SelectValue placeholder={t('categoryPlaceholder') || 'Select a category (optional)'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => {
                          const IconComponent = cat.icon;
                          return (
                            <SelectItem key={cat.id} value={cat.name}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4 text-primary" />
                                <span>{cat.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('categoryDescription') || 'Select a category for your map. If not selected, it will be auto-detected.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('tags')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('tagsPlaceholder')}
                        {...field}
                        className="h-12 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </FormControl>
                    <FormDescription>
                      {t('tagsDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('notes')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('notesPlaceholder')}
                        {...field}
                        className="h-12 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </FormControl>
                    <FormDescription>
                      {t('notesDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isFetching}
                className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
              >
                {isFetching && <ButtonLoader />}
                {isFetching ? t('fetchingButton') : t('fetchButton')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {fetchedData?.success && fetchedData.map_details && (
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{t('mapPreview')}</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{t('fetchedSuccessfully')}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-lg relative">
              <Image
                src={fetchedData.map_details.map_cover_url || FALLBACK_IMAGE}
                alt={fetchedData.map_details.workshop_name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = FALLBACK_IMAGE;
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-foreground">{fetchedData.map_details.workshop_name}</h3>
                <p className="text-sm text-muted-foreground">{t('by')} {fetchedData.map_details.author_name}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm font-medium">{t('teamSize')}</span>
                  <span className="text-sm font-semibold text-primary">{format.number(fetchedData.map_details.team_count)} {t('players')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm font-medium">{t('playTime')}</span>
                  <span className="text-sm font-semibold text-primary">{format.number(fetchedData.map_details.min_est_play_time)}-{format.number(fetchedData.map_details.max_est_play_time)} {t('min')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm font-medium">{t('subscribers')}</span>
                  <span className="text-sm font-semibold text-primary">{format.number(fetchedData.map_details.subscribe_count, { notation: fetchedData.map_details.subscribe_count >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 })}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">{t('likes')}</span>
                  <span className="text-sm font-semibold text-primary">{format.number(fetchedData.map_details.like_count, { notation: fetchedData.map_details.like_count >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 })}</span>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-foreground">{t('description')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{fetchedData.map_details.workshop_desc}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              onClick={submitToCommunity}
              disabled={isSubmitting}
            >
              {isSubmitting && <ButtonLoader />}
              {isSubmitting ? t('submittingButton') : t('submitButton')}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
