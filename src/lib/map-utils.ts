/**
 * Utility functions for map handling
 */

/**
 * Generate a URL-friendly slug from a map ID or code
 * This creates readable URLs while maintaining uniqueness
 */
export function generateMapSlug(mapId: string, mapName?: string): string {
  if (mapName) {
    // Create a slug from the map name and append the ID
    const nameSlug = mapName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
    return `${nameSlug}-${mapId}`;
  }
  return mapId;
}

/**
 * Extract the map ID from a slug
 * Handles both simple IDs and name-id slugs
 */
export function extractMapIdFromSlug(slug: string): string {
  // If slug contains a dash, take the last part
  const parts = slug.split('-');
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return slug;
}

/**
 * Format map code for display (ensure it has #)
 */
export function formatMapCode(code: string): string {
  return code.startsWith('#') ? code : `#${code}`;
}

/**
 * Clean map code for API calls (remove #)
 */
export function cleanMapCode(code: string): string {
  return code.replace('#', '');
}
