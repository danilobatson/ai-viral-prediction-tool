import { GoogleGenerativeAI } from '@google/generative-ai';
import {
	getViralCategory,
	validateViralProbability,
} from '../../lib/viral-categories.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({
			success: false,
			error: 'Method not allowed. Use POST.',
		});
	}

	try {
		const { content, creator } = req.body;

		if (!content || !content.trim()) {
			return res.status(400).json({
				success: false,
				error: 'Content is required for viral analysis',
			});
		}

		console.log(
			`🧠 Starting viral analysis for content: "${content.substring(0, 50)}..."`
		);
		console.log(`👤 Creator specified: ${creator || 'None'}`);

		// Step 1: Get REAL creator data via MCP if creator provided
		let creatorData = null;
		let creatorError = null;

		if (creator && creator.trim()) {
			try {
				const creatorResponse = await fetch(
					`${req.headers.origin || 'http://localhost:3001'}/api/lookup-creator`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ creator: creator.trim() }),
					}
				);

				const creatorResult = await creatorResponse.json();

				if (creatorResult.success && creatorResult.data) {
					creatorData = creatorResult.data;
					console.log(
						`✅ Got REAL MCP creator data: @${
							creatorData.handle
						} with ${creatorData.followerCount.toLocaleString()} followers`
					);
				} else {
					creatorError = creatorResult.error || 'Creator lookup failed';
					console.error(`❌ Creator lookup failed: ${creatorError}`);
				}
			} catch (fetchError) {
				creatorError = `MCP lookup failed: ${fetchError.message}`;
				console.error(`❌ MCP fetch error:`, fetchError);
			}
		}

		// Step 2: If creator was specified but lookup failed, return error (NO FALLBACKS)
		if (creator && creator.trim() && !creatorData) {
			return res.status(400).json({
				success: false,
				error: `Creator lookup failed for @${creator}: ${creatorError}. Cannot proceed without real creator data.`,
				creatorError: creatorError,
			});
		}

		// Step 3: Build viral analysis prompt with REAL data
		const hasRealCreatorData = creatorData && creatorData.followerCount > 0;

		const viralPrompt = `You are a viral content expert analyzing social media content for viral potential.

CONTENT TO ANALYZE:
"${content}"

${
	hasRealCreatorData
		? `
REAL CREATOR DATA (from LunarCrush MCP):
- Handle: @${creatorData.handle}
- Followers: ${creatorData.followerCount.toLocaleString()}
- Engagements: ${creatorData.engagements.toLocaleString()}
- Platform: ${creatorData.platform}
- Source: ${creatorData.source}

Use this REAL creator data to calculate viral potential. A creator with ${creatorData.followerCount.toLocaleString()} followers has significant reach.
`
		: `
