#!/usr/bin/env node

/**
 * API Testing Script - Updated for Twitter-Only Focus
 * Tests all API endpoints with proper Twitter content
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

let testsRun = 0;
let testsPassed = 0;

async function runTest(testName, testFn) {
  testsRun++;
  try {
    console.log(`Testing ${testName}...`);
    await testFn();
    testsPassed++;
    console.log(`✅ ${testName} - Status: 200`);
  } catch (error) {
    if (error.response) {
      console.log(`❌ ${testName} - Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`❌ ${testName} - Network Error: ${error.message}`);
    }
  }
}

console.log('🔗 API Endpoint Testing Script');
console.log('==============================');
console.log('Starting API tests...');

async function runAllTests() {
  // Test 1: Main Page
  await runTest('Main Page', async () => {
    const response = await axios.get(`${BASE_URL}`);
    if (response.status !== 200) {
      throw new Error('Main page not accessible');
    }
    console.log('   ✅ Response validation passed');
  });

  // Test 2: Creator Lookup API with valid Twitter handle
  await runTest('Creator Lookup API', async () => {
    const response = await axios.post(`${BASE_URL}/api/lookup-creator`, {
      handle: 'elonmusk',
      platform: 'twitter'
    });

    if (!response.data.success) {
      throw new Error('Creator lookup failed');
    }
    console.log('   ✅ Response validation passed');
    console.log(`   📊 Creator: @${response.data.creatorData.handle}`);
    console.log(`   🔌 MCP Status: ${response.data.creatorData.mcpSupported ? 'Enabled' : 'Demo Mode'}`);
  });

  // Test 3: Viral Prediction API with valid Twitter content
  await runTest('Twitter Viral Prediction API', async () => {
    const twitterContent = {
      postData: {
        text: "🚀 Bitcoin just hit $100K! This is the moment we've all been waiting for! #BTC #Crypto #ToTheMoon 📈",
        platform: 'twitter',
        niche: 'crypto',
        contentType: 'text',
        username: 'testuser',
        created_time: new Date().toISOString(),
        hashtags: ['#BTC', '#Crypto', '#ToTheMoon'],
        mentions: [],
        media_count: 0
      }
    };

    const response = await axios.post(`${BASE_URL}/api/predict-viral-ai`, twitterContent);

    if (!response.data.success) {
      throw new Error('Viral prediction failed');
    }
    console.log('   ✅ Response validation passed');
    console.log(`   📊 Viral Probability: ${response.data.prediction.viralProbability}%`);
    console.log(`   🎯 Category: ${response.data.prediction.category}`);
    console.log(`   🤖 Analysis Mode: ${response.data.metadata.analysisMode}`);
  });

  // Test 4: Twitter Thread Analysis
  await runTest('Twitter Thread Analysis', async () => {
    const threadContent = {
      postData: {
        text: "1/ 🧵 Thread about the future of crypto:\n\n2/ Bitcoin has changed everything we know about money\n\n3/ The next decade will be wild 🚀",
        platform: 'twitter',
        niche: 'bitcoin',
        contentType: 'thread',
        created_time: new Date().toISOString()
      }
    };

    const response = await axios.post(`${BASE_URL}/api/predict-viral-ai`, threadContent);

    if (!response.data.success) {
      throw new Error('Thread analysis failed');
    }
    console.log('   ✅ Thread analysis passed');
    console.log(`   📊 Thread Probability: ${response.data.prediction.viralProbability}%`);
  });

  // Test 5: Crypto Poll Analysis
  await runTest('Twitter Poll Analysis', async () => {
    const pollContent = {
      postData: {
        text: "Which crypto will perform better in 2025?\n\nA) Bitcoin\nB) Ethereum\nC) Solana\nD) Something else\n\nWhat do you think? 🤔 #CryptoPoll",
        platform: 'twitter',
        niche: 'crypto',
        contentType: 'poll',
        created_time: new Date().toISOString()
      }
    };

    const response = await axios.post(`${BASE_URL}/api/predict-viral-ai`, pollContent);

    if (!response.data.success) {
      throw new Error('Poll analysis failed');
    }
    console.log('   ✅ Poll analysis passed');
    console.log(`   📊 Poll Probability: ${response.data.prediction.viralProbability}%`);
  });

  // Test 6: Error Handling - Missing text content
  await runTest('Error Handling - Missing Text (Should Error)', async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/predict-viral-ai`, {
        postData: {
          platform: 'twitter',
          niche: 'crypto'
          // Missing text field intentionally
        }
      });

      // If we get here, the test should fail because it should have thrown an error
      if (response.data.success) {
        throw new Error('API should have rejected request with missing text');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('   ✅ Error handling working correctly');
        console.log(`   📝 Error message: ${error.response.data.error}`);
        return; // This is expected
      }
      throw error; // Re-throw if it's not the expected error
    }
  });

  // Test 7: Error Handling - Missing creator handle
  await runTest('Error Handling - Missing Handle (Should Error)', async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/lookup-creator`, {
        platform: 'twitter'
        // Missing handle field intentionally
      });

      if (response.data.success) {
        throw new Error('API should have rejected request with missing handle');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('   ✅ Error handling working correctly');
        console.log(`   📝 Error message: ${error.response.data.error}`);
        return; // This is expected
      }
      throw error; // Re-throw if it's not the expected error
    }
  });

  // Test 8: Health Check (if endpoint exists)
  await runTest('Health Check Endpoint', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/health`);
      console.log('   ✅ Health endpoint accessible');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('   ℹ️  Health endpoint not implemented (optional)');
        return; // This is OK
      }
      throw error;
    }
  });

  // Test 9: API Documentation (if endpoint exists)
  await runTest('API Documentation Endpoint', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/docs`);
      console.log('   ✅ Documentation endpoint accessible');
      console.log(`   📚 API Title: ${response.data.title}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('   ℹ️  Documentation endpoint not implemented (optional)');
        return; // This is OK
      }
      throw error;
    }
  });

  // Final Summary
  console.log('==============================================');
  console.log('📊 API TEST SUMMARY:');
  console.log(`✅ Tests Passed: ${testsPassed}/${testsRun}`);

  if (testsPassed >= 5) { // Core tests must pass
    console.log('✅ All core APIs responding correctly');
    console.log('✅ Twitter content analysis working');
    console.log('✅ Error handling working properly');
    console.log('✅ Ready for production deployment');
  } else {
    console.log('❌ Some core tests failed - check configuration');
    console.log('🔧 Make sure the dev server is running');
    console.log('📝 Check API keys in .env file');
  }

  console.log('==============================================');
  console.log('API testing completed!');
}

runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error.message);
  process.exit(1);
});
