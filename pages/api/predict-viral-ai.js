import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Enhanced Viral Prediction API - Production Ready
 * Fixed version with flexible environment variable naming
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Check for API key with flexible naming
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY or GOOGLE_GEMINI_API_KEY' 
      });
    }

    const { postData, creatorData, options = {} } = req.body;

    // Enhanced input validation
    if (!postData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field: postData' 
      });
    }

    if (!postData.text || postData.text.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field: postData.text' 
      });
    }

    // Sanitize and validate text length
    const text = postData.text.trim();
    if (text.length > 50000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Post text too long. Maximum 50,000 characters allowed.' 
      });
    }

    // Set defaults for missing fields
    const platform = postData.platform || 'twitter';
    const niche = postData.niche || 'crypto';
    const contentType = postData.contentType || 'text';

    // Enhanced content analysis
    const contentMetrics = analyzeContentMetrics(text);
    const timingFactors = analyzeTimingFactors(postData);
    const platformFactors = analyzePlatformFactors(platform);

    // Construct optimized Gemini prompt
    const prompt = constructOptimizedPrompt({
      postData: { ...postData, text, platform, niche, contentType },
      creatorData,
      contentMetrics,
      timingFactors,
      platformFactors,
      options
    });

    // Call Gemini API with error handling
    let aiAnalysis = '';
    let aiScore = 50;
    let aiConfidence = 70;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-lite',
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiAnalysis = response.text();

      // Parse AI response
      const parsedResponse = parseAIResponse(aiAnalysis);
      aiScore = parsedResponse.viralScore;
      aiConfidence = parsedResponse.confidence;

    } catch (aiError) {
      console.warn('Gemini API error, using fallback analysis:', aiError.message);
      // Continue with algorithmic analysis only
      aiAnalysis = 'AI analysis unavailable, using algorithmic prediction only.';
    }

    // Calculate final viral probability using hybrid approach
    const viralProbability = calculateHybridViralProbability({
      aiScore,
      contentMetrics,
      timingFactors,
      platformFactors,
      creatorData
    });

    // Calculate confidence based on data quality
    const confidence = calculateConfidence({
      aiConfidence,
      dataQuality: assessDataQuality({ postData, creatorData }),
      platformSupport: platformFactors.mcpSupported
    });

    const finalResponse = {
      success: true,
      viralProbability: Math.round(Math.max(0, Math.min(100, viralProbability))),
      confidence: Math.round(Math.max(30, Math.min(100, confidence))),
      category: categorizeViralPotential(viralProbability),
      expectedEngagement: calculateExpectedEngagement(viralProbability, creatorData),
      
      // Detailed breakdown
      componentScores: {
        aiScore: Math.round(aiScore),
        contentScore: contentMetrics.overallScore,
        timingScore: timingFactors.score,
        platformScore: platformFactors.score,
        creatorScore: calculateCreatorScore(creatorData)
      },
      
      // AI insights
      aiAnalysis: aiAnalysis.substring(0, 500), // Limit length
      keyFactors: extractKeyFactors(aiAnalysis, contentMetrics),
      recommendations: generateRecommendations(viralProbability, contentMetrics),
      
      // Technical metadata
      metadata: {
        model: 'gemini-2.0-flash-lite',
        timestamp: new Date().toISOString(),
        dataSource: platformFactors.mcpSupported ? 'MCP + AI' : 'AI Analysis',
        promptVersion: '3.1',
        textLength: text.length,
        processingMethod: 'hybrid',
        apiKeySource: process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'GOOGLE_GEMINI_API_KEY'
      }
    };

    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Viral prediction error:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: process.env.NODE_ENV === 'development' 
        ? `Internal server error: ${error.message}` 
        : 'Internal server error during analysis',
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Construct optimized prompt for Gemini AI
 */
