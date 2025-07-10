const fs = require('fs');

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`\n📁 ${filePath}:`);
  
  // Check for imports
  const imports = lines.filter(line => line.trim().startsWith('import'));
  console.log(`   📦 Imports: ${imports.length}`);
  
  // Check for unused React hooks
  const hasUseState = content.includes('useState(');
  const hasUseEffect = content.includes('useEffect(');
  const hasUseCallback = content.includes('useCallback(');
  const hasUseMemo = content.includes('useMemo(');
  
  if (content.includes('useState') && !hasUseState) {
    console.log('   ⚠️ Potentially unused useState import');
  }
  if (content.includes('useEffect') && !hasUseEffect) {
    console.log('   ⚠️ Potentially unused useEffect import');
  }
  if (content.includes('useCallback') && !hasUseCallback) {
    console.log('   ⚠️ Potentially unused useCallback import');
  }
  if (content.includes('useMemo') && !hasUseMemo) {
    console.log('   ⚠️ Potentially unused useMemo import');
  }
  
  // Count console.log statements
  const consoleLogs = (content.match(/console\.log/g) || []).length;
  if (consoleLogs > 0) {
    console.log(`   🐛 Console.log statements: ${consoleLogs}`);
  }
}

// Check main files
const filesToCheck = [
  'components/ViralPredictor/index.js',
  'pages/api/predict-viral-ai.js',
  'pages/api/lookup-creator.js',
  'lib/mcp-client.js'
];

console.log('🔍 Checking for unused imports and debug statements...');
filesToCheck.forEach(checkFile);
