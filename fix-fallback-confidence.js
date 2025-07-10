// Fix the fallback confidence range for no creator data
const fs = require('fs');
const apiFile = 'pages/api/predict-viral-ai.js';

fs.readFile(apiFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  // Find and fix the baseConfidence for no creator data
  const updatedData = data.replace(
    /baseConfidence = 20;/g,
    'baseConfidence = 35;'
  );
  
  fs.writeFile(apiFile, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('✅ Fixed fallback confidence for no creator data');
    console.log('📊 Changed base confidence from 20% to 35% for anonymous users');
  });
});
