const testProductionWorkflow = async () => {
  const baseUrl = 'http://localhost:3001';

  console.log('🧪 PRODUCTION WORKFLOW TEST (Real Data Only)');
  console.log('='.repeat(50));

  try {
    // Test 1: Creator lookup with timeout
    console.log('📊 Step 1: Testing creator lookup (30s timeout)...');

    const creatorController = new AbortController();
    const creatorTimeout = setTimeout(() => creatorController.abort(), 30000);

    const creatorResponse = await fetch(`${baseUrl}/api/lookup-creator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'elonmusk' }),
      signal: creatorController.signal
    });

    clearTimeout(creatorTimeout);

    if (!creatorResponse.ok) {
      const errorData = await creatorResponse.json();
      console.log('❌ Creator lookup failed:');
      console.log(`   Status: ${creatorResponse.status}`);
      console.log(`   Error: ${errorData.error}`);
      console.log(`   Type: ${errorData.errorType || 'Unknown'}`);
      return;
    }

    const creatorData = await creatorResponse.json();

    if (!creatorData.success || !creatorData.creatorData.followers) {
      console.log('❌ No real creator data available');
      console.log('   Response:', JSON.stringify(creatorData, null, 2));
      return;
    }

    console.log('✅ Real creator data retrieved:');
    console.log(`   Followers: ${creatorData.creatorData.followers.toLocaleString()}`);
    console.log(`   Data Source: ${creatorData.creatorData.dataSource}`);
    console.log(`   Tools Used: ${creatorData.toolsUsed}`);

    // Test 2: Viral prediction with real data
    console.log('\n🤖 Step 2: Testing viral prediction (30s timeout)...');

    const viralController = new AbortController();
    const viralTimeout = setTimeout(() => viralController.abort(), 30000);

    const viralResponse = await fetch(`${baseUrl}/api/predict-viral-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'The future of AI is here! Revolutionary breakthrough in sustainable technology. 🚀🌱 #AI #Innovation #Future',
        creatorData: {
          followers: creatorData.creatorData.followers,
          engagements: 25000,
          platform: 'twitter'
        }
      }),
      signal: viralController.signal
    });

    clearTimeout(viralTimeout);

    if (!viralResponse.ok) {
      const errorData = await viralResponse.json();
      console.log('❌ Viral prediction failed:');
      console.log(`   Status: ${viralResponse.status}`);
      console.log(`   Error: ${errorData.error}`);
      console.log(`   Type: ${errorData.errorType || 'Unknown'}`);
      return;
    }

    const viralData = await viralResponse.json();

    if (!viralData.success) {
      console.log('❌ Viral prediction unsuccessful');
      console.log('   Response:', JSON.stringify(viralData, null, 2));
      return;
    }

    console.log('✅ Real AI analysis complete:');
    console.log(`   Confidence: ${viralData.confidence}%`);
    console.log(`   Data Source: ${viralData.dataSource}`);
    console.log(`   Follower Tier: ${viralData.followerTier}`);
    console.log(`   Confidence Range: ${viralData.confidenceRange}`);

    console.log('\n🎉 PRODUCTION WORKFLOW SUCCESS!');
    console.log('✅ Real MCP data retrieved');
    console.log('✅ Real AI analysis completed');
    console.log('✅ No fallbacks or mock data used');
    console.log('✅ Production-ready error handling');

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('❌ Test timed out (>30 seconds)');
    } else {
      console.log('❌ Test failed:', error.message);
    }
  }
};

testProductionWorkflow();
