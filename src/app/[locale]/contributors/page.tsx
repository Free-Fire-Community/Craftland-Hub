export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { FirestoreService } from '@/lib/firestore-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Medal, Users } from 'lucide-react';

export default async function ContributorsPage() {
  const t = await getTranslations('contributors');

  // Fetch all maps to calculate contributor stats
  let contributors: Array<{
    name: string;
    submissionCount: number;
    totalViews: number;
    totalLikes: number;
    totalVotes: number;
  }> = [];

  try {
    const result = await FirestoreService.searchMaps({
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 1000,
    });

    // Aggregate stats by submitter
    const statsMap = new Map<string, {
      submissionCount: number;
      totalViews: number;
      totalLikes: number;
      totalVotes: number;
    }>();

    result.maps.forEach(map => {
      const name = map.submitterName || 'Anonymous';
      const existing = statsMap.get(name) || {
        submissionCount: 0,
        totalViews: 0,
        totalLikes: 0,
        totalVotes: 0,
      };

      statsMap.set(name, {
        submissionCount: existing.submissionCount + 1,
        totalViews: existing.totalViews + map.views,
        totalLikes: existing.totalLikes + map.likeCount,
        totalVotes: existing.totalVotes + map.netVotes,
      });
    });

    contributors = Array.from(statsMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.submissionCount - a.submissionCount);

  } catch (error) {
    console.error('Error fetching contributors:', error);
  }

  const topContributors = contributors.slice(0, 10);
  const totalMaps = contributors.reduce((sum, c) => sum + c.submissionCount, 0);
  const totalViews = contributors.reduce((sum, c) => sum + c.totalViews, 0);

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Community Contributors
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating the amazing creators who make Craftland Hub possible
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{contributors.length}</p>
                  <p className="text-sm text-muted-foreground">Contributors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{totalMaps}</p>
                  <p className="text-sm text-muted-foreground">Maps Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Award className="h-10 w-10 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div
                  key={contributor.name}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                      {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                      {index === 2 && <Medal className="h-5 w-5 text-amber-600" />}
                      {index > 2 && <span className="font-bold text-muted-foreground">#{index + 1}</span>}
                    </div>
                    <div>
                      <p className="font-semibold">{contributor.name}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{contributor.submissionCount} maps</span>
                        <span>•</span>
                        <span>{contributor.totalViews.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{contributor.totalLikes.toLocaleString()} likes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {contributor.totalVotes > 0 ? '+' : ''}{contributor.totalVotes} votes
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Contributors */}
        {contributors.length > 10 && (
          <Card>
            <CardHeader>
              <CardTitle>All Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contributors.slice(10).map((contributor) => (
                  <div
                    key={contributor.name}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <p className="font-semibold mb-2">{contributor.name}</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{contributor.submissionCount} maps submitted</p>
                      <p>{contributor.totalViews.toLocaleString()} total views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
