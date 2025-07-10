import { createMCPClient } from './lib/mcp-client.js';
import 'dotenv/config';

const testLunarCrushCreator = async () => {
  let client = null;
  
  try {
    console.log('🧪 Testing LunarCrush Creator tool specifically...');
    
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    client = await createMCPClient(apiKey);
    
    // Test usernames to try
    const testUsers = ['elonmusk', 'naval', 'vitalikbuterin'];
    
    for (const username of testUsers) {
      console.log(`\n📊 Testing Creator Tool for @${username}`);
      console.log('='.repeat(50));
      
      try {
        // Call the Creator tool directly
        const result = await client.callTool({
          name: 'LunarCrush MCP:Creator',
          arguments: { 
            screenName: username,
            network: 'twitter'
          }
        });
        
        console.log('✅ SUCCESS! Creator tool returned data');
        
        if (result.content && Array.isArray(result.content)) {
          result.content.forEach((item, idx) => {
            if (item.type === 'text' && item.text) {
              console.log(`📄 Content ${idx + 1}:`);
              
              try {
                // Try to parse as JSON first
                const jsonData = JSON.parse(item.text);
                console.log('📊 Parsed JSON data:');
                
                // Look for key creator metrics
                if (jsonData.followers || jsonData.followers_count) {
                  console.log(`🎯 FOLLOWERS: ${jsonData.followers || jsonData.followers_count}`);
                }
                if (jsonData.engagement_rate || jsonData.engagements) {
                  console.log(`🎯 ENGAGEMENT: ${jsonData.engagement_rate || jsonData.engagements}`);
                }
                if (jsonData.verified !== undefined) {
                  console.log(`🎯 VERIFIED: ${jsonData.verified}`);
                }
                if (jsonData.creator_rank || jsonData.rank) {
                  console.log(`🎯 RANK: ${jsonData.creator_rank || jsonData.rank}`);
                }
                
                // Show structure
                console.log('📋 Available fields:', Object.keys(jsonData).join(', '));
                
              } catch (parseError) {
                // Not JSON, show raw text and look for patterns
                console.log('📝 Raw text data:');
                console.log(item.text.substring(0, 300) + '...');
                
                // Look for key data patterns in text
                const followerMatch = item.text.match(/followers?[\"']?\s*:?\s*(\d+(?:,\d+)*)/i);
                const engagementMatch = item.text.match(/engagement[\"']?\s*:?\s*([\d.]+)/i);
                const verifiedMatch = item.text.match(/verified[\"']?\s*:?\s*(true|false)/i);
                
                if (followerMatch) console.log(`🎯 FOUND FOLLOWERS: ${followerMatch[1]}`);
                if (engagementMatch) console.log(`🎯 FOUND ENGAGEMENT: ${engagementMatch[1]}`);
                if (verifiedMatch) console.log(`🎯 FOUND VERIFIED: ${verifiedMatch[1]}`);
              }
            }
          });
        }
        
      } catch (error) {
        console.log(`❌ Creator tool failed for @${username}:`, error.message);
        
        // Try Topic tool as backup
        console.log('🔄 Trying Topic tool as backup...');
        try {
          const topicResult = await client.callTool({
            name: 'LunarCrush MCP:Topic',
            arguments: { topic: username }
          });
          
          console.log('✅ Topic tool backup successful');
          console.log('📄 Topic result preview:');
          console.log(JSON.stringify(topicResult, null, 2).substring(0, 200) + '...');
          
        } catch (topicError) {
          console.log('❌ Topic backup also failed:', topicError.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Creator test failed:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

testLunarCrushCreator();
