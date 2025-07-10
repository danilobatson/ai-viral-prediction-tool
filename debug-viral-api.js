const testViralAPI = async () => {
  try {
    console.log('🧪 Testing viral prediction API with detailed error handling...');
    
    const testData = {
      content: 'Building the future with AI! 🚀',
      creatorData: {
        followers: 44196397,
        engagements: 15000,
        platform: 'twitter'
      }
    };
    
    console.log('📤 Sending request:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3001/api/predict-viral-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Parsed response:', JSON.stringify(data, null, 2));
      } catch (parseError) {
        console.log('❌ Failed to parse JSON:', parseError.message);
      }
    } else {
      console.log('❌ HTTP Error:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.error('Stack:', error.stack);
  }
};

testViralAPI();
