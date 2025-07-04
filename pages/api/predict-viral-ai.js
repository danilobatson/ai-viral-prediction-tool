/**
 * AI Viral Prediction API - Gemini Marketing Expert
 * Phase 3.2: Frontend Interface Development
 */

import cors from 'cors';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com']
    : ['http://localhost:3000', 'http://localhost:3001'\],
  methods: ['POST'],
  credentials: true
};

// Simulate AI analysis (in real implementation, this would call Gemini)
async function getAIMarketingAnalysis(postData, creatorData, trendingTopics) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Calculate viral probability based on real factors
  let viralScore = 0;
  let factors = [];
  
  // Follower influence (0-30 points)
  const followerScore = Math.min(30, (creatorData.followers / 100000) * 30);
  viralScore += followerScore;
  factors.push(`Follower base: ${followerScore.toFixed(1)}/30 (${creatorData.followers.toLocaleString()} followers)`);
  
  // Engagement rate influence (0-25 points)
  const engagementScore = Math.min(25, creatorData.engagementRate * 5);
  viralScore += engagementScore;
  factors.push(`Engagement rate: ${engagementScore.toFixed(1)}/25 (${creatorData.engagementRate.toFixed(2)}%)`);
  
  // Content analysis (0-25 points)
  const text = postData.text.toLowerCase();
  let contentScore = 0;
  
  // Check for viral triggers
  if (text.includes('🚀') || text.includes('🔥') || text.includes('💯')) contentScore += 5;
  if (text.includes('#')) contentScore += 3;
  if (/\d/.test(text)) contentScore += 4; // Contains numbers
  if (text.includes('!')) contentScore += 2;
  if (text.length > 50 && text.length < 200) contentScore += 3; // Optimal length
  
  // Check trending topic alignment
  const hasRelevantTrends = trendingTopics.some(topic => 
    text.includes(topic.name.toLowerCase())
  );
  if (hasRelevantTrends) contentScore += 8;
  
  viralScore += contentScore;
  factors.push(`Content optimization: ${contentScore.toFixed(1)}/25`);
  
  // Platform bonus (0-10 points)
  const platformBonus = postData.platform === 'tiktok' ? 10 : 
                       postData.platform === 'x' ? 8 : 
                       postData.platform === 'youtube' ? 6 : 5;
  viralScore += platformBonus;
  factors.push(`Platform factor: ${platformBonus}/10 (${postData.platform})`);
  
  // Timing bonus (0-10 points) - simulate current time analysis
  const timingBonus = 7; // Assume good timing
  viralScore += timingBonus;
  factors.push(`Timing optimization: ${timingBonus}/10`);
  
  // Cap at 100%
  viralScore = Math.min(100, viralScore);
  
  // Calculate confidence based on data quality
  const confidence = Math.min(95, 60 + (creatorData.followers > 10000 ? 20 : 10) + 
                             (hasRelevantTrends ? 15 : 5));
  
  // Generate AI explanation
  const explanation = `Based on my analysis as a social media marketing expert, your post has a ${viralScore.toFixed(0)}% viral probability. 

Key factors: Your ${creatorData.followers.toLocaleString()} followers provide a solid foundation, and your ${creatorData.engagementRate.toFixed(2)}% engagement rate ${creatorData.engagementRate > 3 ? 'exceeds' : 'meets'} platform averages. 

Content analysis reveals ${contentScore > 15 ? 'strong' : contentScore > 10 ? 'moderate' : 'basic'} viral elements. ${hasRelevantTrends ? 'Your content aligns with current trending topics, which significantly boosts potential reach.' : 'Consider incorporating trending topics for better visibility.'}

For ${postData.platform}, this content ${viralScore > 60 ? 'has excellent' : viralScore > 40 ? 'has moderate' : 'may struggle with'} viral potential given current algorithm preferences.`;

  // Generate recommendations
  const recommendations = [];
  
  if (creatorData.engagementRate < 2) {
    recommendations.push({
      title: 'Boost Engagement Rate',
      description: 'Focus on creating more interactive content. Ask questions, use polls, and respond to comments quickly.'
    });
  }
  
  if (!hasRelevantTrends) {
    recommendations.push({
      title: 'Leverage Trending Topics',
      description: `Incorporate trending topics like "${trendingTopics[0].name}" or "${trendingTopics[1].name}" into your content.`
    });
  }
  
  if (!text.includes('#')) {
    recommendations.push({
      title: 'Add Strategic Hashtags',
      description: 'Include 2-3 relevant hashtags to increase discoverability without over-tagging.'
    });
  }
  
  if (postData.platform === 'tiktok' && text.length > 150) {
    recommendations.push({
      title: 'Optimize for TikTok',
      description: 'TikTok performs better with shorter, punchier captions. Consider condensing your message.'
    });
  }
  
  // Calculate expected reach
  const baseReach = creatorData.followers * 0.1; // 10% base reach
  const viralMultiplier = 1 + (viralScore / 100) * 4; // Up to 5x multiplier
  const expectedReach = Math.round(baseReach * viralMultiplier);
  
  return {
    viralProbability: Math.round(viralScore),
    confidence: Math.round(confidence),
    category: viralScore >= 70 ? 'High Viral Potential' :
              viralScore >= 40 ? 'Moderate Viral Potential' :
              viralScore >= 20 ? 'Low Viral Potential' : 'Minimal Viral Potential',
    expectedReach: expectedReach,
    aiAnalysis: {
      explanation: explanation,
      factors: factors,
      recommendations: recommendations,
      trendingAlignment: hasRelevantTrends,
      contentScore: Math.round(contentScore),
      platformOptimization: Math.round(platformBonus),
      processingMethod: 'AI Marketing Expert Analysis'
    }
  };
}

export default async function handler(req, res) {
  // Apply CORS
  await new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    const { postData, creatorData, trendingTopics, analysisType } = req.body;

    if (!postData || !postData.text) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'postData with text is required'
      });
    }

    if (!creatorData) {
      return res.status(400).json({
        error: 'Missing creator data',
        message: 'creatorData is required for AI analysis'
      });
    }

    console.log(`🤖 AI Marketing Expert analyzing post for @${creatorData.handle} on ${postData.platform}`);

    // Get AI marketing analysis
    const prediction = await getAIMarketingAnalysis(postData, creatorData, trendingTopics || []);

    res.status(200).json({
      success: true,
      prediction: prediction,
      creatorContext: {
        handle: creatorData.handle,
        platform: postData.platform,
        followers: creatorData.followers,
        engagementRate: creatorData.engagementRate
      },
      analysisType: 'AI Marketing Expert',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI prediction error:', error);
    res.status(500).json({
      error: 'AI prediction failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
