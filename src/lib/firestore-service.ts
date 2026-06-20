import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type OrderByDirection,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Map, UserProfile } from './types';
import { inferCategoryFromAPI, convertTagIdsToNames } from './category-mapping';

// Collection names
const COLLECTIONS = {
  MAPS: 'maps',
  USERS: 'users',
  VOTES: 'votes',
  TAGS: 'tags',
} as const;

// Map submission data interface
export interface MapSubmissionData {
  mapCode: string;
  region: string;
  category?: string;
  tags: string[];
  notes?: string;
  fetchedData: {
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
    map_id?: number;
  };
  submitterId?: string;
  submitterName?: string;
}

// Vote data interface
export interface VoteData {
  userId: string;
  mapId: string;
  voteType: 'up' | 'down';
  timestamp: Timestamp;
}

// Search and filter options
export interface MapSearchOptions {
  category?: string;
  tags?: string[];
  region?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  gameMode?: string;
  teamSize?: string;
  sortBy?: 'createdAt' | 'netVotes' | 'voteScore' | 'views' | 'subscribeCount';
  sortOrder?: OrderByDirection;
  limit?: number;
  startAfter?: QueryDocumentSnapshot<DocumentData>;
}

// Firestore service class
export class FirestoreService {
  private static checkDb(): void {
    if (!db) {
      throw new Error(
        'Firestore not initialized. Please check your Firebase configuration in .env.local. ' +
        'Visit https://console.firebase.google.com/ ' +
        'to get your config values.'
      );
    }
  }
  // Map operations
  static async submitMap(submissionData: MapSubmissionData): Promise<string> {
    this.checkDb();

    try {
      // Check if map already exists (same code and region)
      const existingMapQuery = query(
        collection(db!, COLLECTIONS.MAPS),
        where('mapCode', '==', submissionData.mapCode),
        where('region', '==', submissionData.region)
      );
      const existingMaps = await getDocs(existingMapQuery);

      if (!existingMaps.empty) {
        const existingMapDoc = existingMaps.docs[0];
        const existingMap = existingMapDoc.data();
        const existingMapId = existingMapDoc.id;
        const lastUpdated = existingMap.updatedAt || existingMap.createdAt;
        const daysSinceUpdate = (Date.now() - lastUpdated.toMillis()) / (1000 * 60 * 60 * 24);

        // Allow re-submission after 7 days to update map data
        if (daysSinceUpdate < 7) {
          throw new Error(
            `This map was recently submitted. You can update it again in ${Math.ceil(7 - daysSinceUpdate)} days.`
          );
        }

        // Update existing map with new data
        console.log('[FirestoreService] Updating existing map:', existingMapId);
        
        const apiGameMode = submissionData.fetchedData.game_mode || null;
        const apiTags = submissionData.fetchedData.tags || [];
        const category = inferCategoryFromAPI(apiGameMode, apiTags);
        const apiTagNames = convertTagIdsToNames(apiTags);
        const allTags = [...new Set([...submissionData.tags, ...apiTagNames])];

        const updateData = {
          name: submissionData.fetchedData.workshop_name || existingMap.name,
          description: submissionData.fetchedData.workshop_desc || existingMap.description,
          author: submissionData.fetchedData.author_name || existingMap.author,
          coverImageUrl: submissionData.fetchedData.map_cover_url || existingMap.coverImageUrl || '/craftlandpreview.png',
          subscribeCount: submissionData.fetchedData.subscribe_count,
          likeCount: submissionData.fetchedData.like_count,
          tags: allTags,
          category: category,
          updatedAt: Timestamp.now(),
          apiGameMode: apiGameMode,
          apiTags: apiTags,
        };

        await updateDoc(doc(db!, COLLECTIONS.MAPS, existingMapId), updateData);
        return existingMapId;
      }

      // Use user-provided category or infer from API data
      const apiGameMode = submissionData.fetchedData.game_mode || null;
      const apiTags = submissionData.fetchedData.tags || [];
      const category = submissionData.category || inferCategoryFromAPI(apiGameMode, apiTags);
      
      // Convert API tag IDs to readable names and merge with user tags
      const apiTagNames = convertTagIdsToNames(apiTags);
      const allTags = [...new Set([...submissionData.tags, ...apiTagNames])];

      // Create map document with fallbacks for missing data
      const coverImageUrl = submissionData.fetchedData.map_cover_url || '/craftlandpreview.png';
      const mapName = submissionData.fetchedData.workshop_name || 'Untitled Map';
      const mapDescription = submissionData.fetchedData.workshop_desc || 'No description available';
      const authorName = submissionData.fetchedData.author_name || 'Unknown';
      
      const mapData = {
        mapCode: submissionData.mapCode,
        region: submissionData.region,
        name: mapName,
        description: mapDescription,
        author: authorName,
        coverImageUrl: coverImageUrl,
        gameMode: this.inferGameMode(submissionData.fetchedData),
        teamSize: `${submissionData.fetchedData.team_count}`,
        playTimeEstimate: `${submissionData.fetchedData.min_est_play_time}-${submissionData.fetchedData.max_est_play_time} min`,
        subscribeCount: submissionData.fetchedData.subscribe_count,
        likeCount: submissionData.fetchedData.like_count,
        views: 0,
        netVotes: 0,
        voteScore: 0,
        createdAt: Timestamp.now(),
        submitterName: submissionData.submitterName || 'Anonymous',
        submitterNotes: submissionData.notes || '',
        tags: allTags,
        category: category,
        difficulty: this.inferDifficulty(submissionData.fetchedData),
        apiGameMode: apiGameMode,
        apiTags: apiTags,
        mapId: submissionData.fetchedData.map_id || null,
      };

      const docRef = await addDoc(collection(db!, COLLECTIONS.MAPS), mapData);

      // Update user submission count if submitter provided
      if (submissionData.submitterId) {
        await this.updateUserSubmissionCount(submissionData.submitterId);
      }

      // Add tags to tags collection for indexing
      await this.addTagsToIndex(submissionData.tags);

      return docRef.id;
    } catch (error) {
      console.error('Error submitting map:', error);
      throw error;
    }
  }

