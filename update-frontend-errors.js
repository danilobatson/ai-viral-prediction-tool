const fs = require('fs');
const componentFile = 'components/ViralPredictor/index.js';

console.log('🔍 Checking current error handling in frontend...');

if (fs.existsSync(componentFile)) {
  const content = fs.readFileSync(componentFile, 'utf8');
  
  if (content.includes('catch') && content.includes('error')) {
    console.log('✅ Frontend has error handling');
    
    // Check if it shows specific error messages
    if (content.includes('error.message') || content.includes('response.data')) {
      console.log('✅ Frontend shows specific error messages');
    } else {
      console.log('⚠️ Frontend needs better error message display');
    }
  } else {
    console.log('❌ Frontend missing error handling');
  }
} else {
  console.log('❌ Frontend component not found');
}

console.log('\n📝 Frontend should display errors like:');
console.log('- "AI analysis timeout - please try again"');
console.log('- "Content analysis failed - check your input"');  
console.log('- "API configuration error - contact support"');
