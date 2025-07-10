import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'

export async function createMcpClient() {
  try {
    const apiKey = process.env.LUNARCRUSH_API_KEY
    
    if (!apiKey) {
      throw new Error('LUNARCRUSH_API_KEY not found in environment variables')
    }

    console.log('🔄 Initializing MCP client with SSE transport...')
    
    // Create SSE transport for LunarCrush MCP server
    const transport = new SSEClientTransport(
      new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
    )

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
    )

    // Connect to the server
    await client.connect(transport)
    console.log('✅ MCP client connected successfully to LunarCrush')
    
    return client
    
  } catch (error) {
    console.error('❌ MCP client initialization failed:', error)
    throw new Error(`MCP connection failed: ${error.message}`)
  }
}

// Execute MCP tool calls with proper error handling
export async function executeToolCall(client, toolName, args) {
  try {
    console.log(`🔄 Executing MCP tool: ${toolName} with args:`, args)
    
    const result = await client.callTool({
      name: toolName,
      arguments: args
    })
    
    console.log(`✅ MCP tool ${toolName} executed successfully`)
    return result
    
  } catch (error) {
    console.error(`❌ MCP tool call failed: ${toolName}`, error)
    throw new Error(`Tool ${toolName} failed: ${error.message}`)
  }
}

export default { createMcpClient, executeToolCall }
