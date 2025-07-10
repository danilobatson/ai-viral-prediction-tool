import { createMCPClient, getMCPTools } from './lib/mcp-client.js';
import 'dotenv/config';

const debugMCPTools = async () => {
  let client = null;
  
  try {
    console.log('🔍 Connecting to LunarCrush MCP server...');
    
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    if (!apiKey || apiKey.includes('your_')) {
      console.log('❌ LunarCrush API key not configured properly');
      console.log('Current key:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
      return;
    }
    
    // Create MCP client
    client = await createMCPClient(apiKey);
    
    // Get available tools
    console.log('🛠️ Getting available MCP tools...');
    const tools = await getMCPTools(client);
    
    console.log('📋 Available LunarCrush MCP Tools:');
    console.log('=====================================');
    
    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Description: ${tool.description || 'No description'}`);
      
      if (tool.inputSchema && tool.inputSchema.properties) {
        console.log(`   Parameters:`);
        Object.entries(tool.inputSchema.properties).forEach(([param, schema]) => {
          console.log(`     - ${param}: ${schema.type || 'unknown'} ${schema.description ? '(' + schema.description + ')' : ''}`);
        });
      }
      console.log('');
    });
    
    console.log(`✅ Total tools available: ${tools.length}`);
    return tools;
    
  } catch (error) {
    console.error('❌ MCP debug failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

// Run the debug
debugMCPTools();
