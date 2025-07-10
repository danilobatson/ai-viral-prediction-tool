import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { postData } = req.body;

    if (!postData || !postData.text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Post content is required' 
      });
    }

    console.log('🎯 Enhanced Viral Analysis Request:', {
      text: postData.text.substring(0, 100) + '...',
      creator: postData.creator,
      platform: postData.platform,
      niche: postData.niche,
      contentType: postData.contentType
    });

    // Enhanced prompt for better viral prediction with real creator data
    const enhancedPrompt = `
You are an expert social media analyst specializing in viral content prediction. Analyze this ${postData.platform || 'Twitter'} post for viral potential.

POST CONTENT: "${postData.text}"

CREATOR DATA (from LunarCrush API):
- Handle: @${postData.creator?.handle || 'anonymous'}
- Followers: ${postData.creator?.follower_count?.toLocaleString() || 'Unknown'}
- Verified: ${postData.creator?.verified ? 'Yes' : 'No'}
- Authority Score: ${postData.creator?.authority_score || 'Not available'}

CONTEXT:
- Platform: ${postData.platform || 'Twitter'}
- Content Type: ${postData.contentType || 'text'}
- Niche: ${postData.niche || 'general'}
- Hashtags: ${postData.hashtags?.join(', ') || 'None detected'}
- Mentions: ${postData.mentions?.join(', ') || 'None detected'}
- Media: ${postData.media_count > 0 ? 'Yes' : 'No'}

ANALYSIS REQUIREMENTS:
1. Viral Probability (0-100): Based on content, creator authority, timing, and engagement patterns
2. Platform Optimization: How well this content fits Twitter's algorithm and user behavior
3. Creator Authority Impact: How the creator's real follower count and verification affects viral potential
4. Content Optimization: 3 specific ways to improve viral potential
5. Timing Insights: Best posting times for maximum reach
6. Hashtag Strategy: Trending hashtags that could boost visibility
7. Engagement Predictions: Expected likes, retweets, comments based on creator data

RESPONSE FORMAT (JSON):
{
  "confidence": [0-100 number],
  "platformFit": [0-100 number],
  "contentScore": [0-100 number], 
  "creatorAuthorityImpact": [0-100 number],
  "expectedEngagement": [estimated total interactions],
  "optimizedVersions": [
    "Version 1: [optimized tweet]",
    "Version 2: [optimized tweet]", 
    "Version 3: [optimized tweet]"
  ],
  "hashtagRecommendations": [
    "#trending1", "#trending2", "#trending3"
  ],
  "timingInsights": [
    "insight 1", "insight 2", "insight 3"
  ],
  "insights": [
    "key insight 1", "key insight 2", "key insight 3"
  ],
  "improvementSuggestions": [
    "specific improvement 1",
    "specific improvement 2", 
    "specific improvement 3"
  ]
}

Focus on actionable, data-driven recommendations. Use the real creator data to provide accurate engagement predictions.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp' });
    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    const text = response.text();

    console.log('🤖 Raw Gemini Response:', text.substring(0, 200) + '...');

    // Parse AI response
    let aiAnalysis;
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      // Fallback analysis with real creator data
      aiAnalysis = generateFallbackAnalysis(postData);
    }

    // Enhance analysis with creator authority scoring
    const enhancedAnalysis = enhanceWithCreatorData(aiAnalysis, postData.creator);

    // Final response structure
    const finalResponse = {
      success: true,
      prediction: {
        confidence: Math.min(Math.max(enhancedAnalysis.confidence || 50, 0), 100),
        platformFit: enhancedAnalysis.platformFit || 85,
        contentScore: enhancedAnalysis.contentScore || 75,
        creatorAuthorityImpact: enhancedAnalysis.creatorAuthorityImpact || 60,
        expectedEngagement: enhancedAnalysis.expectedEngagement || calculateExpectedEngagement(postData.creator),
        optimizedVersions: enhancedAnalysis.optimizedVersions || [
          "Enhanced version with better hooks and timing",
          "Optimized version with trending hashtags",
          "Improved version with stronger call-to-action"
        ],
        hashtagRecommendations: enhancedAnalysis.hashtagRecommendations || ['#trending', '#viral', '#social'],
        timingInsights: enhancedAnalysis.timingInsights || [
          "Post during peak hours (9-11 AM EST)",
          "Tuesday-Thursday shows highest engagement",
          "Include visuals for 150% better performance"
        ],
        insights: enhancedAnalysis.insights || [
          "Content shows strong emotional appeal",
          "Creator authority is in optimal viral range",
          "Hashtag strategy needs optimization"
        ],
        improvementSuggestions: enhancedAnalysis.improvementSuggestions || [
          "Add trending hashtags for better discoverability",
          "Include a clear call-to-action",
          "Optimize posting time for your audience"
        ]
      },
      metadata: {
        aiModel: 'gemini-2.0-flash-thinking-exp',
        creatorDataSource: postData.creator?.handle ? 'LunarCrush API' : 'fallback',
        analysisTimestamp: new Date().toISOString(),
        enhancedFeatures: {
          realCreatorData: !!postData.creator?.handle,
          aiOptimization: true,
          hashtagIntelligence: true,
          timingAnalysis: true
        }
      }
    };

    console.log('✅ Enhanced Analysis Complete:', {
      confidence: finalResponse.prediction.confidence,
      creatorData: !!postData.creator?.handle,
      expectedEngagement: finalResponse.prediction.expectedEngagement
    });

    res.status(200).json(finalResponse);

  } catch (error) {
    console.error('❌ Enhanced Analysis Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Analysis failed. Please try again.',
      details: error.message 
    });
  }
}

// Helper function to enhance analysis with real creator data
function enhanceWithCreatorData(analysis, creator) {
  if (!creator || !creator.follower_count) {
    return analysis;
  }

  const followerCount = creator.follower_count;
  const isVerified = creator.verified;

  // Calculate creator authority impact based on real data
  let authorityMultiplier = 1.0;
  
  // Follower count impact (sweet spot: 50K-500K)
  if (followerCount >= 50000 && followerCount <= 500000) {
    authorityMultiplier += 0.3; // 30% boost for optimal range
  } else if (followerCount >= 10000) {
    authorityMultiplier += 0.2; // 20% boost for established creators
  } else if (followerCount >= 1000) {
    authorityMultiplier += 0.1; // 10% boost for growing creators
  }

  // Verification boost
  if (isVerified) {
    authorityMultiplier += 0.15; // 15% boost for verified accounts
  }

  // Apply multiplier to confidence
  const enhancedConfidence = Math.min(
    Math.floor((analysis.confidence || 50) * authorityMultiplier), 
    100
  );

  return {
    ...analysis,
    confidence: enhancedConfidence,
    creatorAuthorityImpact: Math.floor(authorityMultiplier * 100 - 100),
    expectedEngagement: calculateExpectedEngagement(creator)
  };
}

// Calculate realistic engagement based on creator data
function calculateExpectedEngagement(creator) {
  if (!creator || !creator.follower_count) {
    return 50; // Default fallback
  }

  const followerCount = creator.follower_count;
  let engagementRate = 0.03; // Base 3% engagement rate

  // Adjust engagement rate based on follower count
  if (followerCount < 1000) {
    engagementRate = 0.08; // Higher rate for smaller accounts
  } else if (followerCount < 10000) {
    engagementRate = 0.06;
  } else if (followerCount < 100000) {
    engagementRate = 0.04;
  } else {
    engagementRate = 0.02; // Lower rate for mega accounts
  }

  // Verification boost
  if (creator.verified) {
    engagementRate *= 1.5;
  }

  return Math.floor(followerCount * engagementRate);
}

// Fallback analysis when AI parsing fails
function generateFallbackAnalysis(postData) {
  const hasHashtags = postData.hashtags && postData.hashtags.length > 0;
  const hasMedia = postData.media_count > 0;
  const textLength = postData.text.length;
  
  let baseConfidence = 40;
  
  // Content-based scoring
  if (hasHashtags) baseConfidence += 15;
  if (hasMedia) baseConfidence += 20;
  if (textLength > 50 && textLength < 200) baseConfidence += 10;
  
  // Niche boost
  if (['cryptocurrency', 'technology', 'ai'].includes(postData.niche)) {
    baseConfidence += 10;
  }

  return {
    confidence: Math.min(baseConfidence, 90),
    platformFit: 80,
    contentScore: 70,
    optimizedVersions: [
      `${postData.text} 🚀 #trending`,
      `🔥 ${postData.text}`,
      `${postData.text} What do you think? 💭`
    ]
  };
}
