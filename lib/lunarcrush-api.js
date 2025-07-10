// Direct LunarCrush API integration - no MCP needed
export async function lookupCreator(handle) {
  const apiKey = process.env.LUNARCRUSH_API_KEY
  
  if (!apiKey) {
    throw new Error('LUNARCRUSH_API_KEY environment variable is required')
  }

  try {
    console.log('🔍 Looking up creator via LunarCrush API:', handle)
    
    // Use LunarCrush API directly
    const response = await fetch(`https://lunarcrush.com/api4/public/influencer/details/${handle}?key=${apiKey}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Creator '${handle}' not found in LunarCrush database`)
      }
      if (response.status === 429) {
        throw new Error('LunarCrush API rate limit exceeded')
      }
      if (response.status === 401) {
        throw new Error('LunarCrush API authentication failed - check API key')
      }
      throw new Error(`LunarCrush API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ LunarCrush API response:', data)

    if (!data || !data.data) {
      throw new Error(`No data available for creator '${handle}'`)
    }

    const creatorData = data.data
    
    // Return standardized format
    return {
      handle: handle,
      followerCount: creatorData.followers || creatorData.follower_count || 0,
      followers: creatorData.followers || creatorData.follower_count || 0,
      influenceScore: creatorData.influence_score || null,
      engagement: creatorData.engagement_rate || null,
      verified: creatorData.verified || false,
      bio: creatorData.bio || null,
      location: creatorData.location || null,
      source: 'LunarCrush API Direct'
    }
  } catch (error) {
    console.error('❌ LunarCrush API error:', error)
    throw error
  }
}

export default { lookupCreator }
