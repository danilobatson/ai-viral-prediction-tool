/**
 * Enhanced number utilities for viral prediction tool
 * Now LLM handles parsing, we just need formatting
 */

/**
 * Format a number for display (e.g., 1234567 -> "1.2M")
 */
export function formatNumber(num) {
  if (!num || isNaN(num)) return 'N/A'
  
  const number = parseInt(num)
  
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`
  }
  return number.toLocaleString()
}

/**
 * Get engagement tier based on count
 */
export function getEngagementTier(engagements) {
  if (!engagements || engagements === 0) return 'Unknown'
  
  if (engagements >= 1000000) return 'Mega'
  if (engagements >= 100000) return 'High'
  if (engagements >= 10000) return 'Medium'
  if (engagements >= 1000) return 'Low'
  return 'Minimal'
}

/**
 * Validate if engagement data looks realistic for follower count
 */
export function validateEngagementData(followers, engagements) {
  if (!followers || !engagements) return false
  
  // Basic sanity check - engagements shouldn't be more than 10x followers typically
  const ratio = engagements / followers
  return ratio >= 0.001 && ratio <= 10
}

/**
 * Format engagement rate as percentage
 */
export function formatEngagementRate(engagements, followers) {
  if (!engagements || !followers) return 'N/A'
  
  const rate = (engagements / followers) * 100
  return `${rate.toFixed(2)}%`
}
