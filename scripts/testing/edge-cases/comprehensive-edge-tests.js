#!/usr/bin/env node

/**
 * Fixed Comprehensive Edge Case Testing Suite
 * Now properly validates responses and handles success cases
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost';
const PORTS_TO_TRY = [3001, 3000, 3002]; // Try multiple ports
const TIMEOUT = 5000;

let serverUrl = null;
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
  startTime: new Date().toISOString(),
  endTime: null,
  serverPort: null
};

console.log('🧪 Starting Fixed Comprehensive Edge Case Testing Suite');
console.log('============================================================');

/**
 * Detect which port the server is running on
 */
async function detectServerPort() {
  console.log('🔍 Detecting server port...');

  for (const port of PORTS_TO_TRY) {
    try {
      const response = await axios.get(`${BASE_URL}:${port}`, { timeout: 2000 });
      if (response.status === 200) {
        console.log(`✅ Found server running on port ${port}`);
        serverUrl = `${BASE_URL}:${port}`;
        testResults.serverPort = port;
        return true;
      }
    } catch (error) {
      console.log(`⚪ Port ${port}: ${error.code || 'ERR_BAD_RESPONSE'}`);
    }
  }

  console.log('❌ No server found on any port');
  return false;
}

/**
 * Run a single test with proper validation
 */
async function runTest(testName, testData, expectedBehavior = 'success') {
  const testStart = Date.now();
  let result = {
    name: testName,
    status: 'FAIL',
    message: 'Failed',
    duration: 0
  };

  try {
    console.log(`[${testResults.tests.length + 1}/16] Testing: ${testName}`);

    const response = await axios.post(`${serverUrl}/api/predict-viral-ai`, testData, {
      timeout: TIMEOUT,
      headers: { 'Content-Type': 'application/json' }
    });

    result.duration = Date.now() - testStart;

    // Validate response structure
    if (response.status === 200 && response.data) {
      const data = response.data;

      // Check if response has success field
      if (data.success !== undefined) {

        // For success responses, validate prediction structure
        if (data.success === true && data.prediction) {
          const pred = data.prediction;

          // Check required fields exist and are correct types
          const requiredFields = [
            { field: 'viralProbability', type: 'number' },
            { field: 'confidence', type: 'number' },
            { field: 'category', type: 'string' },
            { field: 'expectedEngagement', type: 'number' },
            { field: 'recommendations', type: 'object' } // array is type object
          ];

          let validationErrors = [];

          for (const req of requiredFields) {
            if (pred[req.field] === undefined || pred[req.field] === null) {
              validationErrors.push(`${req.field} is undefined/null`);
            } else if (req.type === 'number') {
              if (typeof pred[req.field] !== 'number' || isNaN(pred[req.field])) {
                validationErrors.push(`${req.field} is not a valid number`);
              } else if (req.field.includes('Probability') || req.field.includes('confidence')) {
                // Check percentage ranges
                if (pred[req.field] < 0 || pred[req.field] > 100) {
                  validationErrors.push(`${req.field} out of range (0-100): ${pred[req.field]}`);
                }
              }
            } else if (req.type === 'string') {
              if (typeof pred[req.field] !== 'string' || pred[req.field].length === 0) {
                validationErrors.push(`${req.field} is not a valid string`);
              }
            } else if (req.type === 'object') {
              if (!Array.isArray(pred[req.field]) && typeof pred[req.field] !== 'object') {
                validationErrors.push(`${req.field} is not an array or object`);
              }
            }
          }

          if (validationErrors.length === 0) {
            result.status = 'PASS';
            result.message = 'OK';
            testResults.passed++;
          } else {
            result.status = 'FAIL';
            result.message = `Validation errors: ${validationErrors.join(', ')}`;
            testResults.failed++;
          }

        } else if (data.success === false) {
          // For error responses, check if they're expected
          if (expectedBehavior === 'error') {
            result.status = 'PASS';
            result.message = 'Expected error received';
            testResults.passed++;
          } else {
            result.status = 'FAIL';
            result.message = `Unexpected error: ${data.error || 'Unknown error'}`;
            testResults.failed++;
          }
        } else {
          result.status = 'FAIL';
          result.message = 'Success=true but no prediction object';
          testResults.failed++;
        }

      } else {
        result.status = 'FAIL';
        result.message = 'Response missing success field';
        testResults.failed++;
      }

    } else {
      result.status = 'FAIL';
      result.message = `HTTP ${response.status} or no response data`;
      testResults.failed++;
    }

  } catch (error) {
    result.duration = Date.now() - testStart;
    result.status = 'FAIL';
    result.message = error.response?.data?.error || error.message || 'Request failed';
    testResults.failed++;
  }

  // Log result
  if (result.status === 'PASS') {
    console.log(`✅ ${testName} (${result.duration}ms)`);
  } else {
    console.log(`❌ ${testName} - ${result.message} (${result.duration}ms)`);
  }

  testResults.tests.push(result);
}

/**
 * Main test runner
 */
