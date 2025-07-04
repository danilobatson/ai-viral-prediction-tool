/**
 * Detailed API Response Test
 * Shows complete response structure including LLM indicators
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testDetailedResponse() {
  console.log('🔍 Testing detailed API response structure...\n');

  try {
    const testPost = {
      text: "🚀 Bitcoin just hit $100K! This is the moment we've all been waiting for! #BTC #Crypto #ToTheMoon",
      creator: {
        follower_count: 75000,
        verified: true
      },
      interactions: 5000,
      created_time: new Date().toISOString()
    };

    const response = await axios.post(`${BASE_URL}/predict-viral`, {
      postData: testPost
    });

    console.log('📊 COMPLETE API RESPONSE:');
    console.log(JSON.stringify(response.data, null, 2));

    console.log('\n🔍 LLM STATUS INDICATORS:');
    console.log('enhancedFeatures:', response.data.enhancedFeatures);
    console.log('llmAnalysisEnabled:', response.data.enhancedFeatures?.llmAnalysisEnabled);
    console.log('mlModelAvailable:', response.data.enhancedFeatures?.mlModelAvailable);

    console.log('\n🔍 DETAILED ANALYSIS LLM DATA:');
    console.log('llmAnalysis:', response.data.analysis?.detailedAnalysis?.llmAnalysis);

    console.log('\n🔍 COMPONENT SCORES:');
    console.log('componentScores:', response.data.analysis?.componentScores);

    console.log('\n🎯 METADATA:');
    console.log('metadata:', response.data.metadata);

  } catch (error) {
    console.error('❌ Detailed test failed:', error.response?.data || error.message);
  }
}

testDetailedResponse();