function constructOptimizedPrompt({ postData, creatorData, contentMetrics, timingFactors, platformFactors, options }) {
  return `You are an expert social media analyst. Analyze this post for viral potential.

POST: "${postData.text}"
PLATFORM: ${postData.platform}
NICHE: ${postData.niche}

Provide your analysis as JSON:
{
  "viralScore": [0-100],
  "confidence": [0-100], 
  "analysis": "Brief analysis explaining viral potential",
  "keyFactors": ["factor1", "factor2"],
  "recommendations": ["rec1", "rec2"]
}`;
}

/**
 * Analyze content metrics from post text
 */
function analyzeContentMetrics(text) {
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;
  const hashtagCount = (text.match(/#\w+/g) || []).length;
  const mentionCount = (text.match(/@\w+/g) || []).length;
  const urlCount = (text.match(/https?:\/\/\S+/g) || []).length;
  
  // Emotional markers
  const emotionalMarkers = [];
  if (/🚀|🔥|amazing|incredible|wow/gi.test(text)) emotionalMarkers.push('excitement');
  if (/breaking|urgent|now|today/gi.test(text)) emotionalMarkers.push('urgency');
  if (/\?|what if|imagine/gi.test(text)) emotionalMarkers.push('curiosity');
  if (/\d+%|\d+x|\$\d+/gi.test(text)) emotionalMarkers.push('numbers');

  // Specificity score (0-10)
  let specificityScore = 0;
  if (text.match(/\d+/)) specificityScore += 2;
  if (hashtagCount > 0) specificityScore += 1;
  if (emotionalMarkers.length > 0) specificityScore += 2;
  if (wordCount >= 10 && wordCount <= 50) specificityScore += 2;

  const overallScore = Math.min(10, specificityScore + emotionalMarkers.length);

  return {
    wordCount,
    charCount,
    hashtagCount,
    mentionCount,
    urlCount,
    emotionalMarkers,
    specificityScore: Math.min(10, specificityScore),
    overallScore: Math.round(overallScore)
  };
}

/**
 * Analyze timing factors
 */
function analyzeTimingFactors(postData) {
  const now = new Date();
  const hour = now.getUTCHours();
  const day = now.getUTCDay();
  
  const optimalHours = [12, 13, 14, 15, 16];
  const optimalDays = [1, 2, 3, 4];
  
  let score = 5;
  if (optimalHours.includes(hour)) score += 3;
  if (optimalDays.includes(day)) score += 2;
  
  return {
    hour,
    day,
    isOptimalTime: optimalHours.includes(hour) && optimalDays.includes(day),
    score: Math.min(10, score),
    description: `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]} ${hour}:00 UTC`
  };
}

/**
 * Analyze platform-specific factors
 */
function analyzePlatformFactors(platform) {
  const platformConfig = {
    twitter: { mcpSupported: true, score: 10, features: ['hashtags', 'mentions'] },
    x: { mcpSupported: true, score: 10, features: ['hashtags', 'mentions'] },
    reddit: { mcpSupported: true, score: 8, features: ['upvotes', 'comments'] },
    youtube: { mcpSupported: true, score: 7, features: ['views', 'subscribers'] },
    instagram: { mcpSupported: false, score: 5, features: ['visual', 'stories'] },
    linkedin: { mcpSupported: false, score: 6, features: ['professional'] },
    tiktok: { mcpSupported: false, score: 4, features: ['viral', 'young_audience'] }
  };

  return platformConfig[platform.toLowerCase()] || { mcpSupported: false, score: 3, features: [] };
}

/**
 * Parse AI response into structured data
 */
function parseAIResponse(aiText) {
  try {
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        viralScore: Math.max(0, Math.min(100, parsed.viralScore || 50)),
        confidence: Math.max(0, Math.min(100, parsed.confidence || 70)),
        analysis: parsed.analysis || 'Analysis completed',
        keyFactors: Array.isArray(parsed.keyFactors) ? parsed.keyFactors : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : []
      };
    }
  } catch (error) {
    console.warn('Failed to parse AI JSON response:', error);
  }

  // Fallback parsing
  return {
    viralScore: 50,
    confidence: 70,
    analysis: 'Analysis completed using algorithmic methods',
    keyFactors: ['Content analysis', 'Timing factors'],
    recommendations: ['Add emotional content', 'Optimize timing']
  };
}

