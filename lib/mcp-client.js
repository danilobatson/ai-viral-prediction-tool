import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

// ✅ Create MCP client with timeout handling
export async function createMCPClient(apiKey) {
  console.log('🔄 Initializing MCP client with timeout protection...');
  
  const transport = new SSEClientTransport(
    new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
  );

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

  // Add timeout to connection
  const connectionTimeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('MCP connection timeout after 15 seconds')), 15000)
  );

  await Promise.race([
    client.connect(transport),
    connectionTimeout
  ]);

  console.log('✅ MCP client connected successfully');
  return client;
}

// ✅ Get available tools with timeout
export async function getMCPTools(client) {
  try {
    const toolsTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MCP tools request timeout after 10 seconds')), 10000)
    );

    const tools = await Promise.race([
      client.listTools(),
      toolsTimeout
    ]);

    console.log(`🛠️ Available MCP tools: ${tools.tools.map(t => t.name).join(', ')}`);
    return tools.tools;
  } catch (error) {
    console.error('❌ Failed to get MCP tools:', error);
    throw new Error(`MCP tools request failed: ${error.message}`);
  }
}

// ✅ Execute MCP tool calls with timeout and NO fallbacks
export async function executeToolCalls(client, toolCalls) {
  const results = [];
  
  for (const toolCall of toolCalls) {
    try {
      console.log(`🔄 Executing tool: ${toolCall.tool} with args:`, toolCall.args);
      
      // Add timeout to each tool call
      const toolTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Tool ${toolCall.tool} timeout after 20 seconds`)), 20000)
      );

      const toolPromise = client.callTool({
        name: toolCall.tool,
        arguments: toolCall.args
      });

      const result = await Promise.race([toolPromise, toolTimeout]);
      
      results.push({
        tool: toolCall.tool,
        args: toolCall.args,
        reason: toolCall.reason,
        result: result.content,
        success: true
      });
      
    } catch (error) {
      console.error(`❌ Tool call failed: ${toolCall.tool}`, error.message);
      results.push({
        tool: toolCall.tool,
        args: toolCall.args,
        reason: toolCall.reason,
        error: error.message,
        success: false
      });
    }
  }
  
  // If NO tools succeeded, throw error (no fallbacks)
  const successCount = results.filter(r => r.success).length;
  if (successCount === 0) {
    throw new Error(`All ${results.length} MCP tool calls failed. No data available.`);
  }
  
  console.log(`✅ ${successCount}/${results.length} MCP tools succeeded`);
  return results;
}

// ✅ REAL DATA ONLY creator lookup prompt
export function createCreatorLookupPrompt(username, availableTools) {
  return `
You are a social media analyst. Find REAL creator data for @${username} using LunarCrush MCP tools.

AVAILABLE TOOLS:
${JSON.stringify(availableTools, null, 2)}

TASK: Get comprehensive social metrics for @${username}

STRATEGY (use EXACT tool names):
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

NO fallbacks - only real MCP data.
`;
}
