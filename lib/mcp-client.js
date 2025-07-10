/**
 * LunarCrush MCP Client - CORRECTED TOOL NAMES
 * Using correct MCP tool names: Creator, Topic, Search, etc.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export async function createMCPClient() {
	try {
		const apiKey = process.env.LUNARCRUSH_API_KEY;
		
		if (!apiKey) {
			throw new Error('LUNARCRUSH_API_KEY not found in environment variables');
		}

		console.log('🔄 Initializing MCP client with SSE transport...');
		
		// Create SSE transport for LunarCrush MCP server
		const transport = new SSEClientTransport(
			new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
		);

		// Create MCP client with proper configuration
		const client = new Client(
			{
				name: 'ai-viral-prediction-tool',
				version: '1.0.0',
			},
			{
				capabilities: {
					tools: {},
				},
			}
		);

		// Connect to the server
		await client.connect(transport);
		console.log('✅ MCP client connected successfully to LunarCrush');
		
		return client;
		
	} catch (error) {
		console.error('❌ MCP client initialization failed:', error);
		throw new Error(`MCP connection failed: ${error.message}`);
	}
}

// Get available tools from MCP server
export async function getMCPTools(client) {
	try {
		const tools = await client.listTools();
		console.log(`🛠️ Available MCP tools: ${tools.tools.map(t => t.name).join(', ')}`);
		return tools.tools;
	} catch (error) {
		console.error('❌ Failed to get MCP tools:', error);
		return [];
	}
}

// Execute MCP tool calls with proper error handling and CORRECT TOOL NAMES
export async function executeToolCall(client, toolName, args) {
	try {
		console.log(`🔄 Executing MCP tool: ${toolName} with args:`, args);
		
		const result = await client.callTool({
			name: toolName, // Use the tool name exactly as provided (Creator, Topic, etc.)
			arguments: args
		});
		
		console.log(`✅ MCP tool ${toolName} executed successfully`);
		return result;
		
	} catch (error) {
		console.error(`❌ MCP tool call failed: ${toolName}`, error);
		throw new Error(`Tool ${toolName} failed: ${error.message}`);
	}
}

// ✅ REAL DATA ONLY creator lookup prompt with CORRECT TOOL NAMES
export function createCreatorLookupPrompt(username, availableTools) {
	return `
You are a social media analyst. Find REAL creator data for @${username} using LunarCrush MCP tools.

AVAILABLE TOOLS:
${JSON.stringify(availableTools, null, 2)}

TASK: Get comprehensive social metrics for @${username}

STRATEGY (use EXACT tool names from available tools):
1. "Creator" tool with {"screenName": "${username}"} - for follower count and metrics
2. "Topic" tool with {"topic": "${username}"} - for additional social data

Respond with JSON array of 1-2 tool calls:
[
{
  "tool": "Creator",
  "args": {"screenName": "${username}"},
  "reason": "Get real follower count and creator metrics"
}
]

NO fallbacks - only real MCP data using correct tool names.
`;
}
