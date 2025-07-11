import { GoogleGenerativeAI } from '@google/generative-ai';
import { createMcpClient, executeToolCall } from '../../lib/mcp-client.js';
import { formatNumber } from '../../lib/number-utils.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Essential SSE headers to prevent buffering
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
    });

    const sendSSE = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    let mcpClient = null;

    try {
        const { content, creator } = req.body;

        sendSSE({
            step: 'connecting',
            message: 'Initializing viral analysis engine...',
            timestamp: new Date().toISOString()
        });

        // Simulate small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        let creatorData = null;
        let hasCreatorData = false;
        const cleanCreator = creator?.trim()?.replace(/^@+/, '');

        if (cleanCreator) {
            sendSSE({
                step: 'fetching',
                message: `Looking up @${cleanCreator} on social media...`,
                timestamp: new Date().toISOString()
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            sendSSE({
                step: 'fetching',
                message: 'Connecting to LunarCrush MCP server...',
                timestamp: new Date().toISOString()
            });

            try {
                sendSSE({
                    step: 'fetching',
                    message: `Fetching real-time data for @${cleanCreator}...`,
                    timestamp: new Date().toISOString()
                });

                // Use EXACT same MCP implementation as working analyze.js
                mcpClient = await createMcpClient();

                sendSSE({
                    step: 'parsing',
                    message: 'Processing social media metrics...',
                    timestamp: new Date().toISOString()
                });

                // Use the EXACT same tool call format with network: 'x'
                const result = await executeToolCall(mcpClient, 'Creator', {
                    screenName: cleanCreator,
                    network: 'x', // CRITICAL: Use 'x' not 'twitter'
                });

                sendSSE({
                    step: 'parsing',
                    message: 'Extracting follower and engagement data...',
                    timestamp: new Date().toISOString()
                });

                // Parse MCP response using EXACT same method
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
                    // Use LLM to parse the raw MCP data (EXACT same as working code)
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
                                hasCreatorData = true;

                                sendSSE({
                                    step: 'success',
                                    message: `Found @${creatorData.handle} with ${formatNumber(creatorData.followerCount)} followers!`,
                                    timestamp: new Date().toISOString(),
                                    data: { creatorData }
                                });

                                console.log(`✅ Parsed creator: @${creatorData.handle} with ${formatNumber(creatorData.followerCount)} followers`);
                            }
                        }
                    } catch (parseError) {
                        console.error('❌ Failed to parse LLM response:', parseError);
                    }
                }

            } catch (error) {
                sendSSE({
                    step: 'warning',
                    message: `Could not fetch @${cleanCreator} data: ${error.message}`,
                    timestamp: new Date().toISOString()
                });
                console.error(`❌ Creator lookup failed: ${error.message}`);
            }
        }

        sendSSE({
            step: 'analyzing',
            message: hasCreatorData
                ? `Running AI analysis enhanced with @${creatorData.handle}'s metrics...`
                : 'Running AI analysis on general content...',
            timestamp: new Date().toISOString()
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        sendSSE({
            step: 'analyzing',
            message: 'Processing content with Google Gemini AI...',
            timestamp: new Date().toISOString()
        });

        // AI Analysis using EXACT same prompt as working code
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
		hasCreatorData ? 'number_based_on_follower_count' : 'null'
	},
  "psychologyScore": {"emotional_appeal": 0-100, "shareability": 0-100, "practicalValue": 0-100, "story": 0-100},
  "recommendations": ["actionable_tip_1", "actionable_tip_2", "actionable_tip_3"],
  "optimizedHashtags": ["#relevant", "#hashtags", "#for_virality"],
  "optimalTiming": {"best_day": "Monday-Sunday", "best_hour": "0-23", "timezone": "UTC"}
}`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-lite',
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
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
            sendSSE({
                step: 'error',
                message: 'AI analysis failed to return valid results',
                timestamp: new Date().toISOString()
            });
            res.end();
            return;
        }

        // Calculate engagement if needed
        if (hasCreatorData && typeof analysis.expectedEngagement !== 'number') {
            const engagementRate = Math.min(0.1, 0.02 * (analysis.viralProbability / 50));
            analysis.expectedEngagement = Math.floor(creatorData.followerCount * engagementRate);
        }

        // Send final results in EXACT same format as working analyze.js
        const finalResults = {
            success: true,
            viralProbability: Math.min(85, Math.max(0, analysis.viralProbability || 50)),
            confidenceScore: analysis.confidenceScore || 70,
            viralCategory: analysis.viralCategory || 'Moderate',
            expectedEngagement: analysis.expectedEngagement,
            psychologyScore: analysis.psychologyScore || {},
            recommendations: analysis.recommendations || [],
            optimizedHashtags: analysis.optimizedHashtags || [],
            optimalTiming: analysis.optimalTiming || {},
            hasCreatorData,
            creatorData: hasCreatorData ? {
                handle: creatorData.handle,
                followers: creatorData.followerCount,
                engagements: creatorData.engagements,
                platform: creatorData.platform,
            } : null,
            analysisSource: 'Google Gemini 2.0 Flash Lite',
            timestamp: new Date().toISOString(),
        };

        sendSSE({
            step: 'complete',
            message: `Analysis complete! ${finalResults.viralProbability}% viral probability`,
            timestamp: new Date().toISOString(),
            data: finalResults
        });

        res.end();

    } catch (error) {
        sendSSE({
            step: 'error',
            message: `Analysis failed: ${error.message}`,
            timestamp: new Date().toISOString()
        });
        res.end();
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
