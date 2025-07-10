/**
 * Viral Prediction API - REAL DATA ONLY
 * No fallbacks, no mock data - only MCP + LLM with proper error handling
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

		// Strict API key validation - no fallbacks
		const geminiKey = process.env.GOOGLE_AI_API_KEY;
		if (!geminiKey || geminiKey.includes('your_')) {
			return res.status(400).json({
				success: false,
				error:
					'Google AI API key not configured. Please configure GOOGLE_AI_API_KEY environment variable.',
				requiresSetup: true,
			});
		}

		console.log('🤖 Starting REAL AI viral prediction analysis...');
		console.log('📝 Content length:', content.length);
		console.log(
			'👤 Creator followers:',
			creatorData?.followers?.toLocaleString() || 'Unknown'
		);

		// Validate we have real creator data
		if (!creatorData || !creatorData.followers) {
			return res.status(400).json({
				success: false,
				error:
					'Creator data with follower count is required for viral prediction.',
				hint: 'Use the creator lookup API first to get real social data.',
			});
		}

		// Initialize Gemini with timeout
		const genAI = new GoogleGenerativeAI(geminiKey);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

		// Calculate realistic confidence constraints based on follower count
		const followers = creatorData.followers;
		let maxConfidence, minConfidence;

		if (followers >= 10000000) {
			// 10M+ followers
			maxConfidence = 95;
			minConfidence = 80;
		} else if (followers >= 1000000) {
			// 1M+ followers
			maxConfidence = 85;
			minConfidence = 65;
		} else if (followers >= 100000) {
			// 100K+ followers
			maxConfidence = 75;
			minConfidence = 50;
		} else if (followers >= 10000) {
			// 10K+ followers
			maxConfidence = 60;
			minConfidence = 35;
		} else if (followers >= 1000) {
			// 1K+ followers
			maxConfidence = 45;
			minConfidence = 20;
		} else {
			// <1K followers
			maxConfidence = 30;
			minConfidence = 10;
		}

		// Create analysis prompt for REAL AI analysis
		const prompt = `
You are a social media analytics expert. Analyze this content for viral potential using REAL data.

CONTENT TO ANALYZE: "${content}"

REAL CREATOR DATA:
- Followers: ${followers.toLocaleString()}
- Platform: ${creatorData.platform || 'twitter'}
- Recent Engagements: ${creatorData.engagements || 'Unknown'}

ANALYSIS CONSTRAINTS:
- Confidence must be between ${minConfidence}% and ${maxConfidence}% (based on ${followers.toLocaleString()} followers)
- Be realistic about viral potential for this creator size
- Consider content quality, timing, hashtags, and audience engagement

REQUIRED OUTPUT - JSON ONLY:
{
  "confidence": ${Math.floor((minConfidence + maxConfidence) / 2)},
  "platformFit": 85,
  "contentScore": 70,
  "creatorAuthority": 80,
  "expectedEngagement": 12000,
  "analysis": "Detailed analysis of why this content will or won't go viral",
  "optimizations": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "hashtags": ["#relevant", "#hashtag", "#suggestions"],
  "keyInsight": "Main reason this content will succeed or fail"
}

Provide REALISTIC analysis based on the creator's actual ${followers.toLocaleString()} follower count.
`;

		console.log('🧠 Sending to Gemini AI (with 30s timeout)...');

		// Add timeout to prevent hanging
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(
				() => reject(new Error('Gemini AI request timeout after 30 seconds')),
				30000
			)
		);

		const aiPromise = model.generateContent(prompt);

		const result = await Promise.race([aiPromise, timeoutPromise]);
		const responseText = result.response.text();

		console.log('📤 Gemini response length:', responseText.length);

		// Parse REAL AI response - no fallbacks
		let analysisData;
		try {
			const jsonMatch = responseText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No JSON found in AI response');
			}

			analysisData = JSON.parse(jsonMatch[0]);

			// Validate required fields
			const requiredFields = ['confidence', 'analysis'];
			for (const field of requiredFields) {
				if (analysisData[field] === undefined) {
					throw new Error(`Missing required field: ${field}`);
				}
			}
		} catch (parseError) {
			return res.status(500).json({
				success: false,
				error: `Failed to parse AI response: ${parseError.message}`,
				rawResponse: responseText.substring(0, 200) + '...',
				hint: 'The AI returned malformed data. Please try again.',
			});
		}

		// Enforce realistic confidence bounds
		if (
			analysisData.confidence < minConfidence ||
			analysisData.confidence > maxConfidence
		) {
			analysisData.confidence = Math.max(
				minConfidence,
				Math.min(maxConfidence, analysisData.confidence)
			);
		}

		// Return ONLY real AI analysis
		const response = {
			success: true,
			confidence: analysisData.confidence,
			platformFit: analysisData.platformFit || null,
			contentScore: analysisData.contentScore || null,
			creatorAuthority: analysisData.creatorAuthority || null,
			expectedEngagement: analysisData.expectedEngagement || null,
			analysis: analysisData.analysis,
			optimizations: analysisData.optimizations || [],
			hashtags: analysisData.hashtags || [],
			keyInsight: analysisData.keyInsight || analysisData.analysis,
			dataSource: 'real_ai_analysis',
			followerTier: `${followers.toLocaleString()} followers`,
			confidenceRange: `${minConfidence}-${maxConfidence}%`,
			timestamp: new Date().toISOString(),
		};

		console.log(
			'✅ Real AI analysis complete:',
			response.confidence + '% confidence'
		);
		return res.status(200).json(response);
	} catch (error) {
		console.error('❌ Viral prediction error:', error.message);

		return res.status(500).json({
			success: false,
			error: `Viral prediction failed: ${error.message}`,
			errorType: error.name || 'UnknownError',
			timestamp: new Date().toISOString(),
			hint: 'Check API configuration and try again.',
		});
	}
}
