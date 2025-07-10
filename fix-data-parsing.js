// This will be updated once we see the actual MCP response structure

function extractCreatorDataFromMCP(gatheredData, username) {
  console.log('🔍 Extracting creator data from MCP results...');
  
  let followers = null;
  let engagementRate = null;
  let verified = null;
  let creatorRank = null;
  
  // Process successful tool results
  const successfulResults = gatheredData.filter(result => result.success);
  
  for (const result of successfulResults) {
    if (result.result && Array.isArray(result.result)) {
      for (const item of result.result) {
        if (item.type === 'text' && item.text) {
          try {
            // Try JSON parsing first
            const data = JSON.parse(item.text);
            
            // Extract common creator metrics
            followers = followers || data.followers || data.followers_count || data.follower_count;
            engagementRate = engagementRate || data.engagement_rate || data.engagements;
            verified = verified !== null ? verified : data.verified;
            creatorRank = creatorRank || data.creator_rank || data.rank;
            
          } catch (parseError) {
            // Try regex extraction from text
            const followerMatch = item.text.match(/followers?[\"']?\s*:?\s*(\d+(?:,\d+)*)/i);
            const engagementMatch = item.text.match(/engagement[\"']?\s*:?\s*([\d.]+)/i);
            const verifiedMatch = item.text.match(/verified[\"']?\s*:?\s*(true|false)/i);
            
            if (followerMatch && !followers) {
              followers = parseInt(followerMatch[1].replace(/,/g, ''));
            }
            if (engagementMatch && !engagementRate) {
              engagementRate = parseFloat(engagementMatch[1]);
            }
            if (verifiedMatch && verified === null) {
              verified = verifiedMatch[1] === 'true';
            }
          }
        }
      }
    }
  }
  
  return {
    username,
    followers,
    engagementRate,
    verified,
    creatorRank,
    dataSource: 'lunarcrush_mcp',
    toolResults: gatheredData.length
  };
}

console.log('📝 Data parsing function created');
console.log('Run the Creator tool test first to see actual data structure');