  static async getMap(mapId: string): Promise<Map | null> {
    this.checkDb();

    try {
      console.log('[FirestoreService] Getting map with ID:', mapId);
      const docRef = doc(db!, COLLECTIONS.MAPS, mapId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('[FirestoreService] Map found:', docSnap.id);
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Map;
      }
      console.log('[FirestoreService] Map not found with ID:', mapId);
      return null;
    } catch (error) {
      console.error('[FirestoreService] Error getting map:', error);
      if (error instanceof Error) {
        console.error('[FirestoreService] Error details:', error.message);
      }
      throw error;
    }
  }

  static async getMapByCode(mapCode: string, region?: string): Promise<Map | null> {
    this.checkDb();

    try {
      console.log('[FirestoreService] Getting map by code:', mapCode, 'region:', region);
      let q = query(
        collection(db!, COLLECTIONS.MAPS),
        where('mapCode', '==', mapCode)
      );

      if (region) {
        q = query(q, where('region', '==', region));
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        console.log('[FirestoreService] Map found by code:', doc.id);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Map;
      }
      console.log('[FirestoreService] No map found with code:', mapCode);
      return null;
    } catch (error) {
      console.error('[FirestoreService] Error getting map by code:', error);
      if (error instanceof Error) {
        console.error('[FirestoreService] Error details:', error.message);
      }
      throw error;
    }
  }

  static async searchMaps(options: MapSearchOptions = {}): Promise<{
    maps: Map[];
    hasMore: boolean;
    lastDoc?: QueryDocumentSnapshot<DocumentData>;
  }> {
    this.checkDb();

    try {
      let q = query(collection(db!, COLLECTIONS.MAPS));

      // Apply filters
      if (options.category) {
        q = query(q, where('category', '==', options.category));
      }
      if (options.region) {
        q = query(q, where('region', '==', options.region));
      }
      if (options.difficulty) {
        q = query(q, where('difficulty', '==', options.difficulty));
      }
      if (options.gameMode) {
        q = query(q, where('gameMode', '==', options.gameMode));
      }
      if (options.teamSize) {
        q = query(q, where('teamSize', '==', options.teamSize));
      }

      // Apply sorting
      const sortBy = options.sortBy || 'createdAt';
      const sortOrder = options.sortOrder || 'desc';
      q = query(q, orderBy(sortBy, sortOrder));

      // Apply pagination
      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const limitCount = options.limit || 20;
      q = query(q, limit(limitCount + 1)); // +1 to check if there are more results

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;

      const hasMore = docs.length > limitCount;
      const mapsToReturn = hasMore ? docs.slice(0, limitCount) : docs;

      const maps: Map[] = mapsToReturn.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Map[];

      return {
        maps,
        hasMore,
        lastDoc: hasMore ? mapsToReturn[mapsToReturn.length - 1] : undefined,
      };
    } catch (error) {
      console.error('Error searching maps:', error);
      throw error;
    }
  }

