const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { SSEClientTransport } = require('@modelcontextprotocol/sdk/client/sse.js');

// ✅ WORKING: Create MCP client using the exact same method as voice-crypto-assistant
async function createMCPClient(apiKey) {
  console.log('🔄 Initializing MCP client with official SDK...');
  
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
  console.log('✅ MCP client connected successfully');
  return client;
}

// ✅ Get available tools from MCP server
async function getMCPTools(client) {
  try {
    const tools = await client.listTools();
    console.log(`🛠️ Available MCP tools: ${tools.tools.map(t => t.name).join(', ')}`);
    return tools.tools;
  } catch (error) {
    console.error('❌ Failed to get MCP tools:', error);
    return [];
  }
}

// ✅ Execute MCP tool calls with error handling
async function executeToolCalls(client, toolCalls) {
  const results = [];
  
  for (const toolCall of toolCalls) {
    try {
      console.log(`🔄 Executing tool: ${toolCall.tool} with args:`, toolCall.args);
      
      const result = await client.callTool({
        name: toolCall.tool,
        arguments: toolCall.args
      });
      
      results.push({
        tool: toolCall.tool,
        args: toolCall.args,
        reason: toolCall.reason,
        result: result.content,
        success: true
      });
      
    } catch (error) {
      console.error(`❌ Tool call failed: ${toolCall.tool}`, error);
      results.push({
        tool: toolCall.tool,
        args: toolCall.args,
        reason: toolCall.reason,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      });
    }
  }
  
  return results;
}

module.exports = {
  createMCPClient,
  getMCPTools,
  executeToolCalls
};
