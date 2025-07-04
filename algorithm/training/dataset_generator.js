/**
 * Dataset Generator for ML Training
 * Generates training data from existing viral prediction components
 * Target: 90%+ accuracy through supervised learning
 */

const ViralPredictor = require('../viral_predictor');
const fs = require('fs');
const path = require('path');

class DatasetGenerator {
  constructor() {
    this.viralPredictor = new ViralPredictor();
    this.trainingData = [];
    this.testData = [];
    
    // Feature labels for ML model
    this.featureLabels = [
      'engagement_velocity',
      'momentum_velocity', 
      'creator_authority',
      'follower_count_normalized',
      'content_score',
      'viral_formula_score',
      'timing_multiplier',
      'emotional_intensity',
      'specificity_score',
      'early_detection_score',
      'post_age_hours',
      'interaction_count_normalized'
    ];
  }

  /**
   * Generate training dataset from historical data
   */
  async generateTrainingData() {
    console.log('🔄 Generating training dataset...');
    
    // Simulate historical viral posts (normally from LunarCrush API)
    const viralPosts = this.generateViralPostData();
    const nonViralPosts = this.generateNonViralPostData();
    
    // Process viral posts
    for (const post of viralPosts) {
      const features = this.extractFeaturesFromPost(post);
      this.trainingData.push({
        features,
        label: 1, // Viral
        probability: post.viral_probability || 0.8
      });
    }
    
    // Process non-viral posts
    for (const post of nonViralPosts) {
      const features = this.extractFeaturesFromPost(post);
      this.trainingData.push({
        features,
        label: 0, // Non-viral
        probability: post.viral_probability || 0.2
      });
    }
    
    // Split into training and test sets (80/20)
    this.splitTrainingData();
    
    console.log(`✅ Generated ${this.trainingData.length} training samples`);
    console.log(`✅ Generated ${this.testData.length} test samples`);
    
    return {
      training: this.trainingData,
      test: this.testData,
      features: this.featureLabels
    };
  }

  /**
   * Extract ML features from post data
   */
  extractFeaturesFromPost(post) {
    const prediction = this.viralPredictor.predictViral(post);
    
    const features = [
      prediction.componentScores.velocityScore / 100,
      prediction.detailedAnalysis.engagement.momentum || 0,
      prediction.componentScores.authorityScore,
      Math.min(post.creator.follower_count / 100000, 1), // Normalize to 0-1
      prediction.componentScores.contentScore,
      prediction.detailedAnalysis.content.viralFormulaScore,
      prediction.componentScores.timingScore,
      prediction.detailedAnalysis.content.emotionalIntensity,
      prediction.detailedAnalysis.content.specificityScore,
      prediction.detailedAnalysis.engagement.earlyDetection || 0,
      this.getPostAgeHours(post.created_time) / 24, // Normalize to days
      Math.min(post.interactions / 10000, 1) // Normalize interactions
    ];
    
    return features;
  }

  /**
   * Generate synthetic viral post data for training
   */
  generateViralPostData() {
    const viralPosts = [];
    
    // High-performing viral posts
    for (let i = 0; i < 150; i++) {
      viralPosts.push({
        text: this.generateViralText(),
        creator: {
          follower_count: 50000 + Math.random() * 50000, // Optimal range
          verified: Math.random() > 0.3
        },
        interactions: 10000 + Math.random() * 50000,
        created_time: this.generateOptimalTime(),
        current_time: new Date().toISOString(),
        hashtags: ['#crypto', '#bitcoin', '#trading'],
        mentions: [],
        media_count: Math.floor(Math.random() * 3),
        viral_probability: 0.7 + Math.random() * 0.3
      });
    }
    
    return viralPosts;
  }

  /**
   * Generate synthetic non-viral post data
   */
  generateNonViralPostData() {
    const nonViralPosts = [];
    
    // Low-performing posts
    for (let i = 0; i < 200; i++) {
      nonViralPosts.push({
        text: this.generateNonViralText(),
        creator: {
          follower_count: Math.random() * 10000, // Lower follower count
          verified: Math.random() > 0.8
        },
        interactions: Math.random() * 1000,
        created_time: this.generatePoorTime(),
        current_time: new Date().toISOString(),
        hashtags: ['#crypto'],
        mentions: [],
        media_count: 0,
        viral_probability: Math.random() * 0.3
      });
    }
    
    return nonViralPosts;
  }

