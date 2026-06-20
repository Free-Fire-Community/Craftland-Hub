/**
 * Category mapping utilities for Free Fire Craftland API
 * Maps API game modes and tags to our internal category system
 */

// Game mode ID to category mapping (from API response)
export const GAME_MODE_TO_CATEGORY: Record<number, string> = {
  15: 'Deathmatch', // Clash Squad
  24: 'Deathmatch', // Team Deathmatch
  45: 'Creative', // Playground
  58: 'Zombie Hunt', // Droid Apocalypse
  53: 'Zombie Hunt', // Zombie modes
};

// Tag ID to tag name mapping (from API response)
export const TAG_ID_TO_NAME: Record<number, string> = {
  // Team sizes
  4: 'Solo',
  5: 'Duo',
  6: 'Trio',
  7: 'Squad',
  8: '5v5',
  9: '6v6',
  
  // Game features
  10: 'Unlimited Ammo',
  11: 'Quick EP',
  12: 'Early Shrink',
  13: 'Late Shrink',
  14: 'Mini Zone',
  18: 'Skills',
  19: 'One Team',
  20: 'PvE',
  21: 'Infection',
  23: 'Hide N Seek',
  24: 'Multi-Level',
  26: 'Unlimited Gloo',
  27: 'Unlimited Throwables',
  
  // Game modes/types
  28: 'Free For All',
  29: 'Gun Fight',
  30: 'Gun King',
  31: 'Respawn',
  32: 'Sniper',
  33: 'Survival',
  34: 'Solo',
  35: 'Horror',
  36: 'Casual',
  37: 'Easy',
  38: 'Medium',
  39: 'Hard',
  40: 'Very Challenging',
  41: 'Escape',
  42: 'VIP',
  43: 'Custom Resources',
  44: 'Puzzles',
  45: 'Racing',
  46: 'Music',
  47: 'MOBA',
  48: 'Adventure',
  49: 'Zombie Hunt',
  50: 'PvP',
  51: 'Party Game',
  52: 'Team Deathmatch',
  53: 'Turret Defense',
  54: 'Training',
  
  // Map types
  56: 'Color Game',
  57: 'Color Spray',
  58: 'Color Fight',
  59: 'Color Playground',
  60: 'Color Party',
  61: 'Color Parkour',
  62: 'Spider-Verse Parkour',
  63: 'Color Hide N Seek',
  64: 'Anniversary',
  65: 'Role Play',
  66: 'Simulation',
  67: 'Asymmetrical',
  68: 'Resource Battle',
  69: 'Cart Escort',
  70: 'Mini Game',
  71: 'Speed Challenge',
  72: 'Roguelike',
  73: 'Tycoon',
  74: 'Home-Wreck Havoc',
  75: 'Mystery Town',
  76: 'Dawn Crisis',
  77: 'Death Uprising',
  78: 'Fist Fight',
  79: 'Old Factory Roof',
  
  // Special modes
  84: 'Ban Room Create',
  85: 'Frost Brawl',
  86: 'Social Island 1.0',
  87: 'Social Island 2.0',
  88: 'Play Together',
  89: 'Ruin Survivor',
  90: 'Preying Party',
  92: 'Fort Feud 2.0',
  93: 'Bounty Hunting',
  94: 'Infinity Racer',
  95: 'Race Rush',
  96: 'Car Racing',
  97: 'FPS',
  99: 'Frontline',
  100: 'Zombie War',
  101: 'Legacy Legend',
  
  // New categories
  102: 'Thrilling Shooter',
  103: 'Fast-paced',
  104: 'Open World',
  105: 'Story-rich',
  106: 'Progression',
  107: 'Sports Simulation',
  108: 'Co-op Mission',
  109: 'Social',
  110: 'Diverse Instances',
  111: 'Free Exploration',
  112: 'Ranking Challenge',
  113: 'Achievement',
  114: 'Currency Redeem',
};

// Tag to category mapping
export const TAG_TO_CATEGORY: Record<string, string> = {
  'Zombie Hunt': 'Zombie Hunt',
  'Zombie War': 'Zombie Hunt',
  'Death Uprising': 'Zombie Hunt',
  'Racing': 'Racing',
  'Race Rush': 'Racing',
  'Car Racing': 'Racing',
  'Infinity Racer': 'Racing',
  'Parkour': 'Parkour',
  'Color Parkour': 'Parkour',
  'Spider-Verse Parkour': 'Parkour',
  'Speed Challenge': 'Parkour',
  'Team Deathmatch': 'Deathmatch',
  'Gun Fight': 'Deathmatch',
  'Free For All': 'Deathmatch',
  'PvP': 'Deathmatch',
  'Puzzles': 'Puzzle',
  'Creative': 'Creative',
  'Social Island 1.0': 'Creative',
  'Social Island 2.0': 'Creative',
  'Play Together': 'Creative',
  'Turret Defense': 'Tower Defense',
  'Fort Feud 2.0': 'Tower Defense',
  'Training': 'Aim Training',
  'Sniper': 'Aim Training',
  'FPS': 'Aim Training',
};

/**
 * Infer category from API game mode and tags
 */
export function inferCategoryFromAPI(gameMode: number | null, tags: number[]): string {
  // First try game mode mapping
  if (gameMode && GAME_MODE_TO_CATEGORY[gameMode]) {
    return GAME_MODE_TO_CATEGORY[gameMode];
  }

  // Then try tag-based inference
  for (const tagId of tags) {
    const tagName = TAG_ID_TO_NAME[tagId];
    if (tagName && TAG_TO_CATEGORY[tagName]) {
      return TAG_TO_CATEGORY[tagName];
    }
  }

  // Default fallback
  return 'Creative';
}

/**
 * Convert API tag IDs to readable tag names
 */
export function convertTagIdsToNames(tagIds: number[]): string[] {
  return tagIds
    .map(id => TAG_ID_TO_NAME[id])
    .filter(Boolean);
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
  return [
    'Zombie Hunt',
    'Racing',
    'Parkour',
    'Deathmatch',
    'Puzzle',
    'Creative',
    'Tower Defense',
    'Aim Training',
  ];
}
