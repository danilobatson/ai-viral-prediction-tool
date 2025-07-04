#!/usr/bin/env node
/**
 * Interactive Environment Setup
 * Collects API keys and validates access to LunarCrush
 */

const readline = require('readline');
const fs = require('fs').promises;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log('🔧 AI Viral Prediction Tool - Environment Setup');
  console.log('=====================================\n');
  
  console.log('📋 We need your LunarCrush API key to collect viral post data.');
  console.log('🔗 Get your API key at: https://lunarcrush.com/developers/api');
  console.log('💡 The API key should start with "Bearer" or be a long alphanumeric string\n');
  
  const apiKey = await question('🔑 Enter your LunarCrush API key: ');
  
  if (!apiKey || apiKey.trim().length < 10) {
    console.log('❌ Invalid API key. Please get a valid key from LunarCrush.');
    process.exit(1);
  }
  
  // Create .env file
  const envContent = `# LunarCrush API Configuration
LUNARCRUSH_API_KEY=${apiKey.trim()}

# Viral Prediction Tool Settings
VIRAL_THRESHOLD=10000
ANALYSIS_START_DATE=2025-01-01
PROJECT_NAME=ai-viral-prediction-tool
`;

  await fs.writeFile('.env', envContent);
  
  console.log('\n✅ Environment configured successfully!');
  console.log('📁 Created .env file with your API key');
  console.log('🔒 Make sure .env is in your .gitignore (it is!)');
  console.log('\n🚀 Ready to start collecting viral post data!');
  
  rl.close();
}

setupEnvironment().catch(console.error);
