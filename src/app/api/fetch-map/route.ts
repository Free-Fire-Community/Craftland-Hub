import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  checkRateLimit,
  validateApiKey,
  validateRequestSize,
  createSecureHeaders,
  handleOptionsRequest
} from '@/lib/api-security';

interface MapData {
  code: number;
  message?: string;
  data?: {
    workshop_code_info: {
      workshop_code: string;
      author_name: string;
      workshop_name: string;
      workshop_desc: string;
      team_count: number;
      group_mode: number;
      tags: number[];
      map_cover_url: string;
      min_est_play_time: number;
      max_est_play_time: number;
      subscribe_count: number;
      like_count: number;
      localization?: any;
      game_mode: number;
      map_id: number;
    };
    game_config?: any;
  };
}

// Lightweight in-memory cache for upstream map lookups, to reduce calls to the
// upstream provider. Note: in serverless / multi-instance deployments this cache
// is per-instance and ephemeral, so it is a best-effort optimization, not a guarantee.
const MAP_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const mapCache = new Map<string, { expires: number; payload: Record<string, unknown> }>();

export async function POST(request: NextRequest) {
  try {
    // Security checks
    if (!validateRequestSize(request)) {
      return NextResponse.json(
        { success: false, error: 'Request too large' },
        { status: 413, headers: createSecureHeaders() }
      );
    }

    const rateLimit = checkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            ...createSecureHeaders(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          }
        }
      );
    }

    // Validate API key for internal requests
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401, headers: createSecureHeaders() }
      );
    }

    const body = await request.json();
    // Accept both snake_case (map_code) and camelCase (mapCode) from clients
    const rawMapCode = body?.map_code ?? body?.mapCode ?? '';
    const region = body?.region ?? 'IND';
    const lang = body?.lang ?? 'en';

    // Enhanced validation - accept longer Free Fire codes and trim whitespace
    const map_code = typeof rawMapCode === 'string' ? rawMapCode.trim() : String(rawMapCode || '');

    if (!map_code || typeof map_code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid map code is required' },
        { status: 400, headers: createSecureHeaders() }
      );
    }

    // Basic length check to prevent abuse - increase limit to 256 chars
    const MAX_MAP_CODE_LENGTH = 256;
    if (map_code.length > MAX_MAP_CODE_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Map code too long (maximum ${MAX_MAP_CODE_LENGTH} characters)` },
        { status: 400, headers: createSecureHeaders() }
      );
    }

    if (!['IND', 'BR', 'US', 'EU', 'SEA', 'MENA', 'other'].includes(region)) {
      return NextResponse.json(
        { success: false, error: 'Invalid region' },
        { status: 400, headers: createSecureHeaders() }
      );
    }

    // Ensure map code starts with #
    const formattedMapCode = map_code.startsWith('#') ? map_code : `#${map_code}`;

    // Serve from cache when available to reduce upstream calls
    const cacheKey = `${region}:${lang}:${formattedMapCode}`;
    const cached = mapCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json(
        { ...cached.payload, cached: true },
        { headers: createSecureHeaders() }
      );
    }

    // Resolve the upstream API source from a server-only env var.
    // Must NOT be NEXT_PUBLIC_* so it is never exposed to the browser bundle.
    const baseUrl = process.env.MAP_API_BASE_URL;
    if (!baseUrl) {
      console.error('MAP_API_BASE_URL is not configured');
      return NextResponse.json(
        { success: false, error: 'Map service is not configured' },
        { status: 503, headers: createSecureHeaders() }
      );
    }

    // Derive Origin/Referer from the configured base URL so the upstream host
    // is not hardcoded anywhere in source.
    let apiOrigin: string;
    try {
      apiOrigin = new URL(baseUrl).origin;
    } catch {
      console.error('MAP_API_BASE_URL is not a valid URL');
      return NextResponse.json(
        { success: false, error: 'Map service is misconfigured' },
        { status: 503, headers: createSecureHeaders() }
      );
    }

    // Generate device ID
    const deviceId = uuidv4();

    // Construct API URL
    const url = `${baseUrl}?lang=${lang}&region=${region}&map_code=${encodeURIComponent(formattedMapCode)}&device_id=${deviceId}`;

    // Make request to the upstream map API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': `${apiOrigin}/`,
        'Origin': apiOrigin,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const jsonData: MapData = await response.json();

    // Check if response is valid
    if (jsonData.code === 0 && jsonData.data?.workshop_code_info) {
      const workshopInfo = jsonData.data.workshop_code_info;

      // Extract key information
      const mapDetails = {
        workshop_code: workshopInfo.workshop_code,
        author_name: workshopInfo.author_name,
        workshop_name: workshopInfo.workshop_name,
        workshop_desc: workshopInfo.workshop_desc,
        team_count: workshopInfo.team_count,
        group_mode: workshopInfo.group_mode,
        tags: workshopInfo.tags,
        map_cover_url: workshopInfo.map_cover_url,
        min_est_play_time: workshopInfo.min_est_play_time,
        max_est_play_time: workshopInfo.max_est_play_time,
        subscribe_count: workshopInfo.subscribe_count,
        like_count: workshopInfo.like_count,
        localization: workshopInfo.localization,
        game_mode: workshopInfo.game_mode,
        map_id: workshopInfo.map_id,
      };

      const successPayload = {
        success: true,
        data: jsonData.data,
        status_code: response.status,
        map_details: mapDetails,
        game_config: jsonData.data.game_config,
      };

      // Cache successful lookups to reduce upstream calls
      mapCache.set(cacheKey, {
        expires: Date.now() + MAP_CACHE_TTL_MS,
        payload: successPayload,
      });

      return NextResponse.json(successPayload, { headers: createSecureHeaders() });
    } else {
      return NextResponse.json({
        success: false,
        error: jsonData.message || 'Unknown error',
        code: jsonData.code,
        raw_response: jsonData,
      }, { headers: createSecureHeaders() });
    }

  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch map data',
      },
      { status: 500, headers: createSecureHeaders() }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest();
}