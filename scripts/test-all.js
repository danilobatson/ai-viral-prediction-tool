#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Complete Testing Suite - AI Viral Prediction Tool');
console.log('=====================================================\n');

function runCommand(command, description) {
  console.log(`📋 ${description}`);
  console.log(`Running: ${command}\n`);
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed`);
    console.log(`Error: ${error.message}\n`);
    return false;
  }
}

async function runFullTestSuite() {
  console.log('Starting comprehensive test suite...\n');
  
  const tests = [
    {
      command: 'node scripts/testing/verify-functionality.js',
      description: 'Functionality Verification'
    },
    {
      command: 'npm run lint --silent',
      description: 'Code Linting'
    },
    {
      command: 'npm run build',
      description: 'Production Build Test'
    }
  ];

  let passedTests = 0;
  
  for (const test of tests) {
    const passed = runCommand(test.command, test.description);
    if (passed) passedTests++;
  }
  
  console.log('==============================================');
  console.log(`📊 Test Suite Results: ${passedTests}/${tests.length} passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 ALL TESTS PASSED! Ready for Phase 3.3');
    
    // Generate final readiness report
    const report = {
      timestamp: new Date().toISOString(),
      status: 'READY',
      testsRun: tests.length,
      testsPassed: passedTests,
      phase: '3.3 Ready',
      nextSteps: [
        'Deploy to production',
        'Create viral article',
        'Implement batch analysis tool',
        'Add premium features'
      ]
    };
    
    fs.writeFileSync('PHASE_3_3_READINESS.json', JSON.stringify(report, null, 2));
    console.log('📄 Readiness report saved to: PHASE_3_3_READINESS.json');
    
  } else {
    console.log('⚠️  Some tests failed. Fix issues before Phase 3.3');
  }
}

runFullTestSuite().catch(console.error);
