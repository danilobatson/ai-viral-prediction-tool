const testCases = [
  {
    name: '1. Mega Creator (Should be High but Realistic)',
    content: "🚀 Mars colony update: We're making incredible progress! The future of humanity is multiplanetary. #SpaceX #Mars",
    creatorData: {
      followers: 150000000,
      engagements: 2500000,
      verified: true
    },
    expectedRange: { min: 75, max: 95 }
  },
  {
    name: '2. Mid Creator (Should be Moderate)',
    content: "Building amazing crypto tools for the community! Check out our latest features 🔥 #crypto #tools #community",
    creatorData: {
      followers: 75000,
      engagements: 4000,
      verified: false
    },
    expectedRange: { min: 40, max: 70 }
  },
  {
    name: '3. Small Creator (Should be Low-Moderate)',
    content: "Just shipped my latest project! Really excited to share this with everyone #project #coding #excited",
    creatorData: {
      followers: 5000,
      engagements: 300,
      verified: false
    },
    expectedRange: { min: 25, max: 55 }
  },
  {
    name: '4. Micro Creator (Should be Low)',
    content: "My first crypto investment! Still learning but excited about the journey #crypto #learning #newbie",
    creatorData: {
      followers: 250,
      engagements: 20,
      verified: false
    },
    expectedRange: { min: 10, max: 35 }
  },
  {
    name: '5. No Creator Data (Should Use Fallback)',
    content: "Amazing breakthrough in AI today! This changes everything for developers #ai #breakthrough #tech",
    creatorData: null,
    expectedRange: { min: 20, max: 50 }
  }
];

const baseUrl = 'http://localhost:3001';

async function testOptimizedPrompts() {
  console.log('🚀 Testing Optimized Gemini Prompts...\n');

  let results = [];
  let totalTime = 0;
  let passedTests = 0;

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    console.log(`📊 ${test.name}`);
    console.log('============================================================');

    const start = Date.now();

    try {
      const response = await fetch(`${baseUrl}/api/predict-viral-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: test.content,
          creatorData: test.creatorData
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const responseTime = Date.now() - start;
      totalTime += responseTime;

      const confidence = result.confidence || 0;
      const inRange = confidence >= test.expectedRange.min && confidence <= test.expectedRange.max;

      if (inRange) passedTests++;

      console.log(`⏱️  Response time: ${responseTime}ms`);
      console.log(`🎯 Confidence: ${confidence}% ${inRange ? '✅' : '❌'} (Expected: ${test.expectedRange.min}-${test.expectedRange.max}%)`);
      console.log(`📱 Platform Fit: ${result.platformFit}%`);
      console.log(`📝 Content Score: ${result.contentScore}%`);
      console.log(`👤 Creator Authority: ${result.creatorAuthority}%`);
      console.log(`📈 Expected Engagement: ${result.expectedEngagement?.toLocaleString()}`);
      console.log(`🚀 AI Optimizations: ${result.optimizations ? '✅' : '❌'}`);
      console.log(`💡 Insights Quality: ${result.insights ? '✅' : '❌'}`);
      console.log(`#️⃣ Hashtag Suggestions: ${result.hashtags ? '✅' : '❌'}`);
      console.log(`💡 Key Insight: ${result.keyInsight}`);

      results.push({
        name: test.name,
        responseTime,
        confidence,
        inRange,
        quality: (result.optimizations && result.insights && result.hashtags) ? 3 :
                (result.optimizations && result.insights) ? 2 : 1
      });

    } catch (error) {
      console.log(`❌ Test failed: ${error.message}`);
      results.push({
        name: test.name,
        responseTime: 0,
        confidence: 0,
        inRange: false,
        quality: 0
      });
    }

    console.log('');
  }

  const avgTime = Math.round(totalTime / testCases.length);
  const avgQuality = results.reduce((sum, r) => sum + r.quality, 0) / results.length;
  const failedRequests = results.filter(r => r.responseTime === 0).length;

  console.log('🎉 OPTIMIZATION RESULTS SUMMARY');
  console.log('============================================================');
  console.log(`📊 Realistic Scoring: ${passedTests}/${testCases.length} tests (${Math.round(passedTests/testCases.length*100)}%)`);
  console.log(`⚡ Average Response Time: ${avgTime}ms`);
  console.log(`🎯 Average Quality Score: ${avgQuality.toFixed(1)}/3`);
  console.log(`❌ Failed Requests: ${failedRequests}`);

  console.log('\n🔍 Individual Results:');
  results.forEach((result, i) => {
    const status = result.inRange ? '✅' : result.responseTime === 0 ? '❌ ERROR' : '⚠️ ' + result.confidence + '%';
    console.log(`   ${i + 1}. ${result.name.replace(/^\d+\.\s*/, '')}: ${status}`);
  });

  console.log('\n🎯 OPTIMIZATION SUCCESS METRICS:');
  console.log(`   ✅ Faster responses: ${avgTime < 8000 ? 'YES' : 'NO'} (${avgTime}ms avg)`);
  console.log(`   ✅ Realistic scoring: ${passedTests >= 4 ? 'YES' : 'NO'} (${passedTests}/${testCases.length} realistic)`);
  console.log(`   ✅ Quality outputs: ${avgQuality >= 2.5 ? 'YES' : 'NO'} (${avgQuality.toFixed(1)}/3 avg quality)`);
  console.log(`   ✅ Error handling: ${failedRequests === 0 ? 'YES' : 'NO'}`);
}

// Check if server is running
fetch(`${baseUrl}/api/health`)
  .catch(() => {
    console.log('❌ Server not running on port 3001');
    console.log('🚀 Start server: npm run dev');
    process.exit(1);
  })
  .then(() => testOptimizedPrompts())
  .catch(error => {
    console.error('Test error:', error);
  });
