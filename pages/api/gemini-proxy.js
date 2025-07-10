/**
 * Google Gemini Proxy - Real AI Marketing Expert Analysis
 * FIXED: Using gemini-2.0-flash-lite model
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const corsOptions = {
	origin:
		process.env.NODE_ENV === 'production'
			? ['https://your-domain.com']
			: ['http://localhost:3000', 'http://localhost:3001'],
	methods: ['POST'],
	credentials: true,
};

// Initialize Gemini AI with correct model
let genAI = null;
let model = null;

function initializeGemini() {
	const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error('GOOGLE_GEMINI_API_KEY not configured');
	}

	if (!genAI) {
		genAI = new GoogleGenerativeAI(apiKey);
		// FIXED: Use correct model name
		model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
	}

	return model;
}

async function getGeminiMarketingAnalysis(
	postData,
	creatorData,
	trendingTopics
) {
	try {
		const geminiModel = initializeGemini();

		const prompt = `You are a world-class social media marketing expert and viral content analyst.

CREATOR PROFILE:
- Platform: ${postData.platform}
- Handle: @${creatorData.handle || creatorData.screenName}
- Followers: ${creatorData.followers?.toLocaleString() || 'Unknown'}
- Engagement Rate: ${creatorData.engagementRate || 'Unknown'}%
- Verified: ${creatorData.verified ? 'Yes' : 'No'}
- Creator Rank: #${
			creatorData.creatorRank || creatorData.influencer_rank || 'Unknown'
		}

POST CONTENT TO ANALYZE:
"${postData.text}"

CURRENT TRENDING TOPICS:
${
	trendingTopics
		?.map((t) => `- ${t.name} (${t.change > 0 ? '+' : ''}${t.change}%)`)
		.join('\n') || '- No trending data available'
}

ANALYSIS REQUEST:
As a viral content expert, analyze this post's viral potential with precision:

1. **Viral Probability (0-100%)**: Based on:
   - Creator's follower count and engagement history
   - Content quality, emotional triggers, and shareability
   - Alignment with current trending topics
   - Platform-specific algorithm factors
   - Optimal timing and viral mechanics

2. **Expert Marketing Insights**: Provide actionable recommendations
3. **Expected Reach**: Estimate potential reach based on viral probability
4. **Confidence Level**: How certain are you about this prediction?

Return your analysis as JSON:
{
  "viralProbability": number (0-100),
  "confidence": number (0-100),
  "category": string,
  "expectedReach": number,
  "explanation": string,
  "recommendations": [
    {"title": string, "description": string}
  ],
  "keyFactors": [string],
  "trendingAlignment": boolean,
  "contentScore": number (0-100),
  "platformOptimization": number (0-100)
}

Analyze like a true viral marketing expert with 10+ years of experience.`;

		console.log(
			'🤖 Calling Google Gemini 2.0 Flash Lite for AI marketing analysis...'
		);

		const result = await geminiModel.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Try to parse JSON response from Gemini
		try {
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				const analysisData = JSON.parse(jsonMatch[0]);

				// Ensure all required fields are present
				return {
					viralProbability: analysisData.viralProbability || 0,
					confidence: analysisData.confidence || 70,
					category: analysisData.category || 'Unknown Potential',
					expectedReach:
						analysisData.expectedReach ||
						Math.round(creatorData.followers * 0.1),
					explanation: analysisData.explanation || text,
					recommendations: analysisData.recommendations || [
						{
							title: 'AI Analysis',
							description: 'Detailed analysis completed',
						},
					],
					keyFactors: analysisData.keyFactors || [
						'Content quality',
						'Creator influence',
					],
					trendingAlignment: analysisData.trendingAlignment || false,
					contentScore: analysisData.contentScore || 50,
					platformOptimization: analysisData.platformOptimization || 50,
					source: 'Google Gemini 2.0 Flash Lite',
					processingTime: Date.now(),
				};
			}
		} catch (parseError) {
			console.warn(
				'⚠️ Could not parse Gemini JSON response, using text analysis'
			);
		}

		// Fallback if JSON parsing fails - extract insights from text
		return {
			viralProbability: extractNumberFromText(text, 'viral', 50),
			confidence: extractNumberFromText(text, 'confidence', 70),
			category: 'AI Analysis Complete',
			expectedReach: Math.round(creatorData.followers * 0.1),
			explanation: text,
			recommendations: [
				{
					title: 'AI Analysis',
					description: 'Complete analysis provided by Gemini AI',
				},
			],
			keyFactors: ['AI-powered analysis', 'Content evaluation'],
			trendingAlignment: text.toLowerCase().includes('trend'),
			contentScore: extractNumberFromText(text, 'content', 60),
			platformOptimization: extractNumberFromText(text, 'platform', 50),
			source: 'Google Gemini 2.0 Flash Lite',
			processingTime: Date.now(),
		};
	} catch (error) {
		console.error('❌ Gemini API call failed:', error);
		throw new Error(`Gemini analysis failed: ${error.message}`);
	}
}

// Helper function to extract numbers from AI text response
function extractNumberFromText(text, keyword, defaultValue) {
	const regex = new RegExp(`${keyword}[^\\d]*([0-9]+)`, 'i');
	const match = text.match(regex);
	return match ? parseInt(match[1]) : defaultValue;
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
			message: 'This endpoint only accepts POST requests',
		});
	}

	try {
		const { prompt, postData, creatorData, trendingTopics } = req.body;

		if (!prompt && (!postData || !creatorData)) {
			return res.status(400).json({
				error: 'Missing required data',
				message: 'Either prompt or (postData + creatorData) is required',
			});
		}

		let result;

		if (prompt) {
			// Direct prompt mode
			const geminiModel = initializeGemini();
			const response = await geminiModel.generateContent(prompt);
			result = {
				success: true,
				response: response.response.text(),
				source: 'Google Gemini 2.0 Flash Lite - Direct Prompt',
				timestamp: new Date().toISOString(),
			};
		} else {
			// Marketing analysis mode
			result = {
				success: true,
				analysis: await getGeminiMarketingAnalysis(
					postData,
					creatorData,
					trendingTopics
				),
				source: 'Google Gemini 2.0 Flash Lite - Marketing Expert',
				timestamp: new Date().toISOString(),
			};
		}

		res.status(200).json(result);
	} catch (error) {
		console.error('❌ Gemini proxy error:', error);

		// Check if it's an API key issue
		if (error.message.includes('API key')) {
			return res.status(401).json({
				error: 'API key configuration issue',
				message: 'Please check GOOGLE_GEMINI_API_KEY environment variable',
				needsSetup: true,
				timestamp: new Date().toISOString(),
			});
		}

		res.status(500).json({
			error: 'Gemini proxy failed',
			message: error.message,
			timestamp: new Date().toISOString(),
		});
	}
}