/**
 * Calculate hybrid viral probability
 */
function calculateHybridViralProbability({ aiScore, contentMetrics, timingFactors, platformFactors, creatorData }) {
  const weights = {
    ai: 0.4,
    content: 0.25,
    timing: 0.15,
    platform: 0.1,
    creator: 0.1
  };

  const creatorScore = calculateCreatorScore(creatorData);
  
  const weightedScore = 
    (aiScore * weights.ai) +
    (contentMetrics.overallScore * 10 * weights.content) +
    (timingFactors.score * 10 * weights.timing) +
    (platformFactors.score * 10 * weights.platform) +
    (creatorScore * weights.creator);

  return Math.min(100, Math.max(0, weightedScore));
}

/**
 * Calculate creator authority score
 */
function calculateCreatorScore(creatorData) {
  if (!creatorData) return 50;

  let score = 30; // Base score
  
  const followers = creatorData.followers || 0;
  if (followers >= 50000 && followers <= 500000) score += 30;
  else if (followers >= 10000) score += 20;
  else if (followers >= 1000) score += 10;
  
  const engagementRate = creatorData.engagementRate || 0;
  if (engagementRate >= 3) score += 20;
  else if (engagementRate >= 1) score += 10;
  
  if (creatorData.verified) score += 20;

  return Math.min(100, score);
}

/**
 * Calculate confidence based on data quality
 */
function calculateConfidence({ aiConfidence, dataQuality, platformSupport }) {
  let confidence = aiConfidence || 70;
  confidence *= dataQuality;
  if (platformSupport) confidence *= 1.1;
  return Math.min(100, Math.max(30, confidence));
}

/**
 * Assess data quality (0.7 - 1.0)
 */
function assessDataQuality({ postData, creatorData }) {
  let quality = 0.7;
  if (postData.text && postData.text.length > 10) quality += 0.1;
  if (creatorData && creatorData.followers) quality += 0.1;
  if (postData.platform) quality += 0.05;
  if (postData.niche) quality += 0.05;
  return Math.min(1.0, quality);
}

/**
 * Categorize viral potential
 */
function categorizeViralPotential(score) {
  if (score >= 85) return 'Ultra Viral';
  if (score >= 70) return 'High Viral';
  if (score >= 50) return 'Moderate Viral';
  if (score >= 30) return 'Low Viral';
  return 'Minimal Viral';
}

/**
 * Calculate expected engagement
 */
function calculateExpectedEngagement(viralProbability, creatorData) {
  const baseEngagement = (creatorData?.followers || 1000) * 0.02;
  const viralMultiplier = 1 + (viralProbability / 100) * 5;
  return Math.round(baseEngagement * viralMultiplier);
}

/**
 * Extract key factors
 */
function extractKeyFactors(aiAnalysis, contentMetrics) {
  const factors = [];
  if (contentMetrics.emotionalMarkers.length > 0) factors.push('Emotional content');
  if (contentMetrics.hashtagCount > 0) factors.push('Hashtag usage');
  if (contentMetrics.wordCount >= 10 && contentMetrics.wordCount <= 50) factors.push('Optimal length');
  return factors.slice(0, 5);
}

/**
 * Generate recommendations
 */
function generateRecommendations(viralProbability, contentMetrics) {
  const recommendations = [];
  if (viralProbability < 70) recommendations.push('Add more emotional content');
  if (contentMetrics.hashtagCount === 0) recommendations.push('Include relevant hashtags');
  if (contentMetrics.emotionalMarkers.length === 0) recommendations.push('Add excitement or urgency');
  return recommendations.slice(0, 4);
}
