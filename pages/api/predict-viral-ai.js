import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({
			success: false,
			error: 'Method not allowed',
		});
	}

	try {
		const { content, creator, creatorData } = req.body;

		if (!content || !content.trim()) {
			return res.status(400).json({
				success: false,
				error: 'Content is required for viral prediction',
			});
		}

		if (!process.env.GOOGLE_GEMINI_API_KEY) {
			return res.status(500).json({
				success: false,
				error: 'Google Gemini API key not configured',
			});
		}

		console.log('🤖 Starting realistic viral prediction analysis...');

		// Build comprehensive prompt with viral definitions
		let prompt = `You are an expert social media analyst. Analyze this content for REALISTIC viral potential.

VIRAL DEFINITIONS:
- Ultra High (75-90%): 1M+ engagements, trending globally, news coverage
- High (60-74%): 100K-1M engagements, trending in category
- Moderate (40-59%): 10K-100K engagements, good organic reach
- Low (0-39%): <10K engagements, limited reach

CONTENT: "${content.trim()}"
`;

		if (creator) {
			prompt += `CREATOR HANDLE: @${creator}\n`;
		}

		if (creatorData && creatorData.followerCount) {
			prompt += `CREATOR DATA (from LLM-Orchestrated MCP):
- Followers: ${creatorData.followerCount.toLocaleString()}
- Handle: @${creatorData.handle}
- Engagements: ${creatorData.engagements || 'N/A'}
`;
		}

		prompt += `
ANALYSIS REQUIREMENTS:
1. Viral Probability (0-85 MAX): Be realistic - even perfect content rarely exceeds 90%
2. Confidence Score (0-95): How certain are you?
3. Expected Engagement: Calculate based on follower count and content quality
4. Viral Category: Based on definitions above
5. Recommendations: ALWAYS provide 3-4 optimization suggestions
6. Optimized Hashtags: 5-8 trending hashtags for this content
7. Optimal Timing: Best posting times and days
8. Viral Factors: What makes this content viral-worthy

Respond ONLY in valid JSON:
{
  "viralProbability": number (0-85 MAX),
  "confidenceScore": number (0-95),
  "expectedEngagement": number,
  "viralCategory": "Ultra High|High|Moderate|Low",
  "recommendations": ["suggestion1", "suggestion2", "suggestion3", "suggestion4"],
  "optimizedHashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "optimalTiming": {
    "bestTime": "time range",
    "bestDays": "day range",
    "timezone": "EST"
  },
  "viralFactors": ["factor1", "factor2", "factor3"]
}

IMPORTANT:
- Be realistic - 100% viral probability doesn't exist
- Maximum 90% even for perfect content with mega creators
- Always provide optimization suggestions regardless of current score
- Base hashtags on current trends and content topic
- Consider time zones and platform algorithms for timing`;

		console.log('🚀 Sending to Gemini AI for realistic analysis...');

		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		console.log('✅ Gemini AI response received');

		// Parse JSON response - NO FALLBACKS
		let analysis;
		try {
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No valid JSON found in AI response');
			}
			analysis = JSON.parse(jsonMatch[0]);
			console.log('✅ Parsed realistic AI analysis');
		} catch (parseError) {
			console.error('❌ Failed to parse AI response:', parseError);
			return res.status(500).json({
				success: false,
				error: 'AI analysis failed to return valid results. Please try again.',
			});
		}

		// Validate required fields
		const requiredFields = [
			'viralProbability',
			'confidenceScore',
			'viralCategory',
			'recommendations',
			'optimizedHashtags',
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

		// Cap viral probability at realistic maximum
		if (analysis.viralProbability > 85) {
			console.log(
				`🔧 Capping viral probability from ${analysis.viralProbability}% to 90%`
			);
			analysis.viralProbability = 85;
		}

		// Enhance with creator data if available
		if (
			creatorData &&
			creatorData.followerCount &&
			creatorData.followerCount > 0
		) {
			console.log('✅ Enhancing analysis with real MCP creator data...');

			// Calculate realistic expected engagement
			const baseEngagementRate = 0.02; // 2% base engagement rate
			const viralBoost = analysis.viralProbability / 100;
			analysis.expectedEngagement = Math.floor(
				creatorData.followerCount * baseEngagementRate * viralBoost
			);

			// Slight boost for major creators (but still realistic)
			if (creatorData.followerCount > 100000000) {
				analysis.viralProbability = Math.min(85, analysis.viralProbability + 5);
				console.log('✅ Slight boost for mega creator (100M+ followers)');
			} else if (creatorData.followerCount > 10000000) {
				analysis.viralProbability = Math.min(85, analysis.viralProbability + 3);
				console.log('✅ Slight boost for major creator (10M+ followers)');
			}
		}

		const responseData = {
			success: true,
			viralProbability: analysis.viralProbability,
			confidenceScore: analysis.confidenceScore,
			expectedEngagement: analysis.expectedEngagement || null,
			viralCategory: analysis.viralCategory,
			recommendations: analysis.recommendations || [],
			optimizedHashtags: analysis.optimizedHashtags || [],
			optimalTiming: analysis.optimalTiming || {
				bestTime: '9:00 AM - 11:00 AM EST',
				bestDays: 'Tuesday - Thursday',
				timezone: 'EST',
			},
			viralFactors: analysis.viralFactors || [],
			analysisSource: 'Google Gemini 2.0 Flash (Realistic Analysis)',
			timestamp: new Date().toISOString(),
			hasCreatorData: !!(creatorData && creatorData.followerCount),
			dataSource: creatorData
				? 'LLM-Orchestrated MCP'
				: 'Content Analysis Only',
		};

		console.log(
			`✅ Returning realistic analysis: ${responseData.viralProbability}% viral probability`
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
