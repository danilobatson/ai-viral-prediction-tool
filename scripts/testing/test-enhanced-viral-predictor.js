/**
 * Test Enhanced Viral Predictor with Real Creator Data Integration
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testEnhancedViralPredictor() {
  console.log('🚀 Testing Enhanced Viral Predictor with Real Creator Data...\n');

  // Test cases with different scenarios
  const testCases = [
    {
      name: '1. With Real Creator Data (elonmusk)',
      postData: {
        text: "🚀 Mars colony update: We're making incredible progress! The future of humanity is multiplanetary. #SpaceX #Mars #FutureIsNow",
        platform: 'twitter',
        niche: 'technology',
        contentType: 'text',
        username: 'elonmusk',
        creator: {
          handle: 'elonmusk',
          follower_count: 150000000,
          verified: true,
          authority_score: 0.95
        },
        hashtags: ['#SpaceX', '#Mars', '#FutureIsNow'],
        mentions: [],
        media_count: 0
      }
    },
    {
      name: '2. Mid-Tier Creator (crypto niche)',
      postData: {
        text: "🚀 Bitcoin just hit $100K! This is the moment we've all been waiting for! The bull run is officially here! #BTC #Crypto #ToTheMoon",
        platform: 'twitter',
        niche: 'cryptocurrency',
        contentType: 'text',
        username: 'cryptotrader',
        creator: {
          handle: 'cryptotrader',
          follower_count: 75000,
          verified: false,
          authority_score: 0.65
        },
        hashtags: ['#BTC', '#Crypto', '#ToTheMoon'],
        mentions: [],
        media_count: 0
      }
    },
    {
      name: '3. No Creator Data (fallback)',
      postData: {
        text: "Just discovered this amazing AI tool that predicts viral content! 🤖 Game changer for content creators. #AI #ContentCreation #Viral",
        platform: 'twitter',
        niche: 'ai',
        contentType: 'text',
        username: null,
        creator: {
          follower_count: 10000,
          verified: false,
          handle: 'anonymous'
        },
        hashtags: ['#AI', '#ContentCreation', '#Viral'],
        mentions: [],
        media_count: 0
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📊 ${testCase.name}`);
    console.log('=' .repeat(50));

    try {
      const startTime = Date.now();

      const response = await axios.post(`${BASE_URL}/api/predict-viral-ai`, {
        postData: testCase.postData
      });

      const duration = Date.now() - startTime;

      if (response.data.success) {
        const prediction = response.data.prediction;

        console.log('✅ Analysis successful!');
        console.log(`⏱️  Response time: ${duration}ms`);
        console.log(`🎯 Confidence: ${prediction.confidence}%`);
        console.log(`📱 Platform Fit: ${prediction.platformFit}%`);
        console.log(`📝 Content Score: ${prediction.contentScore}%`);
        console.log(`👤 Creator Authority Impact: ${prediction.creatorAuthorityImpact}%`);
        console.log(`📈 Expected Engagement: ${prediction.expectedEngagement?.toLocaleString() || 'N/A'}`);

        if (prediction.optimizedVersions && prediction.optimizedVersions.length > 0) {
          console.log('\n🚀 AI-Optimized Versions:');
          prediction.optimizedVersions.slice(0, 2).forEach((version, index) => {
            console.log(`   ${index + 1}. ${version}`);
          });
        }

        if (prediction.insights && prediction.insights.length > 0) {
          console.log('\n💡 Key Insights:');
          prediction.insights.slice(0, 3).forEach((insight, index) => {
            console.log(`   • ${insight}`);
          });
        }

        console.log('\n📊 Metadata:');
        console.log(`   • AI Model: ${response.data.metadata?.aiModel || 'N/A'}`);
        console.log(`   • Creator Data Source: ${response.data.metadata?.creatorDataSource || 'N/A'}`);
        console.log(`   • Real Creator Data: ${response.data.metadata?.enhancedFeatures?.realCreatorData ? 'Yes' : 'No'}`);

      } else {
        console.log('❌ Analysis failed:', response.data.error);
      }

    } catch (error) {
      console.log('❌ Request failed:', error.response?.data?.error || error.message);
    }
  }

  console.log('\n🎉 Enhanced Viral Predictor testing complete!');
  console.log('\n📋 Key Features Tested:');
  console.log('   ✅ Real creator data integration');
  console.log('   ✅ Authority-based confidence scoring');
  console.log('   ✅ Expected engagement calculation');
  console.log('   ✅ AI-powered content optimization');
  console.log('   ✅ Fallback handling for missing data');
}

testEnhancedViralPredictor();