  static async incrementViews(mapId: string): Promise<void> {
    this.checkDb();

    try {
      const mapRef = doc(db!, COLLECTIONS.MAPS, mapId);
      await updateDoc(mapRef, {
        views: await this.getAndIncrementField(mapId, 'views'),
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }

  // Vote operations
  static async voteOnMap(userId: string, mapId: string, voteType: 'up' | 'down'): Promise<void> {
    this.checkDb();

    try {
      const voteRef = doc(db!, COLLECTIONS.VOTES, `${userId}_${mapId}`);
      const voteDoc = await getDoc(voteRef);

      const voteData: VoteData = {
        userId,
        mapId,
        voteType,
        timestamp: Timestamp.now(),
      };

      if (voteDoc.exists()) {
        // Update existing vote
        const previousVote = voteDoc.data() as VoteData;
        if (previousVote.voteType === voteType) {
          // Remove vote if same type
          await deleteDoc(voteRef);
          await this.updateMapVotes(mapId, voteType === 'up' ? -1 : 1);
        } else {
          // Change vote type
          await updateDoc(voteRef, {
            voteType: voteType,
            timestamp: Timestamp.now(),
          });
          await this.updateMapVotes(mapId, voteType === 'up' ? 2 : -2);
        }
      } else {
        // Add new vote
        await addDoc(collection(db!, COLLECTIONS.VOTES), voteData);
        await this.updateMapVotes(mapId, voteType === 'up' ? 1 : -1);
      }

      // Update user's total votes given
      await this.updateUserVoteCount(userId);
    } catch (error) {
      console.error('Error voting on map:', error);
      throw error;
    }
  }

  // User operations
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    this.checkDb();

    try {
      const userRef = doc(db!, COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  static async getUserSubmittedMaps(userId: string): Promise<Map[]> {
    this.checkDb();

    try {
      const mapsQuery = query(
        collection(db!, COLLECTIONS.MAPS),
        where('submitterId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(mapsQuery);
      const maps: Map[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Map[];

      return maps;
    } catch (error) {
      console.error('Error getting user submitted maps:', error);
      return [];
    }
  }

  static async getUserVotedMaps(userId: string): Promise<Map[]> {
    this.checkDb();

    try {
      // Get all votes by this user
      const votesQuery = query(
        collection(db!, COLLECTIONS.VOTES),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const votesSnapshot = await getDocs(votesQuery);
      const mapIds = votesSnapshot.docs.map(doc => doc.data().mapId);

      if (mapIds.length === 0) return [];

      // Fetch the maps (in batches of 10 due to Firestore 'in' query limit)
      const maps: Map[] = [];
      for (let i = 0; i < mapIds.length; i += 10) {
        const batch = mapIds.slice(i, i + 10);
        const mapsQuery = query(
          collection(db!, COLLECTIONS.MAPS),
          where('__name__', 'in', batch)
        );
        const mapsSnapshot = await getDocs(mapsQuery);
        mapsSnapshot.docs.forEach(doc => {
          maps.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as Map);
        });
      }

      return maps;
    } catch (error) {
      console.error('Error getting user voted maps:', error);
      return [];
    }
  }

  static async createUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    this.checkDb();

    try {
      const userRef = doc(db!, COLLECTIONS.USERS, userId);
      const userData = {
        uid: userId,
        displayName: profile.displayName || null,
        email: profile.email || null,
        photoURL: profile.photoURL || null,
        submissionCount: 0,
        totalVotesGiven: 0,
        ...profile,
      };
      await updateDoc(userRef, userData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Search operations
  static async searchMapsByText(searchText: string): Promise<Map[]> {
    this.checkDb();

    try {
      const searchLower = searchText.toLowerCase().trim();
      
      // Fetch all maps (in production, you'd want to use Algolia or similar for better search)
      const allMapsQuery = query(collection(db!, COLLECTIONS.MAPS), limit(100));
      const querySnapshot = await getDocs(allMapsQuery);
      
      const maps: Map[] = [];
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const mapData = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        } as Map;
        
        // Search in: map code, name, author, submitter name, description
        const searchableText = [
          mapData.mapCode,
          mapData.name,
          mapData.author,
          mapData.submitterName || '',
          mapData.description,
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(searchLower)) {
          maps.push(mapData);
        }
      });
      
      return maps;
    } catch (error) {
      console.error('Error searching maps:', error);
      return [];
    }
  }

  // Category operations
  static async getCategoryCounts(): Promise<Record<string, number>> {
    this.checkDb();

    try {
      const allMapsQuery = query(collection(db!, COLLECTIONS.MAPS));
      const querySnapshot = await getDocs(allMapsQuery);
      
      const counts: Record<string, number> = {};
      
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const category = data.category || 'Other';
        counts[category] = (counts[category] || 0) + 1;
      });
      
      return counts;
    } catch (error) {
      console.error('Error getting category counts:', error);
      return {};
    }
  }

  // Helper methods
  private static async getAndIncrementField(mapId: string, field: string): Promise<number> {
    const mapRef = doc(db!, COLLECTIONS.MAPS, mapId);
    const mapDoc = await getDoc(mapRef);
    const currentValue = mapDoc.data()?.[field] || 0;
    await updateDoc(mapRef, { [field]: currentValue + 1 });
    return currentValue + 1;
  }

  private static async updateMapVotes(mapId: string, voteChange: number): Promise<void> {
    const mapRef = doc(db!, COLLECTIONS.MAPS, mapId);
    const mapDoc = await getDoc(mapRef);
    const currentData = mapDoc.data();

    if (currentData) {
      const newNetVotes = (currentData.netVotes || 0) + voteChange;
      const newVoteScore = this.calculateVoteScore(newNetVotes, currentData.views || 0);

      await updateDoc(mapRef, {
        netVotes: newNetVotes,
        voteScore: newVoteScore,
      });
    }
  }

  private static calculateVoteScore(netVotes: number, views: number): number {
    // Reddit-style ranking algorithm
    const z = netVotes > 0 ? 1 : netVotes < 0 ? -1 : 0;
    const sign = z;
    const base = Math.abs(netVotes);
    const order = Math.log10(Math.max(base, 1));
    const seconds = (Date.now() - Date.now()) / 45000; // Simplified, could use actual timestamp
    return sign * order + seconds / 45000;
  }

  private static async updateUserSubmissionCount(userId: string): Promise<void> {
    const userRef = doc(db!, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentCount = userDoc.data()?.submissionCount || 0;
      await updateDoc(userRef, { submissionCount: currentCount + 1 });
    }
  }

  private static async updateUserVoteCount(userId: string): Promise<void> {
    const userRef = doc(db!, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentCount = userDoc.data()?.totalVotesGiven || 0;
      await updateDoc(userRef, { totalVotesGiven: currentCount + 1 });
    }
  }

  private static async addTagsToIndex(tags: string[]): Promise<void> {
    if (!tags.length) return;

    try {
      const tagsRef = collection(db!, COLLECTIONS.TAGS);
      const existingTags = await getDocs(tagsRef);
      const existingTagNames = new Set(existingTags.docs.map(doc => doc.id));

      for (const tag of tags) {
        if (!existingTagNames.has(tag.toLowerCase())) {
          await addDoc(tagsRef, {
            name: tag.toLowerCase(),
            displayName: tag,
            count: 1,
            createdAt: Timestamp.now(),
          });
        } else {
          // Increment count
          const tagDoc = existingTags.docs.find(doc => doc.id === tag.toLowerCase());
          if (tagDoc) {
            const currentCount = tagDoc.data().count || 0;
            await updateDoc(tagDoc.ref, { count: currentCount + 1 });
          }
        }
      }
    } catch (error) {
      console.error('Error adding tags to index:', error);
    }
  }

  private static inferGameMode(fetchedData: any): string {
    // Simple inference based on description and other data
    const desc = fetchedData.workshop_desc.toLowerCase();
    if (desc.includes('race') || desc.includes('parkour')) return 'Parkour';
    if (desc.includes('battle') || desc.includes('fight')) return 'Battle Royale';
    if (desc.includes('puzzle')) return 'Puzzle';
    return 'Custom';
  }

  private static inferDifficulty(fetchedData: any): 'Easy' | 'Medium' | 'Hard' {
    const playTime = fetchedData.max_est_play_time;
    if (playTime <= 5) return 'Easy';
    if (playTime <= 15) return 'Medium';
    return 'Hard';
  }
}