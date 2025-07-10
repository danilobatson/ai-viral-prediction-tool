const start = Date.now();

const testData = {
  content: "Just built an amazing crypto tool! Check it out #crypto #bitcoin #ai",
  creatorData: {
    followers: 5000,
    engagements: 300
  }
};

fetch('http://localhost:3001/api/predict-viral-ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  const responseTime = Date.now() - start;
  console.log('✅ Response Time:', responseTime + 'ms');
  console.log('🎯 Confidence:', data.confidence + '%');
  console.log('📊 Expected Range for 5K followers: 25-55%');
  console.log('✅ In Range?', data.confidence >= 25 && data.confidence <= 55 ? 'YES' : 'NO');
  console.log('📝 Full Response:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('❌ Error:', error.message);
  console.log('💡 Make sure the server is running on port 3001');
});
