const fs = require('fs');
const path = require('path');

console.log('🔍 Production Readiness Check');
console.log('==============================\n');

// Check for debug files
const debugFiles = [
  'debug-mcp-tools.mjs',
  'update-frontend-errors.js',
  'temp-*.js',
  'test-*.js'
];

console.log('📁 Checking for debug/temp files...');
debugFiles.forEach(pattern => {
  if (pattern.includes('*')) {
    // Skip glob patterns for now
    return;
  }
  if (fs.existsSync(pattern)) {
    console.log(`   ❌ Found debug file: ${pattern}`);
  } else {
    console.log(`   ✅ Clean: ${pattern}`);
  }
});

// Check package.json for development dependencies
console.log('\n📦 Checking package.json...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log(`   📄 Name: ${packageJson.name}`);
  console.log(`   🔢 Version: ${packageJson.version}`);
  console.log(`   📦 Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`   🔧 DevDependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  
  // Check for unnecessary dev dependencies in production
  const prodUnnecessary = ['nodemon', 'concurrently', 'jest'];
  const deps = Object.keys(packageJson.dependencies || {});
  const hasUnnecessary = prodUnnecessary.some(dep => deps.includes(dep));
  
  if (hasUnnecessary) {
    console.log('   ⚠️ Some dev dependencies might be in production dependencies');
  } else {
    console.log('   ✅ Dependencies look clean');
  }
}

// Check .env.example exists
console.log('\n🔐 Environment configuration...');
if (fs.existsSync('.env.example')) {
  console.log('   ✅ .env.example exists');
} else {
  console.log('   ❌ Missing .env.example file');
}

if (fs.existsSync('.env')) {
  console.log('   ⚠️ .env file exists (should not be committed)');
} else {
  console.log('   ✅ No .env file in repo');
}

// Check for console.log statements in production files
console.log('\n🐛 Debug statements check...');
const prodFiles = [
  'pages/api/predict-viral-ai.js',
  'pages/api/lookup-creator.js',
  'components/ViralPredictor/index.js'
];

prodFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const consoleCount = (content.match(/console\.log/g) || []).length;
    const errorCount = (content.match(/console\.error/g) || []).length;
    
    console.log(`   📄 ${file}:`);
    console.log(`      🐛 console.log: ${consoleCount}`);
    console.log(`      ❌ console.error: ${errorCount} (acceptable)`);
  }
});

console.log('\n🏁 Production readiness summary:');
console.log('- Remove any remaining debug files');
console.log('- Minimize console.log statements');
console.log('- Ensure .env.example is complete');
console.log('- Test production build with: npm run build');
