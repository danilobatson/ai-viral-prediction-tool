import { GoogleGenerativeAI } from '@google/generative-ai';
import { createMcpClient, executeToolCall } from '../../lib/mcp-client.js';
import { formatNumber } from '../../lib/number-utils.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res
			.status(405)
			.json({ success: false, error: 'Method not allowed' });
	}

	// Set up Server-Sent Events headers
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Cache-Control',
	});

	// Helper function to send streaming updates
	const sendUpdate = (step, message, data = null) => {
		const update = {
			step,
			message,
			timestamp: new Date().toISOString(),
			...(data && { data }),
		};
		res.write(`data: ${JSON.stringify(update)}\n\n`);
		console.log(`📡 Streaming: ${step} - ${message}`);
	};

	let mcpClient = null;

	try {
		const { content, creator } = req.body;

		if (!content?.trim()) {
			sendUpdate('error', 'Content is required for analysis');
			res.end();
			return;
		}

		const cleanCreator = creator?.trim()?.replace(/^@+/, '');

		sendUpdate('connecting', 'Initializing viral analysis engine...');

		// Step 1: Creator lookup with streaming updates
		let creatorData = null;

		if (cleanCreator) {
			sendUpdate('fetching', `Looking up @${cleanCreator} on social media...`);

			try {
				sendUpdate('fetching', 'Connecting to LunarCrush MCP server...');
				mcpClient = await createMcpClient();

				sendUpdate(
					'fetching',
					`Fetching real-time data for @${cleanCreator}...`
				);
				const result = await executeToolCall(mcpClient, 'Creator', {
					screenName: cleanCreator,
					network: 'x',
				});

				sendUpdate('parsing', 'Processing social media metrics...');

				// Parse MCP response
				let rawText = '';
				if (result && result.content) {
					for (const content of result.content) {
						if (content.type === 'text') {
							rawText += content.text + '\n';
						}
					}
				}

				if (rawText) {
					sendUpdate('parsing', 'Extracting follower and engagement data...');

					const parsePrompt = `Parse this creator data and extract metrics:
${rawText}

Return JSON: {"handle": "username", "followerCount": number, "engagements": number, "platform": "Twitter/X"}`;

					const model = genAI.getGenerativeModel({
						model: 'gemini-2.0-flash',
					});

					const parseResult = await model.generateContent(parsePrompt);
					const parsedText = parseResult.response.text();

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

								sendUpdate(
									'success',
									`Found @${creatorData.handle} with ${formatNumber(
										creatorData.followerCount
									)} followers!`,
									{
										creatorData: {
											handle: creatorData.handle,
											followers: creatorData.followerCount,
											engagements: creatorData.engagements,
										},
									}
								);
							}
						}
					} catch (parseError) {
						sendUpdate(
							'warning',
							'Could not parse creator data, using general analysis'
						);
					}
				} else {
					sendUpdate(
						'warning',
						'No creator data found, using general analysis'
					);
				}
			} catch (mcpError) {
				sendUpdate('warning', `Creator lookup failed: ${mcpError.message}`);
			}
		} else {
			sendUpdate(
				'analyzing',
				'No creator specified - analyzing content only...'
			);
		}

		// Step 2: AI Analysis with streaming updates
		const hasCreatorData = creatorData && creatorData.followerCount > 0;

		if (hasCreatorData) {
			sendUpdate(
				'analyzing',
				`Running AI analysis enhanced with @${creatorData.handle}'s metrics...`
			);
		} else {
			sendUpdate('analyzing', 'Running general AI content analysis...');
		}

		const analysisPrompt = `You are a viral content expert. Analyze this content:

CONTENT: "${content}"

${
	hasCreatorData
		? `
REAL CREATOR DATA:
- Handle: @${creatorData.handle}
- Followers: ${formatNumber(creatorData.followerCount)}
- Platform: ${creatorData.platform}
`
		: 'NO CREATOR DATA - analyze content only.'
}

Respond in JSON: {"viralProbability": 0-85, "confidenceScore": 0-100, "viralCategory": "Ultra High|High|Moderate|Low", "expectedEngagement": ${
			hasCreatorData ? 'number' : 'null'
		}, "psychologyScore": {...}, "recommendations": [...], "optimizedHashtags": [...], "optimalTiming": {...}}`;

		sendUpdate('analyzing', 'Processing content with Google Gemini AI...');

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.0-flash',
			generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
		});

		const result = await model.generateContent(analysisPrompt);
		const responseText = result.response.text();

		sendUpdate(
			'finalizing',
			'Calculating viral probability and recommendations...'
		);

		// Parse AI response
		let analysis;
		try {
			const jsonMatch = responseText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) throw new Error('No valid JSON in AI response');
			analysis = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			sendUpdate('error', 'AI analysis failed to return valid results');
			res.end();
			return;
		}

		// Calculate engagement if needed
		if (hasCreatorData && typeof analysis.expectedEngagement !== 'number') {
			const engagementRate = Math.min(
				0.1,
				0.02 * (analysis.viralProbability / 50)
			);
			analysis.expectedEngagement = Math.floor(
				creatorData.followerCount * engagementRate
			);
		}

		// Send final results
		const finalResults = {
			success: true,
			viralProbability: Math.min(
				85,
				Math.max(0, analysis.viralProbability || 50)
			),
			confidenceScore: analysis.confidenceScore || 70,
			viralCategory: analysis.viralCategory || 'Moderate',
			expectedEngagement: analysis.expectedEngagement,
			psychologyScore: analysis.psychologyScore || {},
			recommendations: analysis.recommendations || [],
			optimizedHashtags: analysis.optimizedHashtags || [],
			optimalTiming: analysis.optimalTiming || {},
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

		sendUpdate(
			'complete',
			`Analysis complete! ${finalResults.viralProbability}% viral probability`,
			finalResults
		);
	} catch (error) {
		console.error('❌ Streaming analysis failed:', error);
		sendUpdate('error', `Analysis failed: ${error.message}`);
	} finally {
		if (mcpClient && mcpClient.close) {
			try {
				await mcpClient.close();
			} catch (closeError) {
				console.warn('⚠️ Error closing MCP client:', closeError.message);
			}
		}
		res.end();
	}
}
