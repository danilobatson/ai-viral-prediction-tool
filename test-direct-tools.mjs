import { createMCPClient, getMCPTools } from './lib/mcp-client.js';
import 'dotenv/config';

const testDirectTools = async () => {
  let client = null;
  
  try {
    console.log('🔧 Testing direct MCP tool calls...');
    
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    client = await createMCPClient(apiKey);
    const tools = await getMCPTools(client);
    
    if (tools.length === 0) {
      console.log('❌ No tools available to test');
      return;
    }
    
    console.log(`🛠️ Found ${tools.length} tools, testing each one...`);
    
    // Test each tool with common creator lookup parameters
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      console.log(`\n🧪 Testing Tool ${i + 1}: ${tool.name}`);
      console.log('='.repeat(50));
      
      // Try different parameter combinations
      const testParams = [
        { screenName: 'elonmusk' },
        { username: 'elonmusk' }, 
        { topic: 'elonmusk' },
        { topic: '@elonmusk' },
        { network: 'twitter', screenName: 'elonmusk' },
        { query: 'elonmusk' }
      ];
      
      for (const params of testParams) {
        try {
          console.log(`   📝 Trying params: ${JSON.stringify(params)}`);
          
          const result = await client.callTool({
            name: tool.name,
            arguments: params
          });
          
          console.log('   ✅ SUCCESS! Raw result:');
          
          if (result.content && Array.isArray(result.content)) {
            result.content.forEach((item, idx) => {
              if (item.type === 'text' && item.text) {
                console.log(`   📄 Content ${idx + 1}:`);
                const preview = item.text.length > 200 ? item.text.substring(0, 200) + '...' : item.text;
                console.log(`   ${preview}`);
                
                // Look for key data patterns
                const followerMatch = item.text.match(/followers?[\"']?\s*:?\s*(\d+(?:,\d+)*)/i);
                const engagementMatch = item.text.match(/engagement[\"']?\s*:?\s*([\d.]+)/i);
                const verifiedMatch = item.text.match(/verified[\"']?\s*:?\s*(true|false)/i);
                
                if (followerMatch) console.log(`   🎯 FOUND FOLLOWERS: ${followerMatch[1]}`);
                if (engagementMatch) console.log(`   🎯 FOUND ENGAGEMENT: ${engagementMatch[1]}`);
                if (verifiedMatch) console.log(`   🎯 FOUND VERIFIED: ${verifiedMatch[1]}`);
              }
            });
          } else {
            console.log('   📦 Result structure:');
            console.log('   ' + JSON.stringify(result, null, 2).substring(0, 300) + '...');
          }
          
          // Found working combination, move to next tool
          break;
          
        } catch (error) {
          console.log(`   ❌ Failed: ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Direct tool test failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

testDirectTools();
