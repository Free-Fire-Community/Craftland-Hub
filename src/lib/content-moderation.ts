/**
 * Content Moderation Utilities
 * Prevents abuse, spam, and inappropriate content
 */

// Common profanity and inappropriate words (expandable list)
const PROFANITY_LIST = [
  // English
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'piss', 'dick', 'cock', 'pussy',
  'bastard', 'slut', 'whore', 'fag', 'nigger', 'nigga', 'retard', 'rape', 'sex',
  // Add more as needed
  'porn', 'xxx', 'nude', 'naked', 'kill', 'die', 'suicide', 'bomb', 'terrorist',
  // Common variations
  'f*ck', 'sh*t', 'b*tch', 'a$$', 'd*mn', 'cr*p', 'p*ss', 'd*ck', 'c*ck',
  // Leetspeak variations
  'fuk', 'fck', 'sht', 'btch', 'dck', 'pss', 'dmn',
];

// URL patterns
const URL_PATTERNS = [
  /https?:\/\//gi,
  /www\./gi,
  /\w+\.(com|net|org|io|co|me|tv|gg|xyz|info|biz|us|uk|ca|au)/gi,
  /discord\.gg/gi,
  /t\.me/gi,
  /bit\.ly/gi,
  /tinyurl/gi,
];

// Spam patterns
const SPAM_PATTERNS = [
  /(.)\1{4,}/gi, // Repeated characters (aaaaa)
  /\b(free|win|prize|click|subscribe|follow|like|share)\b/gi,
  /\b(buy|sell|cheap|discount|offer|deal)\b/gi,
  /\b(whatsapp|telegram|instagram|facebook|twitter|tiktok)\b/gi,
];

// Email pattern
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

// Phone number patterns
const PHONE_PATTERNS = [
  /\b\d{10,}\b/g, // 10+ digits
  /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
];

export interface ModerationResult {
  isClean: boolean;
  issues: string[];
  sanitizedText: string;
}

/**
 * Check if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Check if text contains URLs
 */
export function containsURL(text: string): boolean {
  return URL_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Check if text contains email addresses
 */
export function containsEmail(text: string): boolean {
  return EMAIL_PATTERN.test(text);
}

/**
 * Check if text contains phone numbers
 */
export function containsPhoneNumber(text: string): boolean {
  return PHONE_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Check if text appears to be spam
 */
export function isSpam(text: string): boolean {
  // Check for excessive repeated characters
  if (/(.)\1{5,}/.test(text)) return true;
  
  // Check for excessive caps
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.7 && text.length > 10) return true;
  
  // Check for spam keywords
  const spamKeywordCount = SPAM_PATTERNS.reduce((count, pattern) => {
    const matches = text.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  if (spamKeywordCount >= 3) return true;
  
  return false;
}

/**
 * Sanitize text by removing/replacing problematic content
 */
export function sanitizeText(text: string): string {
  let sanitized = text;
  
  // Remove URLs
  URL_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[LINK REMOVED]');
  });
  
  // Remove emails
  sanitized = sanitized.replace(EMAIL_PATTERN, '[EMAIL REMOVED]');
  
  // Remove phone numbers
  PHONE_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[PHONE REMOVED]');
  });
  
  // Remove excessive repeated characters
  sanitized = sanitized.replace(/(.)\1{4,}/g, '$1$1$1');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Remove multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  return sanitized;
}

/**
 * Comprehensive content moderation check
 */
export function moderateContent(text: string, fieldName: string = 'text'): ModerationResult {
  const issues: string[] = [];
  
  // Check length
  if (text.length === 0) {
    return {
      isClean: true,
      issues: [],
      sanitizedText: text,
    };
  }
  
  if (text.length > 500) {
    issues.push(`${fieldName} is too long (max 500 characters)`);
  }
  
  // Check for profanity
  if (containsProfanity(text)) {
    issues.push(`${fieldName} contains inappropriate language`);
  }
  
  // Check for URLs
  if (containsURL(text)) {
    issues.push(`${fieldName} cannot contain links or URLs`);
  }
  
  // Check for emails
  if (containsEmail(text)) {
    issues.push(`${fieldName} cannot contain email addresses`);
  }
  
  // Check for phone numbers
  if (containsPhoneNumber(text)) {
    issues.push(`${fieldName} cannot contain phone numbers`);
  }
  
  // Check for spam
  if (isSpam(text)) {
    issues.push(`${fieldName} appears to be spam`);
  }
  
  // Sanitize the text
  const sanitizedText = sanitizeText(text);
  
  return {
    isClean: issues.length === 0,
    issues,
    sanitizedText,
  };
}

/**
 * Validate map code format
 * Free Fire map codes can be:
 * - #FREEFIRE + 40 hex characters
 * - FREEFIRE + 40 hex characters
 * - # + 40 hex characters
 * - 40 hex characters
 */
export function validateMapCode(code: string): ModerationResult {
  const issues: string[] = [];
  
  // Remove # if present for validation
  const cleanCode = code.replace(/^#/, '');
  
  // Check minimum length
  if (cleanCode.length < 10) {
    issues.push('Map code is too short');
  }
  
  // Check maximum length
  if (cleanCode.length > 256) {
    issues.push('Map code is too long');
  }
  
  // Check for valid characters (alphanumeric only - allows FREEFIRE prefix)
  // Free Fire codes are alphanumeric (letters and numbers)
  if (!/^[A-Za-z0-9]+$/.test(cleanCode)) {
    issues.push('Map code contains invalid characters (only letters and numbers allowed)');
  }
  
  return {
    isClean: issues.length === 0,
    issues,
    sanitizedText: code,
  };
}

/**
 * Validate tags
 */
export function validateTags(tags: string): ModerationResult {
  const issues: string[] = [];
  
  if (!tags || tags.trim().length === 0) {
    return {
      isClean: true,
      issues: [],
      sanitizedText: '',
    };
  }
  
  const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
  
  // Check number of tags
  if (tagArray.length > 10) {
    issues.push('Too many tags (max 10)');
  }
  
  // Check each tag
  tagArray.forEach((tag, index) => {
    if (tag.length > 30) {
      issues.push(`Tag ${index + 1} is too long (max 30 characters)`);
    }
    
    if (containsProfanity(tag)) {
      issues.push(`Tag ${index + 1} contains inappropriate language`);
    }
    
    if (containsURL(tag)) {
      issues.push(`Tag ${index + 1} cannot contain URLs`);
    }
  });
  
  return {
    isClean: issues.length === 0,
    issues,
    sanitizedText: tagArray.slice(0, 10).join(', '),
  };
}

/**
 * Rate limiting helper (client-side check)
 */
export function checkRateLimit(key: string, maxAttempts: number = 3, windowMs: number = 60000): boolean {
  if (typeof window === 'undefined') return true;
  
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  const stored = localStorage.getItem(storageKey);
  
  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }));
    return true;
  }
  
  const data = JSON.parse(stored);
  
  // Reset if window has passed
  if (now - data.timestamp > windowMs) {
    localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }));
    return true;
  }
  
  // Check if limit exceeded
  if (data.count >= maxAttempts) {
    return false;
  }
  
  // Increment count
  data.count++;
  localStorage.setItem(storageKey, JSON.stringify(data));
  return true;
}

/**
 * Get user-friendly error message
 */
export function getModerationErrorMessage(issues: string[]): string {
  if (issues.length === 0) return '';
  
  if (issues.length === 1) {
    return issues[0];
  }
  
  return `Multiple issues found:\n${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}`;
}
