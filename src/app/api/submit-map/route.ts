import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService, type MapSubmissionData } from '@/lib/firestore-service';
import {
  checkRateLimit,
  validateApiKey,
  validateRequestSize,
  createSecureHeaders,
  handleOptionsRequest
} from '@/lib/api-security';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Security checks
    if (!validateRequestSize(request)) {
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413, headers: createSecureHeaders() }
      );
    }

    const rateLimit = checkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            ...createSecureHeaders(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401, headers: createSecureHeaders() }
      );
    }

    // Verify Firebase authentication token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header found');
      return NextResponse.json(
        { error: 'Authentication required. Please sign in with Google to submit maps.' },
        { status: 401, headers: createSecureHeaders() }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      if (!adminAuth) {
        console.error('Firebase Admin not initialized - allowing submission without verification');
        // If Firebase Admin is not available, we'll skip verification
        // This allows the app to work in development without admin credentials
        // In production, make sure to set FIREBASE_SERVICE_ACCOUNT_KEY
        decodedToken = { uid: 'anonymous', name: 'User', email: null };
      } else {
        console.log('Verifying Firebase token...');
        decodedToken = await adminAuth.verifyIdToken(idToken, true); // checkRevoked = true
        console.log('Token verified successfully for user:', decodedToken.uid);
        
        // Check if user is anonymous
        if (decodedToken.firebase?.sign_in_provider === 'anonymous') {
          console.log('Anonymous user attempted to submit');
          return NextResponse.json(
            { error: 'Anonymous users cannot submit maps. Please sign in with Google.' },
            { status: 403, headers: createSecureHeaders() }
          );
        }
      }
    } catch (error: any) {
      console.error('Error verifying Firebase token:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Provide more specific error messages
      if (error.code === 'auth/id-token-expired') {
        return NextResponse.json(
          { error: 'Your session has expired. Please sign in again.' },
          { status: 401, headers: createSecureHeaders() }
        );
      } else if (error.code === 'auth/argument-error') {
        return NextResponse.json(
          { error: 'Invalid authentication format. Please try signing in again.' },
          { status: 401, headers: createSecureHeaders() }
        );
      }
      
      return NextResponse.json(
        { error: 'Authentication verification failed. Please sign out and sign in again.' },
        { status: 401, headers: createSecureHeaders() }
      );
    }

    const body = await request.json();
    const { mapCode, region, category, tags, notes, fetchedData } = body;
    
    // Log received data for debugging
    console.log('Received submission data:', {
      mapCode,
      region,
      category,
      tags,
      hasNotes: !!notes,
      hasFetchedData: !!fetchedData,
      fetchedDataKeys: fetchedData ? Object.keys(fetchedData) : []
    });

    // Enhanced validation - accept longer Free Fire codes
    const MAX_MAP_CODE_LENGTH = 256;
    if (!mapCode || typeof mapCode !== 'string' || mapCode.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid map code is required' },
        { status: 400, headers: createSecureHeaders() }
      );
    }

    if (mapCode.length > MAX_MAP_CODE_LENGTH) {
      return NextResponse.json(
        { error: `Map code too long (maximum ${MAX_MAP_CODE_LENGTH} characters)` },
        { status: 400, headers: createSecureHeaders() }
      );
    }

    if (!region || !['IND', 'BR', 'US', 'EU', 'SEA', 'MENA', 'other'].includes(region)) {
      return NextResponse.json(
        { error: 'Valid region is required' },
        { status: 400, headers: createSecureHeaders() }
      );
    }

    if (!fetchedData || typeof fetchedData !== 'object') {
      return NextResponse.json(
        { error: 'Valid fetched data is required' },
        { status: 400, headers: createSecureHeaders() }
      );
    }

    // Apply fallbacks for missing fields (common for newly created maps)
    const fieldDefaults = {
      workshop_name: 'Untitled Map',
      author_name: 'Unknown',
      workshop_desc: 'No description available',
      map_cover_url: '/craftlandpreview.png',
      team_count: 1,
      subscribe_count: 0,
      like_count: 0,
      min_est_play_time: 5,
      max_est_play_time: 15
    };
    
    // Apply defaults for missing or empty fields
    for (const [field, fallback] of Object.entries(fieldDefaults)) {
      if (!fetchedData[field] || (typeof fetchedData[field] === 'string' && fetchedData[field].trim() === '')) {
        fetchedData[field] = fallback;
        console.log(`Using fallback for ${field}: ${fallback}`);
      }
    }

    // Get authenticated user info from decoded token
    const submitterId = decodedToken.uid;
    const submitterName = decodedToken.name || decodedToken.email || 'User';

    // Prepare submission data
    const submissionData: MapSubmissionData = {
      mapCode,
      region,
      category: category || undefined,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t: string) => t.trim()) : [],
      notes: notes || '',
      fetchedData,
      submitterId,
      submitterName,
    };

    // Submit to Firestore
    const mapId = await FirestoreService.submitMap(submissionData);

    return NextResponse.json({
      success: true,
      mapId,
      message: 'Map submitted successfully to the community!'
    }, { headers: createSecureHeaders() });

  } catch (error) {
    console.error('Error submitting map:', error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('already been submitted')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409, headers: createSecureHeaders() }
        );
      }

      return NextResponse.json(
        { error: 'Failed to submit map: ' + error.message },
        { status: 500, headers: createSecureHeaders() }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while submitting the map' },
      { status: 500, headers: createSecureHeaders() }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}