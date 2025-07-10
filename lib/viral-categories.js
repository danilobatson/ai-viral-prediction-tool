/**
 * Viral category definitions with clear thresholds
 * Updated to work with LLM-parsed creator data
 */

export const VIRAL_CATEGORIES = {
  'Ultra High': {
    range: [75, 85],
    color: 'red',
    emoji: '🔥',
    description: 'Global trending potential',
    engagementThreshold: 1000000,
    examples: 'Major news, celebrity moments, viral memes'
  },
  'High': {
    range: [60, 74],
    color: 'orange', 
    emoji: '⭐',
    description: 'Strong viral potential',
    engagementThreshold: 100000,
    examples: 'Industry trending, significant community impact'
  },
  'Moderate': {
    range: [40, 59],
    color: 'yellow',
    emoji: '📈',
    description: 'Good organic reach',
    engagementThreshold: 10000,
    examples: 'Niche communities, thought leadership'
  },
  'Low': {
    range: [0, 39],
    color: 'gray',
    emoji: '📊',
    description: 'Standard performance',
    engagementThreshold: 0,
    examples: 'Regular posts, personal updates'
  }
}

/**
 * Get viral category based on probability score
 */
export function getViralCategory(probability) {
  for (const [category, data] of Object.entries(VIRAL_CATEGORIES)) {
    const [min, max] = data.range
    if (probability >= min && probability <= max) {
      return {
        name: category,
        ...data
      }
    }
  }
  
  // Default fallback
  return {
    name: 'Low',
    ...VIRAL_CATEGORIES['Low']
  }
}

/**
 * Get category color scheme for UI
 */
export function getCategoryColor(categoryName) {
  return VIRAL_CATEGORIES[categoryName]?.color || 'gray'
}

/**
 * Validate viral probability is realistic (max 85%)
 */
export function validateViralProbability(probability) {
  return Math.min(Math.max(probability, 0), 85)
}
