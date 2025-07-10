import { createMCPClient } from './lib/mcp-client.js';
import 'dotenv/config';

const debugDirectMCPCalls = async () => {
  let client = null;
  
  try {
    console.log('🔧 Testing direct MCP tool calls...');
    
    client = await createMCPClient(process.env.LUNARCRUSH_API_KEY);
    const toolsResult = await client.listTools();
    
    // Try some common tool patterns that might work for creator lookup
    const testCalls = [
      // Common creator lookup patterns
      { name: 'LunarCrush MCP:Creator', args: { screenName: 'elonmusk' } },
      { name: 'LunarCrush MCP:Creator', args: { network: 'twitter', screenName: 'elonmusk' } },
      { name: 'LunarCrush MCP:Topic', args: { topic: 'elonmusk' } },
      { name: 'LunarCrush MCP:Topic', args: { topic: '@elonmusk' } },
      
      // Try the first available tool with different params
      ...(toolsResult.tools.length > 0 ? [
        { name: toolsResult.tools[0].name, args: { screenName: 'elonmusk' } },
        { name: toolsResult.tools[0].name, args: { username: 'elonmusk' } },
        { name: toolsResult.tools[0].name, args: { topic: 'elonmusk' } }
      ] : [])
    ];
    
    for (const testCall of testCalls) {
      try {
        console.log(`\n🧪 Testing: ${testCall.name}`);
        console.log(`   Args: ${JSON.stringify(testCall.args)}`);
        
        const result = await client.callTool({
          name: testCall.name,
          arguments: testCall.args
        });
        
        console.log('✅ Success! Raw result:');
        console.log(JSON.stringify(result, null, 2));
        
        // Try to extract useful data
        if (result.content && Array.isArray(result.content)) {
          result.content.forEach((item, i) => {
            if (item.type === 'text' && item.text) {
              console.log(`📄 Text content ${i + 1}:`);
              console.log(item.text.substring(0, 300) + '...');
              
              // Look for follower/engagement patterns
              const followerMatch = item.text.match(/followers?[\"']?\s*:\s*(\d+)/i);
              const engagementMatch = item.text.match(/engagement[\"']?\s*:\s*([\d.]+)/i);
              
              if (followerMatch) console.log(`🎯 Found followers: ${followerMatch[1]}`);
              if (engagementMatch) console.log(`🎯 Found engagement: ${engagementMatch[1]}`);
            }
          });
        }
        
      } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Direct MCP test failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

debugDirectMCPCalls();
