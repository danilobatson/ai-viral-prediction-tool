/**
 * Viral Prediction API - OPTIMIZED GEMINI PROMPTING
 * Enhanced prompt engineering for better AI analysis accuracy
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({
			success: false,
			error: 'Method not allowed. Use POST.',
		});
	}

	try {
		const { content, creatorData } = req.body;

		if (!content) {
			return res.status(400).json({
				success: false,
				error: 'Missing required field: content',
			});
		}

		// Strict API key validation
		const geminiKey = process.env.GOOGLE_AI_API_KEY;
		if (!geminiKey || geminiKey.includes('your_')) {
			return res.status(400).json({
				success: false,
				error: 'Google AI API key not configured. Please configure GOOGLE_AI_API_KEY environment variable.',
				requiresSetup: true,
			});
		}

		console.log('🤖 Starting OPTIMIZED AI viral prediction analysis...');
		console.log('📝 Content length:', content.length);
		console.log('👤 Creator followers:', creatorData?.followers?.toLocaleString() || 'Unknown');

		// Validate we have real creator data
		if (!creatorData || !creatorData.followers) {
			return res.status(400).json({
				success: false,
				error: 'Creator data with follower count is required for viral prediction.',
				hint: 'Use the creator lookup API first to get real social data.',
			});
		}

		// Initialize Gemini with enhanced configuration
		const genAI = new GoogleGenerativeAI(geminiKey);
		const model = genAI.getGenerativeModel({ 
			model: 'gemini-2.0-flash-lite',
			generationConfig: {
				temperature: 0.3, // Slightly creative but focused
				topP: 0.9,
				topK: 40,
				maxOutputTokens: 800, // Enough for detailed analysis
			}
		});

		// Build optimized prompt with enhanced context
		const prompt = buildOptimizedPrompt(content, creatorData);

		// Execute AI analysis with timeout
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error('AI analysis timeout after 30 seconds')), 30000);
		});

		const analysisPromise = model.generateContent(prompt)
			.then(result => result.response)
			.then(response => response.text());

		const aiResponse = await Promise.race([analysisPromise, timeoutPromise]);

		console.log('🧠 AI Analysis Response Length:', aiResponse.length);

		// Enhanced JSON parsing with better error handling
		let analysisData;
		try {
			// Extract JSON from response (handle markdown formatting)
			const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No JSON found in AI response');
			}
			
			const jsonString = jsonMatch[0]
				.replace(/```json\n?/g, '')
				.replace(/```\n?/g, '')
				.trim();
			
			analysisData = JSON.parse(jsonString);
			
			// Enhanced validation with detailed field checking
			const requiredFields = ['confidence', 'viralFactors', 'expectedEngagement', 'keyInsights'];
			for (const field of requiredFields) {
				if (analysisData[field] === undefined || analysisData[field] === null) {
					throw new Error(`Missing required field: ${field}`);
				}
			}
			
			// Validate viralFactors sub-object
			if (typeof analysisData.viralFactors !== 'object') {
				throw new Error('viralFactors must be an object');
			}
			
		} catch (parseError) {
			console.error('❌ JSON Parsing Error:', parseError.message);
			console.error('Raw AI Response:', aiResponse.substring(0, 500));
			
			return res.status(500).json({
				success: false,
				error: 'AI response parsing failed',
				message: 'Unable to parse AI analysis results',
				details: parseError.message,
				rawResponse: aiResponse.substring(0, 200) + '...'
			});
		}

		// Apply final realistic constraints
		const finalAnalysis = applyEnhancedConstraints(analysisData, creatorData);

		console.log('✅ Analysis complete:', {
			confidence: finalAnalysis.confidence,
			viralProbability: finalAnalysis.viralProbability,
			expectedEngagement: finalAnalysis.expectedEngagement
		});

		res.status(200).json({
			success: true,
			analysis: finalAnalysis,
			metadata: {
				creatorTier: getCreatorTier(creatorData.followers),
				processingTime: new Date().toISOString(),
				modelUsed: 'gemini-2.0-flash-lite'
			}
		});

	} catch (error) {
		console.error('❌ API Error:', error);
		
		if (error.message.includes('timeout')) {
			return res.status(408).json({
				success: false,
				error: 'Request timeout',
				message: 'AI analysis took too long to complete'
			});
		}
		
		if (error.message.includes('API_KEY') || error.message.includes('invalid')) {
			return res.status(401).json({
				success: false,
				error: 'Authentication failed',
				message: 'Invalid Google AI API key'
			});
		}
		
		return res.status(500).json({
			success: false,
			error: 'Analysis failed',
			message: error.message || 'Unknown error occurred',
			details: process.env.NODE_ENV === 'development' ? error.stack : undefined
		});
	}
}

function buildOptimizedPrompt(content, creatorData) {
	const followers = creatorData?.followers || 0;
	const engagement = creatorData?.engagements || 0;
	const platform = creatorData?.platform || 'social media';
	
	// Enhanced follower tier analysis
	let followerTier, expectedRange, reachMultiplier;
	if (followers >= 10000000) {
		followerTier = "Mega Creator (10M+)";
		expectedRange = "80-95%";
		reachMultiplier = "5-20x";
	} else if (followers >= 1000000) {
		followerTier = "Large Creator (1M+)";
		expectedRange = "65-85%";
		reachMultiplier = "3-15x";
	} else if (followers >= 100000) {
		followerTier = "Medium Creator (100K+)";
		expectedRange = "50-75%";
		reachMultiplier = "2-10x";
	} else if (followers >= 10000) {
		followerTier = "Small Creator (10K+)";
		expectedRange = "35-60%";
		reachMultiplier = "1.5-5x";
	} else {
		followerTier = "Micro Creator (<10K)";
		expectedRange = "20-45%";
		reachMultiplier = "1-3x";
	}

	return `You are an expert social media analyst with deep knowledge of viral content mechanics across all platforms.

CREATOR PROFILE ANALYSIS:
- Follower Count: ${followers.toLocaleString()}
- Recent Engagements: ${engagement.toLocaleString()}
- Platform: ${platform}
- Creator Category: ${followerTier}
- Realistic Confidence Range: ${expectedRange}
- Typical Reach Multiplier: ${reachMultiplier}

CONTENT FOR VIRAL ANALYSIS:
"${content}"

ANALYSIS FRAMEWORK - Rate each factor (0-100):

1. EMOTIONAL IMPACT: Does this trigger strong emotions (joy, surprise, anger, inspiration)?
2. SHAREABILITY SCORE: Clear reasons why people would share this content
3. TREND ALIGNMENT: How well does this match current social/cultural trends?
4. CREATOR AUTHORITY: This creator's influence and credibility in their niche
5. CONTENT QUALITY: Production value, clarity, and professional presentation
6. ALGORITHM COMPATIBILITY: Platform-specific features that boost visibility

REQUIRED JSON OUTPUT:
{
  "confidence": <percentage within ${expectedRange} range>,
  "viralFactors": {
    "emotionalImpact": <0-100>,
    "shareability": <0-100>,
    "trendAlignment": <0-100>,
    "creatorAuthority": <0-100>,
    "contentQuality": <0-100>,
    "algorithmCompatibility": <0-100>
  },
  "expectedEngagement": <realistic number for ${followers} followers>,
  "peakReachEstimate": <maximum reach using ${reachMultiplier} multiplier>,
  "viralProbability": "<low/medium/high>",
  "keyInsights": [
    "Primary viral strength",
    "Main limitation", 
    "Specific optimization tip"
  ],
  "hashtags": ["#strategic", "#trending", "#hashtags"],
  "confidenceFactors": [
    "Factor increasing confidence",
    "Factor decreasing confidence"
  ],
  "timeToViral": "<hours/days/unlikely>",
  "targetAudience": "Primary demographic this appeals to"
}

STRICT REQUIREMENTS:
- Confidence MUST stay within ${expectedRange} for ${followerTier}
- Expected engagement should be 1-5% of ${followers} followers for typical content
- Peak reach should use ${reachMultiplier} multiplier realistically
- Return ONLY valid JSON - no markdown, explanations, or extra text
- Be specific and actionable in insights`;
}

function applyEnhancedConstraints(data, creatorData) {
	const followers = creatorData?.followers || 0;
	
	// Enhanced confidence constraints
	let maxConfidence, minConfidence;
	if (followers >= 10000000) {
		maxConfidence = 95; minConfidence = 80;
	} else if (followers >= 1000000) {
		maxConfidence = 85; minConfidence = 65;
	} else if (followers >= 100000) {
		maxConfidence = 75; minConfidence = 50;
	} else if (followers >= 10000) {
		maxConfidence = 60; minConfidence = 35;
	} else {
		maxConfidence = 45; minConfidence = 20;
	}

	// Constrain confidence to realistic range
	const confidence = Math.max(minConfidence, Math.min(maxConfidence, data.confidence || 50));
	
	// Validate expected engagement is realistic (1-5% of followers typically)
	const minEngagement = Math.floor(followers * 0.01);
	const maxEngagement = Math.floor(followers * 0.05);
	const expectedEngagement = Math.max(minEngagement, 
		Math.min(maxEngagement, data.expectedEngagement || minEngagement));

	return {
		...data,
		confidence: Math.round(confidence),
		expectedEngagement,
		// Ensure viral factors are within bounds
		viralFactors: data.viralFactors ? {
			emotionalImpact: Math.max(0, Math.min(100, data.viralFactors.emotionalImpact || 0)),
			shareability: Math.max(0, Math.min(100, data.viralFactors.shareability || 0)),
			trendAlignment: Math.max(0, Math.min(100, data.viralFactors.trendAlignment || 0)),
			creatorAuthority: Math.max(0, Math.min(100, data.viralFactors.creatorAuthority || 0)),
			contentQuality: Math.max(0, Math.min(100, data.viralFactors.contentQuality || 0)),
			algorithmCompatibility: Math.max(0, Math.min(100, data.viralFactors.algorithmCompatibility || 0))
		} : {}
	};
}

function getCreatorTier(followers) {
	if (followers >= 10000000) return "mega";
	if (followers >= 1000000) return "large";
	if (followers >= 100000) return "medium";
	if (followers >= 10000) return "small";
	return "micro";
}
