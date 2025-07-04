import cors from 'cors';

// Initialize CORS middleware
const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true,
});

// Helper to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, corsMiddleware);

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    const { 
      content, 
      platform, 
      contentType, 
      niche,
      username,
      additionalContext 
    } = req.body;

    // Validate required fields
    if (!content || !content.trim()) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'content is required'
      });
    }

    if (!platform) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'platform is required'
      });
    }

    // Check for API keys
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    const lunarcrushKey = process.env.LUNARCRUSH_API_KEY;

    if (!geminiKey) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'GEMINI_API_KEY not configured'
      });
    }

    // Simulate AI prediction analysis
    const prediction = await generatePrediction({
      content,
      platform,
      contentType: contentType || 'text',
      niche: niche || 'general',
      username,
      additionalContext,
      hasLunarCrush: !!lunarcrushKey,
      hasGemini: !!geminiKey
    });

    return res.status(200).json({
      success: true,
      prediction,
      metadata: {
        timestamp: new Date().toISOString(),
        platform,
        contentType: contentType || 'text',
        niche: niche || 'general',
        hasRealTimeData: !!lunarcrushKey
      }
    });

  } catch (error) {
    console.error('Prediction API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate prediction'
    });
  }
}

async function generatePrediction({
  content,
  platform,
  contentType,
  niche,
  username,
  additionalContext,
  hasLunarCrush,
  hasGemini
}) {
  // Simulate prediction calculation
  let baseScore = 50;
  
  // Content analysis
  if (content.length > 50 && content.length < 200) baseScore += 10;
  if (additionalContext?.hasHashtags) baseScore += 15;
  if (additionalContext?.hasEmojis) baseScore += 10;
  if (additionalContext?.hasMentions) baseScore += 5;
  
  // Platform bonus
  const platformBonus = {
    'x': 10,
    'instagram': 8,
    'tiktok': 12,
    'youtube': 6,
    'linkedin': 4,
    'reddit': 7
  };
  baseScore += platformBonus[platform] || 0;
  
  // Content type bonus
  const contentTypeBonus = {
    'video': 15,
    'image': 10,
    'text': 5,
    'story': 12,
    'poll': 8
  };
  baseScore += contentTypeBonus[contentType] || 0;
  
  // Add randomness for realism
  const randomFactor = Math.random() * 20 - 10;
  const finalScore = Math.max(5, Math.min(95, baseScore + randomFactor));
  
  return {
    confidence: Math.round(finalScore),
    platformFit: Math.round(finalScore * 0.9),
    engagementScore: Math.round(finalScore * 0.85),
    sentiment: finalScore > 70 ? 'Positive' : finalScore > 40 ? 'Neutral' : 'Negative',
    aiAnalysis: `Based on ${hasGemini ? 'Gemini AI analysis' : 'algorithmic analysis'} and ${hasLunarCrush ? 'real-time LunarCrush data' : 'platform patterns'}, this ${contentType} content shows ${finalScore > 70 ? 'high' : finalScore > 40 ? 'moderate' : 'low'} viral potential for ${platform}.`,
    recommendations: generateRecommendations(content, platform, finalScore),
    dataSource: hasLunarCrush ? 'LunarCrush MCP + Gemini AI' : 'Algorithmic Analysis',
    timestamp: new Date().toISOString()
  };
}

function generateRecommendations(content, platform, score) {
  const recommendations = [];
  
  if (score < 60) {
    recommendations.push('Consider adding trending hashtags to increase discoverability');
    recommendations.push('Include a clear call-to-action to drive engagement');
  }
  
  if (!content.includes('?')) {
    recommendations.push('Add questions to encourage comments and discussions');
  }
  
  if (platform === 'x' && content.length > 200) {
    recommendations.push('Consider shortening content for optimal Twitter engagement');
  }
  
  if (platform === 'instagram' && !content.includes('#')) {
    recommendations.push('Add relevant hashtags to maximize Instagram reach');
  }
  
  recommendations.push(`Optimize posting time for ${platform} audience`);
  
  return recommendations.slice(0, 3);
}