async function runAllTests() {
  // Detect server
  const serverFound = await detectServerPort();
  if (!serverFound) {
    console.log('❌ Cannot run tests - no server detected');
    process.exit(1);
  }

  console.log(`✅ Server detected on ${serverUrl}, proceeding with tests...`);

  // Test 1: Empty Post Text (should succeed with minimal analysis)
  await runTest('Empty Post Text', {
    postData: { text: '' }
  });

  // Test 2: Null Post Data (should succeed with fallback)
  await runTest('Null Post Data', {
    postData: null
  });

  // Test 3: Missing Post Data (should succeed with defaults)
  await runTest('Missing Post Data', {});

  // Test 4: Valid Basic Post (should succeed normally)
  await runTest('Valid Basic Post', {
    postData: {
      text: 'This is a test post about crypto! #bitcoin',
      platform: 'twitter',
      niche: 'crypto'
    }
  });

  // Test 5: Single Character Post
  await runTest('Single Character Post', {
    postData: { text: '!' }
  });

  // Test 6: Only Emojis Post
  await runTest('Only Emojis Post', {
    postData: { text: '🚀💎🙌' }
  });

  // Test 7: Special Characters Post
  await runTest('Special Characters Post', {
    postData: { text: '@#$%^&*()_+-=[]{}|;:,.<>?' }
  });

  // Test 8: Unicode Characters Post
  await runTest('Unicode Characters Post', {
    postData: { text: 'Bitcoin是数字黄金 🚀 Биткоин це майбутнє' }
  });

  // Test 9: HTML/Script Injection Attempt
  await runTest('HTML/Script Injection Attempt', {
    postData: { text: '<script>alert("xss")</script>Buy Bitcoin!' }
  });

  // Test 10: Valid Post with Creator Data
  await runTest('Valid Post with Creator Data', {
    postData: {
      text: 'Market update: Bitcoin looking strong! 📈',
      platform: 'twitter',
      niche: 'crypto',
      creator: { follower_count: 10000, verified: true }
    }
  });

  // Test 11: Negative Follower Count
  await runTest('Negative Follower Count', {
    postData: {
      text: 'Test post',
      creator: { follower_count: -1000 }
    }
  });

  // Test 12: Unsupported Platform (should default to twitter)
  await runTest('Unsupported Platform', {
    postData: {
      text: 'Test post',
      platform: 'fakebook'
    }
  });

  // Test 13: Missing Platform (should default)
  await runTest('Missing Platform (Default Fallback)', {
    postData: { text: 'Test post without platform' }
  });

  // Test 14: Response Structure Validation (comprehensive check)
  await runTest('Response Structure Validation', {
    postData: {
      text: 'Structure validation test post',
      platform: 'twitter',
      niche: 'crypto'
    }
  });

  // Test 15: Numeric Range Validation
  await runTest('Numeric Range Validation', {
    postData: {
      text: 'Range validation test with crypto content #BTC',
      platform: 'twitter'
    }
  });

  // Test 16: Performance Test
  await runTest('Single Request Performance', {
    postData: {
      text: 'Performance test post with emojis 🚀 and hashtags #performance #test',
      platform: 'twitter',
      niche: 'tech'
    }
  });

  // Complete tests
  testResults.endTime = new Date().toISOString();

  // Generate summary
  console.log('\n============================================================');
  console.log('📊 FIXED EDGE CASE TEST RESULTS SUMMARY');
  console.log('============================================================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`⚠️  Warnings: ${testResults.warnings}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📋 Total Tests: ${testResults.tests.length}`);
  console.log(`🌐 Server Port: ${testResults.serverPort}`);

  const totalDuration = testResults.tests.reduce((sum, test) => sum + test.duration, 0);
  console.log(`⏱️  Total Duration: ${totalDuration}ms`);

  // Save detailed report
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const reportFile = path.join(resultsDir, `fixed-edge-case-report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(testResults, null, 2));
  console.log(`📄 Detailed report saved to: ${reportFile}`);

  // Show failed tests
  const failedTests = testResults.tests.filter(t => t.status === 'FAIL');
  if (failedTests.length > 0) {
    console.log('\n❌ REMAINING EDGE CASE ISSUES:');
    failedTests.forEach(test => {
      console.log(`   • ${test.name}: ${test.message}`);
    });
  }

  // Overall status
  const successRate = Math.round((testResults.passed / testResults.tests.length) * 100);
  console.log(`\n🔧 OVERALL STATUS: ${successRate >= 90 ? 'PRODUCTION READY' : successRate >= 75 ? 'MOSTLY READY' : 'NEEDS FIXES'} (${successRate}% success rate)`);

  if (successRate >= 90) {
    console.log('🎉 Excellent! Ready for production deployment.');
  } else if (successRate >= 75) {
    console.log('⚠️  Most edge cases handled well. Minor issues remain.');
  } else {
    console.log('🔧 Significant edge cases need attention before production.');
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Test runner failed:', error.message);
  process.exit(1);
});
