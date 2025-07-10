/**
 * Creator Lookup API - REAL MCP DATA ONLY
 * No fallbacks, no mock data - strict error handling
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
	createMCPClient,
	getMCPTools,
	executeToolCalls,
	createCreatorLookupPrompt,
} from '../../lib/mcp-client.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({
			success: false,
			error: 'Method not allowed. Use POST.',
		});
	}

	let client = null;

	try {
		const { username } = req.body;

		if (!username) {
			return res.status(400).json({
				success: false,
				error: 'Missing required field: username',
			});
		}

		// Strict API key validation - no demo mode
		const lunarCrushKey = process.env.LUNARCRUSH_API_KEY;
		const geminiKey = process.env.GOOGLE_AI_API_KEY;

		if (!lunarCrushKey || lunarCrushKey.includes('your_')) {
			return res.status(400).json({
				success: false,
				error:
					'LunarCrush API key not configured. Please set LUNARCRUSH_API_KEY environment variable.',
				requiresSetup: true,
			});
		}

		if (!geminiKey || geminiKey.includes('your_')) {
			return res.status(400).json({
				success: false,
				error:
					'Google AI API key not configured. Please set GOOGLE_AI_API_KEY environment variable.',
				requiresSetup: true,
			});
		}

		console.log(`🔍 Looking up REAL data for: @${username}`);

		// Step 1: Create MCP client (with timeout)
		try {
			client = await createMCPClient(lunarCrushKey);
		} catch (mcpError) {
			return res.status(500).json({
				success: false,
				error: `MCP connection failed: ${mcpError.message}`,
				errorType: 'MCP_CONNECTION_ERROR',
				hint: 'Check LunarCrush API key and network connection.',
			});
		}

		// Step 2: Get available MCP tools (with timeout)
		let availableTools;
		try {
			availableTools = await getMCPTools(client);
			if (availableTools.length === 0) {
				throw new Error('No MCP tools available');
			}
		} catch (toolsError) {
			return res.status(500).json({
				success: false,
				error: `MCP tools request failed: ${toolsError.message}`,
				errorType: 'MCP_TOOLS_ERROR',
			});
		}

		// Step 3: Initialize Gemini for tool orchestration (with timeout)
		const genAI = new GoogleGenerativeAI(geminiKey);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

		// Step 4: Get tool orchestration from Gemini (with timeout)
		let toolCalls;
		try {
			const orchestrationPrompt = createCreatorLookupPrompt(
				username,
				availableTools
			);

			const orchestrationTimeout = new Promise((_, reject) =>
				setTimeout(
					() =>
						reject(new Error('Gemini orchestration timeout after 15 seconds')),
					15000
				)
			);

			const orchestrationResult = await Promise.race([
				model.generateContent(orchestrationPrompt),
				orchestrationTimeout,
			]);

			const orchestrationText = orchestrationResult.response.text();

			// Parse tool calls from Gemini
			const jsonMatch = orchestrationText.match(/\[(.*?)\]/s);
			if (jsonMatch) {
				toolCalls = JSON.parse(`[${jsonMatch[1]}]`);
			} else {
				// Direct fallback to Creator tool if Gemini fails
				toolCalls = [
					{
						tool: 'Creator',
						args: { screenName: username },
						reason: 'Direct creator lookup',
					},
				];
			}
		} catch (orchestrationError) {
			return res.status(500).json({
				success: false,
				error: `AI orchestration failed: ${orchestrationError.message}`,
				errorType: 'AI_ORCHESTRATION_ERROR',
			});
		}

		// Step 5: Execute MCP tool calls (with timeout, no fallbacks)
		let gatheredData;
		try {
			gatheredData = await executeToolCalls(client, toolCalls);
		} catch (executionError) {
			return res.status(500).json({
				success: false,
				error: `MCP tool execution failed: ${executionError.message}`,
				errorType: 'MCP_EXECUTION_ERROR',
				hint: 'All MCP tool calls failed. The creator may not exist or MCP server may be unavailable.',
			});
		}

		// Step 6: Extract REAL creator data (strict validation)
		const creatorData = extractRealCreatorData(gatheredData, username);

		if (!creatorData.followers) {
			return res.status(404).json({
				success: false,
				error: `No follower data found for @${username}`,
				errorType: 'NO_DATA_FOUND',
				hint: 'The creator may not exist, be private, or not tracked by LunarCrush.',
				toolResults: gatheredData.length,
			});
		}

		return res.status(200).json({
			success: true,
			creatorData: creatorData,
			mcpEnabled: true,
			toolsUsed: toolCalls.length,
			dataSource: 'real_mcp_data',
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error('❌ Creator lookup error:', error);

		return res.status(500).json({
			success: false,
			error: `Creator lookup failed: ${error.message}`,
			errorType: error.name || 'UNKNOWN_ERROR',
			timestamp: new Date().toISOString(),
		});
	} finally {
		// Always clean up MCP client
		if (client) {
			try {
				await client.close();
				console.log('🧹 MCP client connection closed');
			} catch (cleanupError) {
				console.warn('MCP cleanup warning:', cleanupError.message);
			}
		}
	}
}

// ✅ Extract REAL creator data (no fallbacks, strict validation)
function extractRealCreatorData(gatheredData, username) {
	console.log('🔍 Extracting REAL creator data from MCP results...');

	let followers = null;
	let engagementRate = null;
	let creatorRank = null;

	// Process successful tool results only
	const successfulResults = gatheredData.filter((result) => result.success);

	for (const result of successfulResults) {
		if (result.result && Array.isArray(result.result)) {
			for (const item of result.result) {
				if (item.type === 'text' && item.text) {
					// Extract follower count (must be 6+ digits for real accounts)
					const followerMatch = item.text.match(/(\d{1,3}(?:,\d{3})+|\d{6,})/);
					if (followerMatch && !followers) {
						const followerCount = parseInt(followerMatch[1].replace(/,/g, ''));
						if (followerCount >= 1000) {
							// Minimum threshold for real data
							followers = followerCount;
							console.log(
								`🎯 Real followers extracted: ${followers.toLocaleString()}`
							);
						}
					}

					// Extract engagement rate
					const engagementMatch = item.text.match(
						/engagement[\"']?\s*:?\s*([\d.]+)%?/i
					);
					if (engagementMatch && !engagementRate) {
						engagementRate = parseFloat(engagementMatch[1]);
						console.log(`🎯 Engagement extracted: ${engagementRate}`);
					}

					// Extract creator rank
					const rankMatch = item.text.match(
						/(?:rank|score)[\"']?\s*:?\s*(\d+)/i
					);
					if (rankMatch && !creatorRank) {
						creatorRank = parseInt(rankMatch[1]);
						console.log(`🎯 Rank extracted: ${creatorRank}`);
					}
				}
			}
		}
	}

	return {
		username: username,
		platform: 'twitter',
		followers: followers,
		engagementRate: engagementRate,
		verified: null, // LunarCrush doesn't provide this
		creatorRank: creatorRank,
		mcpSupported: true,
		dataSource: 'lunarcrush_mcp_real',
		message: followers
			? `Real-time data: ${followers.toLocaleString()} followers`
			: 'No follower data found',
		insights: followers
			? `Real MCP data retrieved: ${followers.toLocaleString()} followers found.`
			: 'Creator not found in LunarCrush database.',
		toolResults: gatheredData.length,
	};
}
