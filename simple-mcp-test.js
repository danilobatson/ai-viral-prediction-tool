const { createMCPClient, getMCPTools } = require('./lib/mcp-client-cjs.js');
require('dotenv/config');

const simpleMCPTest = async () => {
  let client = null;
  
  try {
    console.log('🔍 Simple MCP connection test...');
    
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    if (!apiKey || apiKey.includes('your_')) {
      console.log('❌ LunarCrush API key not configured properly');
      return;
    }
    
    console.log('🔄 Connecting to MCP server...');
    client = await createMCPClient(apiKey);
    
    console.log('🛠️ Getting available tools...');
    const tools = await getMCPTools(client);
    
    console.log('📊 MCP Test Results:');
    console.log('===================');
    console.log(`✅ Connection: SUCCESS`);
    console.log(`✅ Tools found: ${tools.length}`);
    
    if (tools.length > 0) {
      console.log('🔧 Available tools:');
      tools.forEach((tool, i) => {
        console.log(`  ${i + 1}. ${tool.name}`);
      });
      
      // Try calling the first tool with a simple creator lookup
      if (tools.length > 0) {
        console.log(`\n🧪 Testing first tool: ${tools[0].name}`);
        
        try {
          const result = await client.callTool({
            name: tools[0].name,
            arguments: { screenName: 'elonmusk' }
          });
          
          console.log('✅ Tool call successful!');
          console.log('📄 Response preview:');
          console.log(JSON.stringify(result, null, 2).substring(0, 500) + '...');
          
        } catch (toolError) {
          console.log('❌ Tool call failed:', toolError.message);
          
          // Try with different parameters
          try {
            const result2 = await client.callTool({
              name: tools[0].name,
              arguments: { topic: 'elonmusk' }
            });
            console.log('✅ Tool call with different params successful!');
          } catch (e) {
            console.log('❌ Alternative parameters also failed');
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ MCP test failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

simpleMCPTest();
