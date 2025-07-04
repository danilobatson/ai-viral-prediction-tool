/**
 * API Test Script
 * Tests the viral prediction API endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing AI Viral Prediction API...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: API Documentation
  try {
    console.log('\n2. Testing documentation endpoint...');
    const docsResponse = await axios.get(`${BASE_URL}/docs`);
    console.log('✅ Documentation available:', docsResponse.data.title);
  } catch (error) {
    console.log('❌ Documentation failed:', error.message);
  }

  // Test 3: Viral Prediction
  try {
    console.log('\n3. Testing viral prediction endpoint...');
    const testPost = {
      text: "🚀 Bitcoin just hit $100K! This is the moment we've all been waiting for! #BTC #Crypto #ToTheMoon",
      creator: {
        follower_count: 75000,
        verified: true
      },
      interactions: 5000,
      created_time: new Date().toISOString()
    };

    const predictionResponse = await axios.post(`${BASE_URL}/predict-viral`, {
      postData: testPost
    });

    console.log('✅ Prediction successful:');
    console.log(`   Viral Probability: ${predictionResponse.data.prediction.viralProbability}%`);
    console.log(`   Confidence: ${predictionResponse.data.prediction.confidence}%`);
    console.log(`   Prediction Time: ${predictionResponse.data.metadata.predictionTime}`);

  } catch (error) {
    console.log('❌ Prediction failed:', error.response?.data?.message || error.message);
  }

  console.log('\n🎯 API testing complete!');
}

// Run tests
testAPI();
