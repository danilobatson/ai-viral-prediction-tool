// Direct LunarCrush API integration (more reliable than MCP for production)
export class LunarCrushAPI {
  constructor() {
    this.apiKey = process.env.LUNARCRUSH_API_KEY;
    this.baseUrl = 'https://lunarcrush.com/api/4'\;
  }

  async lookupCreator(username, network = 'x') {
    if (!this.apiKey) {
      throw new Error('LunarCrush API key not configured');
    }

    try {
      // Clean username
      const cleanUsername = username.replace('@', '').trim();
      
      // Call LunarCrush Creator API
      const url = `${this.baseUrl}/creator/${network}/${cleanUsername}`;
      
      console.log(`🔍 Fetching creator data from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Creator @${cleanUsername} not found on ${network}`);
        }
        if (response.status === 401) {
          throw new Error('Invalid LunarCrush API key');
        }
        throw new Error(`LunarCrush API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseCreatorData(data);

    } catch (error) {
      console.error('❌ LunarCrush API error:', error);
      throw error;
    }
  }

  parseCreatorData(apiResponse) {
    // Parse LunarCrush API response and extract key metrics
    const data = {
      followers: null,
      engagements: null,
      creatorRank: null,
      verified: null,
      socialInfluence: null
    };

    try {
      // Extract metrics from API response
      if (apiResponse.followers) {
        data.followers = parseInt(apiResponse.followers);
      }
      
      if (apiResponse.engagements) {
        data.engagements = parseInt(apiResponse.engagements);
      }
      
      if (apiResponse.creator_rank || apiResponse.creatorRank) {
        data.creatorRank = parseInt(apiResponse.creator_rank || apiResponse.creatorRank);
      }
      
      if (apiResponse.verified !== undefined) {
        data.verified = apiResponse.verified;
      }
      
      if (apiResponse.social_influence || apiResponse.socialInfluence) {
        data.socialInfluence = apiResponse.social_influence || apiResponse.socialInfluence;
      }

    } catch (parseError) {
      console.warn('⚠️ Error parsing creator data:', parseError);
    }

    return data;
  }
}

// Singleton instance
let apiInstance = null;

export function getLunarCrushAPI() {
  if (!apiInstance) {
    apiInstance = new LunarCrushAPI();
  }
  return apiInstance;
}
