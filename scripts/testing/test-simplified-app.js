#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AI Viral Prediction Tool - Simplified Version Test');
console.log('====================================================\n');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function test(name, fn) {
  try {
    const result = fn();
    if (result === true) {
      console.log(`✅ ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'PASS', message: 'OK' });
    } else if (result && result.warning) {
      console.log(`⚠️  ${name} - ${result.message}`);
      results.warnings++;
      results.tests.push({ name, status: 'WARNING', message: result.message });
    } else {
      console.log(`❌ ${name} - ${result || 'Failed'}`);
      results.failed++;
      results.tests.push({ name, status: 'FAIL', message: result || 'Failed' });
    }
  } catch (error) {
    console.log(`❌ ${name} - ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'FAIL', message: error.message });
  }
}

// Test 1: Check simplified project structure
test('Simplified project structure', () => {
  const requiredDirs = [
    'components',
    'pages',
    'pages/api'
  ];
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      return `Missing directory: ${dir}`;
    }
  }
  return true;
});

// Test 2: Check required files
test('Core files exist', () => {
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'pages/index.js',
    'pages/api/predict-viral-ai.js',
    'pages/api/lookup-creator.js',
    '.env'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      return `Missing file: ${file}`;
    }
  }
  return true;
});

// Test 3: Check ONLY the 2 core components exist
test('Core components exist (simplified)', () => {
  const requiredComponents = [
    'components/ViralPredictor/index.js',
    'components/CreatorLookup/index.js'
  ];
  
  for (const comp of requiredComponents) {
    if (!fs.existsSync(comp)) {
      return `Missing component: ${comp}`;
    }
  }
  return true;
});

// Test 4: Verify analytics components are removed
test('Analytics components removed', () => {
  const shouldBeRemoved = [
    'components/PredictionHistory',
    'components/AdvancedAnalytics',
    'components/BatchAnalysis',
    'components/HashtagOptimizer',
    'components/TimingOptimizer',
    'components/ContentOptimizer'
  ];
  
  const stillExists = shouldBeRemoved.filter(comp => fs.existsSync(comp));
  if (stillExists.length > 0) {
    return `These components should be removed: ${stillExists.join(', ')}`;
  }
  return true;
});

// Test 5: Check environment variables
test('Environment variables configured', () => {
  if (!fs.existsSync('.env')) {
    return 'No .env file found';
  }
  
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = ['LUNARCRUSH_API_KEY', 'GEMINI_API_KEY'];
  const missing = [];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(varName)) {
      missing.push(varName);
    } else {
      // Check if it has a real value (not placeholder)
      const match = envContent.match(new RegExp(`${varName}=(.+)`));
      if (!match || match[1].includes('your_') || match[1].trim() === '') {
        missing.push(`${varName} (needs real value)`);
      }
    }
  }
  
  if (missing.length > 0) {
    return { warning: true, message: `Environment variables need setup: ${missing.join(', ')}` };
  }
  return true;
});

// Test 6: Check simplified dependencies
test('Simplified dependencies installed', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@chakra-ui/react',
    '@google/generative-ai',
    'next',
    'react',
    'lucide-react'
  ];
  
  const missing = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missing.length > 0) {
    return `Missing dependencies: ${missing.join(', ')}`;
  }
  
  // Check that recharts is NOT installed (since we removed analytics)
  if (packageJson.dependencies['recharts']) {
    return { warning: true, message: 'recharts should be removed (used only for analytics)' };
  }
  
  return true;
});

// Test 7: Check simplified imports in index.js
test('Homepage imports only core components', () => {
  const mainPage = fs.readFileSync('pages/index.js', 'utf8');
  
  // Should have these imports
  const requiredImports = ['ViralPredictor', 'CreatorLookup'];
  const missing = requiredImports.filter(imp => !mainPage.includes(imp));
  if (missing.length > 0) {
    return `Missing required imports: ${missing.join(', ')}`;
  }
  
  // Should NOT have these imports
  const forbiddenImports = [
    'PredictionHistory',
    'AdvancedAnalytics', 
    'BatchAnalysis',
    'HashtagOptimizer',
    'TimingOptimizer',
    'ContentOptimizer'
  ];
  const stillImported = forbiddenImports.filter(imp => mainPage.includes(imp));
  if (stillImported.length > 0) {
    return `Should not import these removed components: ${stillImported.join(', ')}`;
  }
  
  return true;
});

// Test 8: Check API endpoints
test('API endpoints valid', () => {
  const apiFiles = [
    'pages/api/predict-viral-ai.js',
    'pages/api/lookup-creator.js'
  ];
  
  for (const apiFile of apiFiles) {
    if (!fs.existsSync(apiFile)) {
      return `Missing API file: ${apiFile}`;
    }
    
    const content = fs.readFileSync(apiFile, 'utf8');
    if (!content.includes('export default')) {
      return `Invalid API structure in ${apiFile}`;
    }
  }
  return true;
});

// Test 9: Check node_modules
test('Dependencies installed', () => {
  if (!fs.existsSync('node_modules')) {
    return 'node_modules not found - run npm install';
  }
  
  const criticalModules = [
    'node_modules/@chakra-ui',
    'node_modules/@google',
    'node_modules/next',
    'node_modules/react'
  ];
  
  const missing = criticalModules.filter(mod => !fs.existsSync(mod));
  if (missing.length > 0) {
    return `Missing critical modules: ${missing.join(', ')}`;
  }
  return true;
});

// Test 10: Check that tools array has exactly 2 items
test('Homepage shows exactly 2 tools', () => {
  const mainPage = fs.readFileSync('pages/index.js', 'utf8');
  
  // Count tool objects in the tools array
  const toolMatches = mainPage.match(/{\s*id:\s*\d+,/g);
  if (!toolMatches || toolMatches.length !== 2) {
    return `Expected exactly 2 tools, found ${toolMatches ? toolMatches.length : 0}`;
  }
  
  return true;
});

// Print results
console.log('\n📊 Test Results:');
console.log('================');
console.log(`✅ Passed: ${results.passed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📋 Total Tests: ${results.passed + results.warnings + results.failed}`);

if (results.failed === 0) {
  console.log('\n🎉 All critical tests passed! Simplified app ready for testing.');
  if (results.warnings > 0) {
    console.log('⚠️  Some warnings exist but they won\'t prevent functionality.');
  }
} else {
  console.log('\n⚠️  Some tests failed. Review issues above.');
}

// Export results for potential JSON output
if (process.argv.includes('--json')) {
  console.log('\n' + JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      passed: results.passed,
      warnings: results.warnings,
      failed: results.failed,
      total: results.passed + results.warnings + results.failed,
      status: results.failed === 0 ? 'READY' : 'NEEDS FIXES'
    },
    tests: results.tests
  }, null, 2));
}