NO CREATOR DATA PROVIDED - Analyzing content only without creator context.
`
}

VIRAL ANALYSIS FRAMEWORK:
1. Psychology Factors:
   - Emotional Trigger (joy, surprise, anger, fear): 0-100
   - Social Currency (makes people look good sharing): 0-100
   - Practical Value (useful information): 0-100
   - Story Element (narrative, human connection): 0-100

2. Content Analysis:
   - Topic relevance and trending potential
   - Hashtag effectiveness
   - Call-to-action strength
   - Visual/emotional appeal

RESPONSE FORMAT (JSON only):
{
  "viralProbability": number_0_to_85_max,
  "confidenceScore": number_0_to_100,
  "viralCategory": "Ultra High|High|Moderate|Low",
  "expectedEngagement": ${
		hasRealCreatorData ? 'realistic_number_based_on_follower_count' : 'null'
	},
  "psychologyScore": {
    "emotional": number_0_to_100,
    "socialCurrency": number_0_to_100,
    "practicalValue": number_0_to_100,
    "story": number_0_to_100
  },
  "recommendations": ["specific", "actionable", "suggestions"],
  "optimizedHashtags": ["#trending", "#hashtags"],
  "optimalTiming": {
    "bestTime": "time_range",
    "bestDays": "day_range",
    "timezone": "EST"
  },
  "viralFactors": ["key", "viral", "elements"]
}

CRITICAL RULES:
- Maximum viral probability is 85% (be realistic)
- ${
			hasRealCreatorData
				? `Use real follower count (${creatorData.followerCount.toLocaleString()}) for engagement calculations`
				: 'Set expectedEngagement to null without creator data'
		}
- Base analysis on proven viral psychology principles
- Provide actionable recommendations
- Return only valid JSON, no explanations`;

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash-lite',
			generationConfig: {
				temperature: 0.7,
				maxOutputTokens: 2048,
			},
		});

		const result = await model.generateContent(viralPrompt);
		const responseText = result.response.text();

		console.log('🎯 Gemini analysis result:', responseText);

		// Parse and validate JSON response
		let analysis;
		try {
			const jsonMatch = responseText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No valid JSON found in AI response');
			}
			analysis = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			console.error('❌ Failed to parse AI analysis:', parseError);
			return res.status(500).json({
				success: false,
				error: 'AI analysis parsing failed',
			});
		}

		// Validate required fields
		const requiredFields = [
			'viralProbability',
			'confidenceScore',
			'viralCategory',
			'recommendations',
			'psychologyScore',
		];
		for (const field of requiredFields) {
			if (!analysis[field]) {
				console.error(`❌ Missing required field: ${field}`);
				return res.status(500).json({
					success: false,
					error: `AI analysis incomplete - missing ${field}`,
				});
			}
		}

		// Ensure realistic viral probability (max 85%)
		analysis.viralProbability = validateViralProbability(
			analysis.viralProbability
		);

		// Calculate realistic expected engagement if we have real creator data
		if (hasRealCreatorData) {
			const engagementRate = Math.min(
				0.05,
				(analysis.viralProbability / 100) * 0.1
			); // Max 5% engagement rate
			analysis.expectedEngagement = Math.floor(
				creatorData.followerCount * engagementRate
			);
			console.log(
				`✅ Calculated expected engagement: ${analysis.expectedEngagement.toLocaleString()} based on ${creatorData.followerCount.toLocaleString()} followers`
			);
		} else {
			analysis.expectedEngagement = null;
		}

		// Final response with REAL data source tracking
		const responseData = {
			success: true,
			viralProbability: analysis.viralProbability,
			confidenceScore: analysis.confidenceScore,
			expectedEngagement: analysis.expectedEngagement,
			viralCategory: analysis.viralCategory,
			recommendations: analysis.recommendations || [],
			optimizedHashtags: analysis.optimizedHashtags || [],
			optimalTiming: analysis.optimalTiming || {
				bestTime: '9 AM - 12 PM',
				bestDays: 'Tuesday - Thursday',
				timezone: 'EST',
			},
			viralFactors: analysis.viralFactors || [],
			psychologyScore: analysis.psychologyScore || {},
			analysisSource: 'Google Gemini 2.0 Flash (Real Data Analysis)',
			timestamp: new Date().toISOString(),
			hasCreatorData: hasRealCreatorData,
			dataSource: hasRealCreatorData
				? 'LLM-Orchestrated MCP (Real Data)'
				: 'Content Analysis Only',
			creatorData: hasRealCreatorData
				? {
						handle: creatorData.handle,
						followers: creatorData.followerCount,
						engagements: creatorData.engagements,
						source: creatorData.source,
				  }
				: null,
			modelConfig: {
				model: 'gemini-2.0-flash-lite',
				temperature: 0.7,
				features: ['viral psychology', 'real MCP data', 'trend analysis'],
			},
		};

		console.log(
			`✅ Viral analysis complete: ${
				responseData.viralProbability
			}% probability with ${hasRealCreatorData ? 'REAL' : 'NO'} creator data`
		);

		res.status(200).json(responseData);
	} catch (error) {
		console.error('❌ Viral prediction error:', error);
		res.status(500).json({
			success: false,
			error: `Viral prediction failed: ${error.message}`,
		});
	}
}
