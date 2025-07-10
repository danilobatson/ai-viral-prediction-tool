async function testActualLLM() {
  console.log('🧪 Testing ACTUAL LLM (not fallback)...\n');
  
  const testData = {
    content: "Just launched my AI startup! This will revolutionize everything 🚀 #ai #startup #innovation #tech",
    creatorData: {
      followers: 50000,
      engagements: 2500
    }
  };
  
  console.log('📝 Test Content:', testData.content);
  console.log('👤 Creator:', testData.creatorData.followers.toLocaleString(), 'followers\n');
  
  const start = Date.now();
  
  try {
    const response = await fetch('http://localhost:3001/api/predict-viral-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const result = await response.json();
    const responseTime = Date.now() - start;
    
    console.log('⏱️ Response Time:', responseTime + 'ms');
    console.log('🤖 Used LLM?', responseTime > 1000 ? '✅ YES (slow = real LLM)' : '❌ NO (fast = fallback)');
    console.log('🎯 Confidence:', result.confidence + '%');
    console.log('💡 Key Insight:', result.keyInsight);
    console.log('🔧 Optimizations:', result.optimizations);
    
    // Check if response looks like fallback
    const isFallback = result.keyInsight === "Content has moderate viral potential" && 
                      responseTime < 500;
    
    if (isFallback) {
      console.log('\n⚠️  WARNING: This looks like fallback response!');
      console.log('🔍 Check your .env file for GOOGLE_AI_API_KEY');
    } else {
      console.log('\n✅ SUCCESS: Real LLM response received!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testActualLLM();
