#!/usr/bin/env node
/**
 * Viral Posts Data Collection Script
 * Phase 1.2: Historical Viral Post Analysis
 * 
 * Collects 100+ historically viral crypto posts from multiple sources
 * Extracts engagement metrics, timing patterns, and content characteristics
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration for viral post collection
const CONFIG = {
  // Define "viral" threshold (posts with 10K+ interactions)
  VIRAL_THRESHOLD: 10000,
  
  // Topics to analyze for viral patterns
  CRYPTO_TOPICS: [
    'bitcoin',
    'ethereum', 
    'crypto',
    'blockchain',
    'btc',
    'eth'
  ],
  
  // Time periods to analyze (last 6 months for patterns)
  TIME_PERIODS: [
    '1m',  // Last month
    '3m',  // Last 3 months  
    '6m'   // Last 6 months
  ],
  
  // Minimum data requirements for analysis
  MIN_VIRAL_POSTS: 100,
  MIN_NON_VIRAL_POSTS: 200,
  
  // Output files
  OUTPUT: {
    viral_posts: 'data/raw/viral_posts.json',
    timing_analysis: 'data/analysis/timing_patterns.json',
    engagement_metrics: 'data/analysis/engagement_metrics.json'
  }
};

// Helper function to create directories
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Validation function for collected data
function validatePostData(post) {
  const required = ['id', 'title', 'metrics', 'creator_name', 'topics'];
  return required.every(field => post.hasOwnProperty(field));
}

console.log('🚀 Viral Posts Data Collection Script Initialized');
console.log('📊 Configuration:', CONFIG);
console.log('📁 Preparing output directories...');

module.exports = { CONFIG, ensureDirectoryExists, validatePostData };
