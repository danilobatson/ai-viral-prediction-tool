// Check what's wrong with the test data
const fs = require('fs');
const testFile = 'scripts/testing/test-optimized-prompts.js';

if (fs.existsSync(testFile)) {
  const content = fs.readFileSync(testFile, 'utf8');
  console.log('🔍 Checking test file structure...');
  
  // Look for testCases array
  const testCasesMatch = content.match(/testCases\s*=\s*\[([\s\S]*?)\]/);
  if (testCasesMatch) {
    console.log('📊 Found testCases array, checking first test case...');
    const firstTest = testCasesMatch[1].substring(0, 500);
    console.log(firstTest);
    
    // Check if content field exists
    if (firstTest.includes('"content"') || firstTest.includes("'content'")) {
      console.log('✅ Content field found');
    } else {
      console.log('❌ Content field missing - this is the problem!');
    }
  } else {
    console.log('❌ No testCases array found');
  }
} else {
  console.log('❌ Test file not found');
}
