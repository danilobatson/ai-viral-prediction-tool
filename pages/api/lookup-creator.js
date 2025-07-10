/**
 * Creator Lookup API - CORRECTED MCP TOOL NAMES
 * Using correct tool names: Creator, Topic, etc.
 */
import { createMCPClient, executeToolCall } from '../../lib/mcp-client.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({
			success: false,
			error: 'Method not allowed. Use POST.',
		});
	}

	let mcpClient = null;

	try {
		const { username } = req.body;

		if (!username) {
			return res.status(400).json({
				success: false,
				error: 'Missing required field: username',
			});
		}

		console.log(`🔍 Looking up creator: @${username} using correct MCP tool names`);

		// Create MCP client connection
		mcpClient = await createMCPClient();
		
		// Call Creator tool with CORRECT name (just "Creator")
		const result = await executeToolCall(mcpClient, 'Creator', {
			screenName: username,
			network: 'x' // Default to X/Twitter
		});

		console.log('📊 MCP Creator Result:', JSON.stringify(result, null, 2));

		// Parse MCP response 
		if (!result || !result.content || result.content.length === 0) {
			return res.status(404).json({
				success: false,
				error: `No data found for @${username}`,
				message: 'Creator not found in LunarCrush database'
			});
		}

		// Extract creator data from MCP response
		const mcpContent = result.content[0];
		let followerCount = 0;
		let engagements = 0;

		if (mcpContent.type === 'text') {
			const text = mcpContent.text;
			console.log('📝 MCP Response Text:', text);
			
			// Extract follower count using patterns that work with LunarCrush MCP
			const followerMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*followers/i) || 
			                     text.match(/followers[:\s]*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i) ||
			                     text.match(/Followers:\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i);
			
			if (followerMatch) {
				followerCount = parseInt(followerMatch[1].replace(/,/g, ''));
				console.log(`✅ Extracted ${followerCount.toLocaleString()} followers`);
			}

			// Extract engagements if available
			const engagementMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*engagements/i) ||
			                       text.match(/Engagements:\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i);
			if (engagementMatch) {
				engagements = parseInt(engagementMatch[1].replace(/,/g, ''));
			}
		}

		// Validate we have real data
		if (followerCount === 0) {
			return res.status(404).json({
				success: false,
				error: `No follower data found for @${username}`,
				message: 'Creator exists but follower count not available'
			});
		}

		console.log(`✅ Successfully found @${username}: ${followerCount.toLocaleString()} followers via MCP`);

		// Return standardized creator data
		res.status(200).json({
			success: true,
			creator: {
				username: username,
				screenName: username,
				followers: followerCount,
				engagements: engagements,
				platform: 'x',
				verified: false,
				lastUpdated: new Date().toISOString()
			},
			metadata: {
				source: 'LunarCrush MCP',
				dataType: 'real-time',
				requestTime: new Date().toISOString()
			}
		});

	} catch (error) {
		console.error('❌ Creator Lookup Error:', error);

		// Handle specific error types with proper frontend messages
		if (error.message.includes('timeout')) {
			return res.status(408).json({
				success: false,
				error: 'Request timeout',
				message: 'Creator lookup took too long to complete'
			});
		}

		if (error.message.includes('API_KEY') || error.message.includes('authentication')) {
			return res.status(401).json({
				success: false,
				error: 'Authentication failed',
				message: 'Invalid LunarCrush API key'
			});
		}

		if (error.message.includes('Tool Creator not found')) {
			return res.status(500).json({
				success: false,
				error: 'MCP tool unavailable',
				message: 'Creator lookup tool not available on LunarCrush MCP server'
			});
		}

		// Generic error response
		return res.status(500).json({
			success: false,
			error: 'Creator lookup failed',
			message: error.message || 'Unknown error occurred while looking up creator',
			details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
