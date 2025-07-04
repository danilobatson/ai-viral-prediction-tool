#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 AI Viral Prediction Tool - Functionality Verification Script');
console.log('================================================================\n');

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

// Test 1: Check project structure
test('Project structure exists', () => {
  const requiredDirs = [
    'components',
    'pages',
    'pages/api',
    'scripts',
    'tests'
  ];
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      return `Missing directory: ${dir}`;
    }
  }
  return true;
});

// Test 2: Check required files
test('Required files exist', () => {
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

// Test 3: Check component files
test('All components exist', () => {
  const components = [
    'components/ViralPredictor/index.js',
    'components/CreatorLookup/index.js',
    'components/PredictionHistory/index.js',
    'components/HashtagOptimizer/index.js',
    'components/TimingOptimizer/index.js',
    'components/ContentOptimizer/index.js',
    'components/Analytics/index.js'
  ];
  
  const missing = components.filter(comp => !fs.existsSync(comp));
  if (missing.length > 0) {
    return `Missing components: ${missing.join(', ')}`;
  }
  return true;
});

// Test 4: Check environment variables
test('Environment variables configured', () => {
  if (!fs.existsSync('.env')) {
    return 'No .env file found';
  }
  
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = ['LUNARCRUSH_API_KEY', 'GEMINI_API_KEY'];
  const missing = [];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=your_`) || envContent.includes(`${varName}=`)) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    return { warning: true, message: `Environment variables need setup: ${missing.join(', ')}` };
  }
  return true;
});

// Test 5: Check package.json dependencies
test('Required dependencies installed', () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@chakra-ui/react',
    '@google/generative-ai',
    'next',
    'react',
    'recharts',
    'lucide-react'
  ];
  
  const missing = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missing.length > 0) {
    return `Missing dependencies: ${missing.join(', ')}`;
  }
  return true;
});

// Test 6: Check node_modules
test('Dependencies installed (node_modules)', () => {
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
    return `Missing critical modules: ${missing.join(', ')} - run npm install`;
  }
  return true;
});

// Test 7: Check build process
test('Next.js build check', () => {
  try {
    // Check for syntax errors without full build
    execSync('npx next lint --dir pages --dir components 2>/dev/null', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return 'Lint errors found - check syntax';
  }
});

// Test 8: Check API file structure
test('API endpoints properly structured', () => {
  const apiFiles = [
    'pages/api/predict-viral-ai.js',
    'pages/api/lookup-creator.js'
  ];
  
  for (const apiFile of apiFiles) {
    if (!fs.existsSync(apiFile)) {
      return `Missing API file: ${apiFile}`;
    }
    
    const content = fs.readFileSync(apiFile, 'utf8');
    if (!content.includes('export default') && !content.includes('export async function')) {
      return `Invalid API structure in ${apiFile}`;
    }
  }
  return true;
});

// Test 9: Check component imports
test('Component imports valid', () => {
  const mainPage = fs.readFileSync('pages/index.js', 'utf8');
  const requiredImports = [
    'ViralPredictor',
    'CreatorLookup',
    'PredictionHistory',
    'HashtagOptimizer',
    'TimingOptimizer',
    'ContentOptimizer'
  ];
  
  const missing = requiredImports.filter(imp => !mainPage.includes(imp));
  if (missing.length > 0) {
    return `Missing imports in index.js: ${missing.join(', ')}`;
  }
  return true;
});

// Test 10: Check for syntax errors in components
test('Component syntax validation', () => {
  const components = [
    'components/ViralPredictor/index.js',
    'components/CreatorLookup/index.js',
    'components/PredictionHistory/index.js',
    'components/HashtagOptimizer/index.js',
    'components/TimingOptimizer/index.js',
    'components/ContentOptimizer/index.js'
  ];
  
  for (const comp of components) {
    if (fs.existsSync(comp)) {
      const content = fs.readFileSync(comp, 'utf8');
      
      // Check for common syntax issues
      if (!content.includes('export default')) {
        return `${comp} missing default export`;
      }
      
      // Check for unmatched brackets (basic)
      const openBrackets = (content.match(/{/g) || []).length;
      const closeBrackets = (content.match(/}/g) || []).length;
      if (Math.abs(openBrackets - closeBrackets) > 2) {
        return `${comp} may have bracket mismatch`;
      }
    }
  }
  return true;
});

// Test 11: Check Git repository
test('Git repository initialized', () => {
  if (!fs.existsSync('.git')) {
    return { warning: true, message: 'No git repository found' };
  }
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      return { warning: true, message: 'Uncommitted changes found' };
    }
  } catch (error) {
    return { warning: true, message: 'Git status check failed' };
  }
  return true;
});

console.log('\n📊 TEST RESULTS SUMMARY');
console.log('======================');
console.log(`✅ Passed: ${results.passed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📋 Total Tests: ${results.tests.length}\n`);

if (results.failed > 0) {
  console.log('❌ CRITICAL ISSUES FOUND:');
  results.tests
    .filter(t => t.status === 'FAIL')
    .forEach(t => console.log(`   • ${t.name}: ${t.message}`));
  console.log();
}

if (results.warnings > 0) {
  console.log('⚠️  WARNINGS:');
  results.tests
    .filter(t => t.status === 'WARNING')
    .forEach(t => console.log(`   • ${t.name}: ${t.message}`));
  console.log();
}

const overallStatus = results.failed === 0 ? 'READY' : 'NEEDS FIXES';
const statusEmoji = results.failed === 0 ? '🎉' : '🔧';

console.log(`${statusEmoji} OVERALL STATUS: ${overallStatus}`);

if (results.failed === 0) {
  console.log('🚀 All critical tests passed! Ready for Phase 3.3');
} else {
  console.log('⚠️  Fix the failed tests before proceeding to Phase 3.3');
}

// Write detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    passed: results.passed,
    warnings: results.warnings,
    failed: results.failed,
    total: results.tests.length,
    status: overallStatus
  },
  tests: results.tests
};

fs.writeFileSync('scripts/testing/test-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Detailed report saved to: scripts/testing/test-report.json');
