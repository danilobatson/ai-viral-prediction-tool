import { createMcpClient, executeToolCall } from '../../lib/mcp-client.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({
			success: false,
			error: 'Method not allowed. Use POST.',
		});
	}

	let mcpClient = null;

	try {
		const { creator } = req.body;

		if (!creator || !creator.trim()) {
			return res.status(400).json({
				success: false,
				error: 'Creator handle is required',
			});
		}

		// PROPERLY CLEAN THE CREATOR HANDLE
		const cleanCreator = creator.trim().replace(/^@+/, '').toLowerCase();
		console.log(
			`🔍 Looking up creator: "${cleanCreator}" (original: "${creator}")`
		);

		// Check if API keys are configured
		if (!process.env.LUNARCRUSH_API_KEY) {
			return res.status(500).json({
				success: false,
				error: 'LunarCrush API key not configured',
			});
		}

		if (!process.env.GEMINI_API_KEY) {
			return res.status(500).json({
				success: false,
				error: 'Google Gemini API key not configured',
			});
		}

		// Create MCP client connection
		mcpClient = await createMcpClient();

		// IMPROVED LLM prompt for better data extraction
		let orchestrationResult;
		let retryCount = 0;
		const maxRetries = 3;

		while (retryCount < maxRetries) {
			try {
				const orchestrationPrompt = `You are a social media data analyst. I need comprehensive data for creator "${cleanCreator}".

AVAILABLE MCP TOOLS:
- Creator: Get creator metrics (screenName, network)
- Topic: Get topic/keyword data (topic)

TASK: Create a plan to get complete social media data for "${cleanCreator}"

Respond with JSON array of tool calls:
[
  {
    "tool": "Creator",
    "args": {"screenName": "${cleanCreator}", "network": "x"},
    "reason": "Get follower count and engagement metrics"
  }
]

Use exact tool names and proper parameters. No explanations, just JSON array.`;

				console.log(
					`🤖 Using LLM to orchestrate MCP calls (attempt ${retryCount + 1})...`
				);
				const model = genAI.getGenerativeModel({
					model: 'gemini-2.0-flash-lite',
				});
				orchestrationResult = await model.generateContent(orchestrationPrompt);
				break; // Success, exit retry loop
			} catch (llmError) {
				retryCount++;
				console.log(`❌ LLM attempt ${retryCount} failed:`, llmError.message);

				if (retryCount >= maxRetries) {
					// If all LLM retries fail, try direct MCP call
					console.log('🔄 LLM failed, trying direct MCP call...');
					try {
						const directResult = await executeToolCall(mcpClient, 'Creator', {
							screenName: cleanCreator,
							network: 'x',
						});

						return await parseAndReturnCreatorData(
							directResult,
							cleanCreator,
							res,
							'Direct MCP'
						);
					} catch (directError) {
						console.error('❌ Direct MCP call also failed:', directError);
						return res.status(500).json({
							success: false,
							error: `Both LLM and direct MCP lookup failed for "${cleanCreator}": ${directError.message}`,
						});
					}
				}

				// Wait before retry (exponential backoff)
				await new Promise((resolve) =>
					setTimeout(resolve, Math.pow(2, retryCount) * 1000)
				);
			}
		}

		const orchestrationText = orchestrationResult.response.text();

		// Parse LLM orchestration response
		let toolCalls;
		try {
			const jsonMatch = orchestrationText.match(/\[[\s\S]*\]/);
			if (!jsonMatch) {
				throw new Error('No valid JSON array found in LLM response');
			}
			toolCalls = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			console.error('❌ Failed to parse LLM orchestration:', parseError);
			return res.status(500).json({
				success: false,
				error: 'LLM failed to create proper tool orchestration plan',
			});
		}

		console.log('🎯 LLM orchestrated tool calls:', toolCalls);

		// Execute the LLM-orchestrated tool calls
		let combinedResults = [];
		for (const toolCall of toolCalls) {
			try {
				const result = await executeToolCall(
					mcpClient,
					toolCall.tool,
					toolCall.args
				);
				combinedResults.push({
					tool: toolCall.tool,
					args: toolCall.args,
					reason: toolCall.reason,
					result: result,
				});
			} catch (toolError) {
				console.error(`❌ Tool ${toolCall.tool} failed:`, toolError);
				// Continue with other tools
			}
		}

		if (combinedResults.length === 0) {
			return res.status(404).json({
				success: false,
				error: `No data found for "${cleanCreator}" in LunarCrush database`,
			});
		}

		// IMPROVED parsing with better LLM extraction
		return await parseCreatorDataWithLLM(combinedResults, cleanCreator, res);
	} catch (error) {
		console.error('❌ LLM-Orchestrated Creator Lookup Error:', error);
		return res.status(500).json({
			success: false,
			error: `Creator lookup failed: ${error.message}`,
		});
	} finally {
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

// IMPROVED function to parse creator data using LLM
async function parseCreatorDataWithLLM(mcpResults, cleanCreator, res) {
	try {
		// Combine all MCP response text
		let allResponseText = '';
		for (const toolResult of mcpResults) {
			if (toolResult.result && toolResult.result.content) {
				for (const content of toolResult.result.content) {
					if (content.type === 'text') {
						allResponseText += content.text + '\n';
					}
				}
			}
		}

		console.log(`📝 Raw MCP Response for ${cleanCreator}:`, allResponseText);

		// Use LLM to extract data more accurately
		const extractionPrompt = `Extract the social media metrics for "${cleanCreator}" from this data:

${allResponseText}

IMPORTANT: Look for LARGE engagement numbers (millions for popular accounts like elonmusk, not small numbers like 297).

Return ONLY valid JSON in this exact format:
{
  "followers": <number>,
  "engagements": <number>,
  "found": <true/false>
}

Examples:
- For elonmusk: engagements should be in millions (like 50000000+)
- For smaller accounts: engagements might be thousands
- If you see small numbers like 297 for famous accounts, look for larger numbers in the data

Extract the HIGHEST/MOST REALISTIC numbers you find.`;

		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
		const extractionResult = await model.generateContent(extractionPrompt);
		const extractionText = extractionResult.response.text();

		// Parse LLM extraction
		let extractedData;
		try {
			const jsonMatch = extractionText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No valid JSON found in LLM extraction');
			}
			extractedData = JSON.parse(jsonMatch[0]);
		} catch (parseError) {
			console.error('❌ Failed to parse LLM extraction:', parseError);
			// Fallback to regex parsing
			return await parseAndReturnCreatorData(
				{ content: [{ type: 'text', text: allResponseText }] },
				cleanCreator,
				res,
				'Regex Fallback'
			);
		}

		if (!extractedData.found || extractedData.followers === 0) {
			return res.status(404).json({
				success: false,
				error: `No follower data found for "${cleanCreator}" in LunarCrush database`,
			});
		}

		console.log(
			`✅ LLM-extracted data for @${cleanCreator}: ${extractedData.followers.toLocaleString()} followers, ${extractedData.engagements.toLocaleString()} engagements`
		);

		// Return standardized creator data
		return res.status(200).json({
			success: true,
			data: {
				handle: cleanCreator,
				followerCount: extractedData.followers,
				followers: extractedData.followers,
				engagements: extractedData.engagements,
				influenceScore: null,
				engagement: null,
				verified: false,
				source: 'LLM-Enhanced MCP Analysis',
			},
			metadata: {
				source: 'LunarCrush MCP via Enhanced LLM Extraction',
				requestTime: new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error('❌ LLM parsing failed:', error);
		// Fallback to regex parsing
		return await parseAndReturnCreatorData(
			mcpResults[0]?.result,
			cleanCreator,
			res,
			'LLM Fallback'
		);
	}
}

// Fallback regex parsing function
async function parseAndReturnCreatorData(result, cleanCreator, res, source) {
	let followerCount = 0;
	let engagements = 0;

	if (result && result.content) {
		for (const content of result.content) {
			if (content.type === 'text') {
				const text = content.text;
				console.log(`📝 ${source} Response:`, text);

				// Extract follower count with better patterns
				const followerMatches = [
					text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*followers/i),
					text.match(/followers[:\s]*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i),
					text.match(/Followers:\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i),
					text.match(/"followers":\s*(\d+)/i),
				];

				for (const match of followerMatches) {
					if (match) {
						followerCount = Math.max(
							followerCount,
							parseInt(match[1].replace(/,/g, ''))
						);
					}
				}

				// Extract engagements with better patterns for LARGE numbers
				const engagementMatches = [
					text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*engagements/i),
					text.match(/Engagements:\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i),
					text.match(/"engagements":\s*(\d+)/i),
					text.match(/total[_\s]*engagement[s]?[:\s]*(\d{1,3}(?:,\d{3})*)/i),
					text.match(/average[_\s]*engagement[s]?[:\s]*(\d{1,3}(?:,\d{3})*)/i),
				];

				for (const match of engagementMatches) {
					if (match) {
						const engNum = parseInt(match[1].replace(/,/g, ''));
						// For famous accounts, prefer larger engagement numbers
						if (followerCount > 1000000 && engNum > 100000) {
							engagements = Math.max(engagements, engNum);
						} else if (followerCount < 1000000) {
							engagements = Math.max(engagements, engNum);
						}
					}
				}
			}
		}
	}

	// Validate we have real data
	if (followerCount === 0) {
		return res.status(404).json({
			success: false,
			error: `No follower data found for "${cleanCreator}" in LunarCrush database`,
		});
	}

	console.log(
		`✅ ${source} lookup found @${cleanCreator}: ${followerCount.toLocaleString()} followers, ${engagements.toLocaleString()} engagements`
	);

	// Return standardized creator data
	return res.status(200).json({
		success: true,
		data: {
			handle: cleanCreator,
			followerCount: followerCount,
			followers: followerCount,
			engagements: engagements,
			influenceScore: null,
			engagement: null,
			verified: false,
			source: source,
		},
		metadata: {
			source: `LunarCrush MCP via ${source}`,
			requestTime: new Date().toISOString(),
		},
	});
}
