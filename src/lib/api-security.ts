import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting store
// In production, use Redis or a database
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 10, // Max requests per window
};

// API key for internal requests. Must be provided via environment variable.
const API_KEY = process.env.INTERNAL_API_KEY;

export function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
  // Get client IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = request.headers.get('x-client-ip');

  // Use the first available IP or fallback to a hash of user agent + timestamp
  const ip = forwarded?.split(',')[0]?.trim() ||
             realIp ||
             clientIp ||
             `unknown_${Date.now()}`;

  const key = `rate_limit_${ip}`;
  const now = Date.now();

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or create new window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    });
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT.WINDOW_MS };
  }

  if (current.count >= RATE_LIMIT.MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }

  current.count++;
  return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - current.count, resetTime: current.resetTime };
}

export function validateApiKey(request: NextRequest): boolean {
  // Fail closed if no key is configured on the server.
  if (!API_KEY) return false;
  const apiKey = request.headers.get('x-api-key');
  return apiKey === API_KEY;
}

export function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    // Max 10KB payload
    return size <= 10 * 1024;
  }
  return true;
}

export function createSecureHeaders() {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigin = isProduction
    ? 'https://craftlandhub.freefirecommunity.com'
    : 'http://localhost:9002';

  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    // CORS headers - allow Firebase Auth popups
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

export function handleOptionsRequest() {
  return new NextResponse(null, {
    status: 200,
    headers: createSecureHeaders(),
  });
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute