const fs = require('fs');
const path = require('path');

function findImports(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = [];
  
  // Find ES6 imports
  const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Find require statements
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

console.log('🔍 Checking actual file usage...\n');

// Check main files
const mainFiles = [
  'pages/index.js',
  'pages/_app.js',
  'components/ViralPredictor/index.js',
  'pages/api/predict-viral-ai.js',
  'pages/api/lookup-creator.js'
];

mainFiles.forEach(file => {
  console.log(`📄 ${file}:`);
  const imports = findImports(file);
  imports.forEach(imp => {
    if (imp.startsWith('./') || imp.startsWith('../')) {
      console.log(`   → ${imp}`);
    }
  });
  console.log('');
});

// Check which lib files are actually imported
console.log('📚 Lib files usage:');
const libFiles = fs.readdirSync('lib').filter(f => f.endsWith('.js'));
libFiles.forEach(file => {
  console.log(`   lib/${file}`);
});

console.log('\n📁 API files:');
const apiFiles = fs.readdirSync('pages/api').filter(f => f.endsWith('.js'));
apiFiles.forEach(file => {
  console.log(`   pages/api/${file}`);
});
