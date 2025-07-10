async function testLunarCrushIntegration() {
  console.log('🧪 Testing LunarCrush Creator Lookup...\n');
  
  const testUsernames = ['elonmusk', 'naval', 'vitalikbuterin'];
  
  for (const username of testUsernames) {
    console.log(`📊 Testing: @${username}`);
    console.log('----------------------------------------');
    
    try {
      const response = await fetch('http://localhost:3001/api/lookup-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.log(`❌ Error: ${data.error}`);
      } else {
        console.log(`✅ Followers: ${data.followers?.toLocaleString() || 'N/A'}`);
        console.log(`✅ Engagements: ${data.engagements?.toLocaleString() || 'N/A'}`);
        console.log(`✅ CreatorRank: ${data.creatorRank || 'N/A'}`);
        console.log(`✅ Verified: ${data.verified !== undefined ? data.verified : 'N/A'}`);
        console.log(`📈 Social Influence: ${data.socialInfluence || 'N/A'}`);
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
    
    console.log('');
  }
}

// Check if server is running first
fetch('http://localhost:3001/api/health')
  .catch(() => {
    console.log('❌ Server not running on port 3001');
    console.log('🚀 Start the server first with: npm run dev');
    process.exit(1);
  })
  .then(() => testLunarCrushIntegration())
  .catch(error => {
    if (error.message.includes('ECONNREFUSED')) {
      console.log('❌ Server not running on port 3001');
      console.log('🚀 Start the server first with: npm run dev');
    } else {
      console.error('Test error:', error);
    }
  });