  /**
   * Generate viral text patterns
   */
  generateViralText() {
    const viralPatterns = [
      "🚀 Just made $50,000 in 24 hours! Here's exactly how...",
      "📊 This crypto will 100x in 2025. Here's why...",
      "⚡ Breaking: Major announcement will change everything!",
      "🔥 I predicted this 6 months ago. Here's my next call...",
      "💰 Turned $1,000 into $25,000 using this strategy..."
    ];
    
    return viralPatterns[Math.floor(Math.random() * viralPatterns.length)];
  }

  /**
   * Generate non-viral text patterns
   */
  generateNonViralText() {
    const nonViralPatterns = [
      "Good morning crypto world",
      "What do you think about the market today?",
      "Just bought some bitcoin",
      "Crypto is interesting",
      "Having a good day trading"
    ];
    
    return nonViralPatterns[Math.floor(Math.random() * nonViralPatterns.length)];
  }

  /**
   * Generate optimal posting time
   */
  generateOptimalTime() {
    const days = ['Tuesday', 'Wednesday', 'Thursday'];
    const hours = [12, 13, 14, 15, 16]; // UTC
    
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    
    const date = new Date();
    date.setUTCHours(randomHour, 0, 0, 0);
    
    return date.toISOString();
  }

  /**
   * Generate poor posting time
   */
  generatePoorTime() {
    const days = ['Friday', 'Saturday', 'Sunday'];
    const hours = [2, 3, 4, 5, 22, 23]; // UTC
    
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    
    const date = new Date();
    date.setUTCHours(randomHour, 0, 0, 0);
    
    return date.toISOString();
  }

  /**
   * Split data into training and test sets
   */
  splitTrainingData() {
    const shuffled = [...this.trainingData].sort(() => Math.random() - 0.5);
    const splitIndex = Math.floor(shuffled.length * 0.8);
    
    this.trainingData = shuffled.slice(0, splitIndex);
    this.testData = shuffled.slice(splitIndex);
  }

  /**
   * Get post age in hours
   */
  getPostAgeHours(createdTime) {
    const now = new Date().getTime();
    const created = new Date(createdTime).getTime();
    return (now - created) / (1000 * 60 * 60);
  }

  /**
   * Save dataset to file
   */
  async saveDataset(filename = 'viral_training_data.json') {
    const datasetPath = path.join(__dirname, '../data/processed', filename);
    
    // Ensure directory exists
    const dir = path.dirname(datasetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const dataset = {
      training: this.trainingData,
      test: this.testData,
      features: this.featureLabels,
      metadata: {
        generated_at: new Date().toISOString(),
        training_samples: this.trainingData.length,
        test_samples: this.testData.length,
        feature_count: this.featureLabels.length
      }
    };
    
    fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));
    console.log(`✅ Dataset saved to ${datasetPath}`);
    
    return datasetPath;
  }

  /**
   * Load existing dataset
   */
  async loadDataset(filename = 'viral_training_data.json') {
    const datasetPath = path.join(__dirname, '../data/processed', filename);
    
    if (!fs.existsSync(datasetPath)) {
      throw new Error(`Dataset not found: ${datasetPath}`);
    }
    
    const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
    this.trainingData = dataset.training;
    this.testData = dataset.test;
    this.featureLabels = dataset.features;
    
    console.log(`✅ Dataset loaded from ${datasetPath}`);
    return dataset;
  }
}

module.exports = DatasetGenerator;

// Example usage
if (require.main === module) {
  const generator = new DatasetGenerator();
  
  generator.generateTrainingData()
    .then(dataset => {
      console.log('\n📊 Dataset Statistics:');
      console.log(`Training samples: ${dataset.training.length}`);
      console.log(`Test samples: ${dataset.test.length}`);
      console.log(`Features: ${dataset.features.length}`);
      
      return generator.saveDataset();
    })
    .then(path => {
      console.log(`\n✅ Dataset ready for ML training at: ${path}`);
    })
    .catch(error => {
      console.error('❌ Error generating dataset:', error);
    });
}
