import { createMCPClient } from './lib/mcp-client.js';
import 'dotenv/config';

const debugMCPTools = async () => {
  let client = null;
  
  try {
    console.log('🔍 Connecting to LunarCrush MCP server...');
    
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    if (!apiKey) {
      throw new Error('LUNARCRUSH_API_KEY not found');
    }
    
    // Create MCP client
    client = await createMCPClient(apiKey);
    
    // Get available tools
    console.log('🛠️ Getting available MCP tools...');
    const toolsResult = await client.listTools();
    
    console.log('📋 Available LunarCrush MCP Tools:');
    console.log('=====================================');
    
    toolsResult.tools.forEach((tool, index) => {
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
    
    console.log(`✅ Total tools available: ${toolsResult.tools.length}`);
    
  } catch (error) {
    console.error('❌ MCP debug failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

debugMCPTools();
