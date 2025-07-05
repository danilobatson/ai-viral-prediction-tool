#!/usr/bin/env node

/**
 * Fixed Comprehensive Edge Case Testing Suite
 * Auto-detects correct port and fixes connection issues
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Try multiple common ports
const POSSIBLE_PORTS = [3000, 3001, 3002];
let BASE_URL = null;

const RESULTS_DIR = 'scripts/testing/edge-cases/results';

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
  startTime: new Date().toISOString(),
  endTime: null,
  serverPort: null
};

// Console colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Auto-detect which port the server is running on
async function detectServerPort() {
  log('blue', '🔍 Detecting server port...');
  
  for (const port of POSSIBLE_PORTS) {
    try {
      const testUrl = `http://localhost:${port}`;
      const response = await axios.get(testUrl, { timeout: 2000 });
      
      if (response.status === 200) {
        log('green', `✅ Found server running on port ${port}`);
        BASE_URL = testUrl;
        results.serverPort = port;
        return true;
      }
    } catch (error) {
      // Continue trying other ports
      log('yellow', `⚪ Port ${port}: ${error.code || 'Not responding'}`);
    }
  }
  
  return false;
}

function test(name, testFunction) {
  return new Promise(async (resolve) => {
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      if (result === true) {
        log('green', `✅ ${name} (${duration}ms)`);
        results.passed++;
        results.tests.push({ 
          name, 
          status: 'PASS', 
          message: 'OK', 
          duration 
        });
      } else if (result && result.warning) {
        log('yellow', `⚠️  ${name} - ${result.message} (${duration}ms)`);
        results.warnings++;
        results.tests.push({ 
          name, 
          status: 'WARNING', 
          message: result.message, 
          duration 
        });
      } else {
        log('red', `❌ ${name} - ${result || 'Failed'} (${duration}ms)`);
        results.failed++;
        results.tests.push({ 
          name, 
          status: 'FAIL', 
          message: result || 'Failed', 
          duration 
        });
      }
    } catch (error) {
      log('red', `❌ ${name} - ${error.message}`);
      results.failed++;
      results.tests.push({ 
        name, 
        status: 'FAIL', 
        message: error.message, 
        duration: 0 
      });
    }
    resolve();
  });
}

async function apiCall(endpoint, data, expectedStatus = 200) {
  try {
    const response = await axios.post(`${BASE_URL}/api/${endpoint}`, data, {
      timeout: 10000,
      validateStatus: () => true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return {
      status: response.status,
      data: response.data,
      success: response.status === expectedStatus
    };
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return {
        status: 0,
        data: { error: 'Server not running' },
        success: false,
        error: `Connection refused to ${BASE_URL}`
      };
    }
    return {
      status: error.response?.status || 0,
      data: error.response?.data || { error: error.message },
      success: false,
      error: error.message
    };
  }
}

// Fixed Edge Case Test Definitions
const EDGE_CASE_TESTS = {
  
  // Input Validation Tests (expecting 400 errors)
  'Empty Post Text': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { text: '' }
    }, 400);
    return response.success && response.data.error?.includes('text');
  },

  'Null Post Data': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: null
    }, 400);
    return response.success && response.data.error?.includes('postData');
  },

  'Missing Post Data': async () => {
    const response = await apiCall('predict-viral-ai', {}, 400);
    return response.success && response.data.error?.includes('postData');
  },

  // Content Edge Cases (expecting 200 success)
  'Valid Basic Post': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'This is a valid test post for the viral prediction API',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    
    if (response.status !== 200) {
      return `Expected 200, got ${response.status}: ${JSON.stringify(response.data)}`;
    }
    
    if (!response.data.success) {
      return `API returned success: false - ${response.data.error}`;
    }
    
    return true;
  },

  'Single Character Post': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'A',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    return response.status === 200 && response.data.success;
  },

  'Only Emojis Post': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: '🚀🔥💎🌙🎯',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    return response.status === 200 && response.data.success;
  },

  'Special Characters Post': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    return response.status === 200 && response.data.success;
  },

  'Unicode Characters Post': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: '这是一个测试 ��🇳 Тест на русском 🇷🇺',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    return response.status === 200 && response.data.success;
  },

  'HTML/Script Injection Attempt': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: '<script>alert("xss")</script>',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    return response.status === 200 && response.data.success;
  },

  // Creator Data Edge Cases
  'Valid Post with Creator Data': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'Test post with creator data',
        platform: 'twitter',
        niche: 'crypto'
      },
      creatorData: {
        followers: 10000,
        engagementRate: 5.0,
        verified: true
      }
    });
    return response.status === 200 && response.data.success;
  },

  'Negative Follower Count': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'Test post with negative followers',
        platform: 'twitter',
        niche: 'crypto'
      },
      creatorData: {
        followers: -1000,
        engagementRate: 5.0
      }
    });
    return response.status === 200 && response.data.success;
  },

  // Platform Edge Cases
  'Unsupported Platform': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'Test post on unsupported platform',
        platform: 'myspace',
        niche: 'crypto'
      }
    });
    return response.status === 200 && response.data.success;
  },

  'Missing Platform (Default Fallback)': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'Test post without platform specified',
        niche: 'crypto'
      }
    });
    return response.status === 200 && response.data.success;
  },

  // Response Structure Validation
  'Response Structure Validation': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'Test for response structure validation',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    
    if (response.status !== 200) return `API call failed with status ${response.status}`;
    if (!response.data.success) return `API returned success: false - ${response.data.error}`;
    
    const required = ['success', 'viralProbability', 'confidence', 'category'];
    const missing = required.filter(field => !(field in response.data));
    
    return missing.length === 0 ? true : `Missing required fields: ${missing.join(', ')}`;
  },

  'Numeric Range Validation': async () => {
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'Test for numeric range validation with hashtags #crypto #bitcoin',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    
    if (response.status !== 200) return `API call failed with status ${response.status}`;
    if (!response.data.success) return `API returned success: false - ${response.data.error}`;
    
    const { viralProbability, confidence } = response.data;
    
    const validRanges = 
      viralProbability >= 0 && viralProbability <= 100 &&
      confidence >= 0 && confidence <= 100;
    
    return validRanges ? true : 
           `Invalid ranges: viral=${viralProbability}, confidence=${confidence}`;
  },

  // Performance Test
  'Single Request Performance': async () => {
    const startTime = Date.now();
    const response = await apiCall('predict-viral-ai', {
      postData: { 
        text: 'Performance test for response time measurement',
        platform: 'twitter',
        niche: 'crypto'
      }
    });
    const duration = Date.now() - startTime;
    
    if (response.status !== 200) return `API failed with status ${response.status}`;
    if (!response.data.success) return `API returned success: false - ${response.data.error}`;
    
    return duration < 10000 ? true : `Response took ${duration}ms (too slow)`;
  }
};

// Run all tests
async function runAllTests() {
  log('cyan', '🧪 Starting Fixed Comprehensive Edge Case Testing Suite');
  log('cyan', '='.repeat(60));
  
  // First detect server port
  const serverFound = await detectServerPort();
  if (!serverFound) {
    log('red', '❌ No server found running on any common port (3000, 3001, 3002)');
    log('yellow', '💡 Please start the server with: npm run dev');
    log('yellow', '   Then run this test again');
    process.exit(1);
  }
  
  log('green', `✅ Server detected on ${BASE_URL}, proceeding with tests...\n`);
  
  const testNames = Object.keys(EDGE_CASE_TESTS);
  
  for (let i = 0; i < testNames.length; i++) {
    const testName = testNames[i];
    const testFunction = EDGE_CASE_TESTS[testName];
    
    log('white', `[${i + 1}/${testNames.length}] Testing: ${testName}`);
    await test(testName, testFunction);
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Generate final report
  results.endTime = new Date().toISOString();
  
  log('cyan', '\n' + '='.repeat(60));
  log('cyan', '📊 FIXED EDGE CASE TEST RESULTS SUMMARY');
  log('cyan', '='.repeat(60));
  
  log('green', `✅ Passed: ${results.passed}`);
  log('yellow', `⚠️  Warnings: ${results.warnings}`);
  log('red', `❌ Failed: ${results.failed}`);
  log('white', `📋 Total Tests: ${results.tests.length}`);
  log('white', `🌐 Server Port: ${results.serverPort}`);
  
  const totalDuration = results.tests.reduce((sum, test) => sum + test.duration, 0);
  log('white', `⏱️  Total Duration: ${totalDuration}ms`);
  
  // Write detailed results
  const reportPath = path.join(RESULTS_DIR, `fixed-edge-case-report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  log('white', `\n📄 Detailed report saved to: ${reportPath}`);
  
  if (results.failed > 0) {
    log('red', '\n❌ REMAINING EDGE CASE ISSUES:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => log('red', `   • ${t.name}: ${t.message}`));
  }
  
  const successRate = Math.round((results.passed / results.tests.length) * 100);
  const overallStatus = results.failed === 0 ? 'PRODUCTION READY' : 
                       successRate >= 80 ? 'MOSTLY READY' : 'NEEDS FIXES';
  const statusEmoji = results.failed === 0 ? '🎉' : successRate >= 80 ? '⚠️' : '🔧';
  
  log('white', `\n${statusEmoji} OVERALL STATUS: ${overallStatus} (${successRate}% success rate)`);
  
  if (results.failed === 0) {
    log('green', '🚀 All edge cases handled properly! Ready for production deployment.');
  } else if (successRate >= 80) {
    log('yellow', '⚠️  Most edge cases handled well. Minor issues remain.');
  } else {
    log('red', '🔧 Significant edge cases need attention before production.');
  }
  
  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(error => {
    log('red', `Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runAllTests, EDGE_CASE_TESTS };
