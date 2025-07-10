const fs = require('fs');
const path = require('path');

function cleanupFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Remove debug console.logs (keep error and important ones)
  content = content.replace(/^\s*console\.log\(['"`]🔍.*?\);?\s*$/gm, '');
  content = content.replace(/^\s*console\.log\(['"`]📋.*?\);?\s*$/gm, '');
  content = content.replace(/^\s*console\.log\(['"`]🚀.*?\);?\s*$/gm, '');
  content = content.replace(/^\s*console\.log\(['"`]✅.*?\);?\s*$/gm, '');
  content = content.replace(/^\s*console\.log\(['"`]🤖.*?\);?\s*$/gm, '');
  content = content.replace(/^\s*console\.log\(['"`]📊.*?\);?\s*$/gm, '');
  
  // Remove empty lines left by removed console.logs
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Cleaned up ${filePath}`);
  } else {
    console.log(`📄 No changes needed in ${filePath}`);
  }
}

// Clean up specific files
const filesToClean = [
  'pages/api/predict-viral-ai.js',
  'pages/api/lookup-creator.js',
  'components/ViralPredictor/index.js',
  'lib/mcp-client.js'
];

console.log('🧹 Starting console log cleanup...');
filesToClean.forEach(cleanupFile);
console.log('🧹 Console log cleanup complete');
