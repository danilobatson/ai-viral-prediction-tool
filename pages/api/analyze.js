import { GoogleGenerativeAI } from '@google/generative-ai';
import { createMcpClient, executeToolCall } from '../../lib/mcp-client.js';
import { formatNumber } from '../../lib/number-utils.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({
			success: false,
			error: 'Method not allowed - use POST',
		});
	}

	let mcpClient = null;

	try {
		// Handle multiple possible field names from frontend
		const content =
			req.body.content || req.body.text || req.body.postContent || '';
		const creator =
			req.body.creator || req.body.handle || req.body.username || '';

		console.log('📝 Content:', content.substring(0, 50) + '...');
		console.log('👤 Creator:', creator);

		// Validate content
		if (!content || !content.trim()) {
			return res.status(400).json({
				success: false,
				error: 'Content is required for viral analysis',
			});
		}

		// Get creator data if provided using CORRECT MCP format
		let creatorData = null;
		const cleanCreator = creator?.trim()?.replace(/^@+/, '');

		if (cleanCreator) {
			console.log(`🔍 Looking up creator: @${cleanCreator}`);

			try {
				// Create MCP client using the correct method from lib
				mcpClient = await createMcpClient();

				// Use the CORRECT tool name and parameters
				const result = await executeToolCall(mcpClient, 'Creator', {
					screenName: cleanCreator,
					network: 'x', // Use 'x' not 'twitter'
				});

				console.log('🔍 MCP Raw Result:', JSON.stringify(result, null, 2));

				// Parse the MCP response correctly
				let rawText = '';
				if (result && result.content) {
					for (const content of result.content) {
						if (content.type === 'text') {
							rawText += content.text + '\n';
						}
					}
				}

				console.log('📝 Raw MCP Text:', rawText);

				if (rawText) {
					// Use LLM to parse the raw MCP data
					const parsePrompt = `Parse this creator data and extract the key metrics:

${rawText}

Look for:
- Follower count (should be a large number for popular accounts)
- Engagement metrics
- Handle/username
- Platform information

Return ONLY valid JSON in this format:
{
  "handle": "username",
  "followerCount": number,
  "engagements": number,
  "platform": "Twitter/X"
}

Be careful to extract LARGE follower numbers (millions) for popular accounts like elonmusk, not small numbers.`;

					const model = genAI.getGenerativeModel({
						model: 'gemini-2.0-flash-lite',
					});
					const parseResult = await model.generateContent(parsePrompt);
					const parsedText = parseResult.response.text();

					console.log('🤖 LLM Parsed:', parsedText);

					try {
						const jsonMatch = parsedText.match(/\{[\s\S]*\}/);
						if (jsonMatch) {
							const parsed = JSON.parse(jsonMatch[0]);
							if (parsed.followerCount && parsed.followerCount > 0) {
								creatorData = {
									handle: parsed.handle || cleanCreator,
									followerCount: parsed.followerCount,
									engagements: parsed.engagements || 0,
									platform: parsed.platform || 'Twitter/X',
									source: 'LunarCrush MCP',
								};
								console.log(
									`✅ Parsed creator: @${
										creatorData.handle
									} with ${formatNumber(creatorData.followerCount)} followers`
								);
							}
						}
					} catch (parseError) {
						console.error('❌ Failed to parse LLM response:', parseError);
					}
				}
			} catch (mcpError) {
				console.error(`❌ Creator lookup failed: ${mcpError.message}`);
				console.error('Stack:', mcpError.stack);
			}
		}

		// AI Analysis
		const hasCreatorData = creatorData && creatorData.followerCount > 0;

		const analysisPrompt = `You are a viral content expert. Analyze this content for viral potential:

CONTENT: "${content}"

${
	hasCreatorData
		? `
REAL CREATOR DATA (from LunarCrush MCP):
- Handle: @${creatorData.handle}
- Followers: ${formatNumber(creatorData.followerCount)}
- Platform: ${creatorData.platform}
- Source: ${creatorData.source}

This is REAL data from LunarCrush. Use it to enhance your viral analysis.
`
		: 'NO CREATOR DATA - analyze content only.'
}

Respond ONLY in this exact JSON format:
{
  "viralProbability": number_between_0_and_85,
  "confidenceScore": number_between_0_and_100,
  "viralCategory": "Ultra High|High|Moderate|Low",
  "expectedEngagement": ${
		hasCreatorData ? 'realistic_number_based_on_followers' : 'null'
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
  }
}

IMPORTANT: expectedEngagement must be a NUMBER, not an object.`;

		console.log('🤖 Running AI analysis...');

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash-lite',
			generationConfig: {
				temperature: 0.7,
				maxOutputTokens: 2048,
			},
		});

		const result = await model.generateContent(analysisPrompt);
		const responseText = result.response.text();

		// Parse AI response
		let analysis;
		try {
			const jsonMatch = responseText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) throw new Error('No valid JSON in AI response');
			analysis = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			console.error('❌ AI parsing failed:', parseError);
			return res.status(500).json({
				success: false,
				error: 'AI analysis failed to return valid results',
			});
		}

		// Calculate realistic engagement if we have creator data
		if (
			hasCreatorData &&
			(typeof analysis.expectedEngagement !== 'number' ||
				!analysis.expectedEngagement)
		) {
			const baseEngagementRate = 0.02; // 2% base rate
			const viralMultiplier = Math.max(1, analysis.viralProbability / 50);
			const engagementRate = Math.min(
				0.1,
				baseEngagementRate * viralMultiplier
			);

			analysis.expectedEngagement = Math.floor(
				creatorData.followerCount * engagementRate
			);
			console.log(
				`📊 Calculated engagement: ${formatNumber(analysis.expectedEngagement)}`
			);
		}

		// Build final response
		const response = {
			success: true,
			viralProbability: Math.min(
				85,
				Math.max(0, analysis.viralProbability || 50)
			),
			confidenceScore: Math.min(
				100,
				Math.max(0, analysis.confidenceScore || 70)
			),
			viralCategory: analysis.viralCategory || 'Moderate',
			expectedEngagement: analysis.expectedEngagement,
			psychologyScore: analysis.psychologyScore || {
				emotional: 50,
				socialCurrency: 50,
				practicalValue: 50,
				story: 50,
			},
			recommendations: analysis.recommendations || [],
			optimizedHashtags: analysis.optimizedHashtags || [],
			optimalTiming: analysis.optimalTiming || {
				bestTime: '9 AM - 12 PM',
				bestDays: 'Tuesday - Thursday',
				timezone: 'EST',
			},
			hasCreatorData: !!hasCreatorData,
			creatorData: hasCreatorData
				? {
						handle: creatorData.handle,
						followers: creatorData.followerCount,
						engagements: creatorData.engagements,
						platform: creatorData.platform,
				  }
				: null,
			analysisSource: 'Google Gemini 2.0 Flash Lite',
			timestamp: new Date().toISOString(),
		};

		console.log(
			`✅ Analysis complete: ${response.viralProbability}% viral probability${
				hasCreatorData
					? ` with REAL @${creatorData.handle} data (${formatNumber(
							creatorData.followerCount
					  )} followers)`
					: ''
			}`
		);
		res.status(200).json(response);
	} catch (error) {
		console.error('❌ Analysis failed:', error);
		res.status(500).json({
			success: false,
			error: `Analysis failed: ${error.message}`,
		});
	} finally {
		// Clean up MCP client
		if (mcpClient && mcpClient.close) {
			try {
				await mcpClient.close();
				console.log('🔌 MCP client connection closed');
			} catch (closeError) {
				console.warn('⚠️ Error closing MCP client:', closeError.message);
			}
		}
	}
}
