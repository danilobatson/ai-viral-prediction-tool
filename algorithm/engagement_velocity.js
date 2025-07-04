/**
 * Engagement Velocity Calculator
 * Calculates the rate of interactions per hour for viral prediction
 * Key insight: Viral posts get 1K+ interactions in first hour
 */

class EngagementVelocity {
  constructor() {
    this.VIRAL_VELOCITY_THRESHOLD = 1000; // interactions per hour
    this.MOMENTUM_DECAY_FACTOR = 0.8; // How much velocity decays per hour
  }

  /**
   * Calculate engagement velocity from post data
   * @param {Object} postData - Post data with interactions and timestamp
   * @returns {Object} Velocity metrics and viral probability
   */
  calculateVelocity(postData) {
    const {
      interactions = 0,
      created_time,
      current_time = Date.now(),
      interaction_history = []
    } = postData;

    // Calculate hours since post creation
    const postAge = this.getPostAgeInHours(created_time, current_time);
    
    if (postAge === 0) {
      return this.getZeroAgeVelocity();
    }

    // Calculate basic velocity
    const basicVelocity = interactions / postAge;
    
    // Calculate momentum-adjusted velocity
    const momentumVelocity = this.calculateMomentumVelocity(interaction_history);
    
    // Calculate early detection score (critical first 2 hours)
    const earlyDetectionScore = this.calculateEarlyDetection(postData);
    
    // Calculate viral probability based on velocity
    const viralProbability = this.calculateViralProbability(basicVelocity, momentumVelocity);
    
    return {
      basicVelocity: Math.round(basicVelocity),
      momentumVelocity: Math.round(momentumVelocity),
      earlyDetectionScore,
      viralProbability,
      isViralVelocity: basicVelocity >= this.VIRAL_VELOCITY_THRESHOLD,
      postAge,
      timestamp: current_time,
      metadata: {
        totalInteractions: interactions,
        velocityThreshold: this.VIRAL_VELOCITY_THRESHOLD,
        calculatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Calculate post age in hours with decimal precision
   */
  getPostAgeInHours(created_time, current_time) {
    const createdMs = new Date(created_time).getTime();
    const currentMs = new Date(current_time).getTime();
    const ageMs = currentMs - createdMs;
    return Math.max(ageMs / (1000 * 60 * 60), 0.1); // Minimum 0.1 hours
  }

  /**
   * Handle zero age posts (just created)
   */
  getZeroAgeVelocity() {
    return {
      basicVelocity: 0,
      momentumVelocity: 0,
      earlyDetectionScore: 0,
      viralProbability: 0,
      isViralVelocity: false,
      postAge: 0,
      timestamp: Date.now(),
      metadata: {
        status: 'just_created',
        note: 'Post too new for velocity calculation'
      }
    };
  }

  /**
   * Calculate momentum-adjusted velocity using interaction history
   */
  calculateMomentumVelocity(interactionHistory) {
    if (!interactionHistory || interactionHistory.length < 2) {
      return 0;
    }

    let momentumScore = 0;
    const sortedHistory = [...interactionHistory].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    for (let i = 1; i < sortedHistory.length; i++) {
      const current = sortedHistory[i];
      const previous = sortedHistory[i - 1];
      
      const timeDiff = (new Date(current.timestamp) - new Date(previous.timestamp)) / (1000 * 60 * 60);
      const interactionDiff = current.interactions - previous.interactions;
      
      if (timeDiff > 0) {
        const hourlyRate = interactionDiff / timeDiff;
        const decayFactor = Math.pow(this.MOMENTUM_DECAY_FACTOR, i - 1);
        momentumScore += hourlyRate * decayFactor;
      }
    }

    return momentumScore;
  }

  /**
   * Calculate early detection score for posts in first 2 hours
   * This is critical for viral prediction accuracy
   */
  calculateEarlyDetection(postData) {
    const { interactions, created_time } = postData;
    const postAge = this.getPostAgeInHours(created_time, Date.now());
    
    if (postAge > 2) {
      return 0; // Not in early detection window
    }

    // Early viral indicators
    const earlyIndicators = {
      first30Min: postAge <= 0.5 && interactions >= 100,
      first60Min: postAge <= 1 && interactions >= 500,
      first120Min: postAge <= 2 && interactions >= 1000
    };

    let score = 0;
    if (earlyIndicators.first30Min) score += 0.4;
    if (earlyIndicators.first60Min) score += 0.3;
    if (earlyIndicators.first120Min) score += 0.3;

    return Math.min(score, 1.0); // Cap at 1.0
  }

  /**
   * Calculate viral probability based on velocity metrics
   */
  calculateViralProbability(basicVelocity, momentumVelocity) {
    // Weighted scoring system
    const basicScore = Math.min(basicVelocity / this.VIRAL_VELOCITY_THRESHOLD, 1.0);
    const momentumScore = Math.min(momentumVelocity / this.VIRAL_VELOCITY_THRESHOLD, 1.0);
    
    // Combine scores with weights
    const combinedScore = (basicScore * 0.6) + (momentumScore * 0.4);
    
    // Apply sigmoid function for probability curve
    return this.sigmoid(combinedScore * 6 - 3); // Adjusted for viral threshold
  }

  /**
   * Sigmoid function for probability calculation
   */
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Get velocity category for human-readable output
   */
  getVelocityCategory(velocity) {
    if (velocity >= 5000) return 'Ultra Viral';
    if (velocity >= 2000) return 'High Viral';
    if (velocity >= 1000) return 'Viral';
    if (velocity >= 500) return 'High Engagement';
    if (velocity >= 100) return 'Moderate Engagement';
    if (velocity >= 10) return 'Low Engagement';
    return 'Minimal Engagement';
  }

  /**
   * Batch process multiple posts for velocity analysis
   */
  analyzeBatch(posts) {
    return posts.map(post => ({
      ...post,
      velocityAnalysis: this.calculateVelocity(post)
    }));
  }
}

module.exports = EngagementVelocity;

// Example usage and testing
if (require.main === module) {
  const velocity = new EngagementVelocity();
  
  // Test case 1: High viral velocity
  const viralPost = {
    interactions: 15000,
    created_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    interaction_history: [
      { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), interactions: 0 },
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), interactions: 5000 },
      { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), interactions: 10000 },
      { timestamp: new Date().toISOString(), interactions: 15000 }
    ]
  };

  console.log('🔥 VIRAL POST ANALYSIS:');
  console.log(JSON.stringify(velocity.calculateVelocity(viralPost), null, 2));
  
  // Test case 2: Low engagement post
  const lowPost = {
    interactions: 150,
    created_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  };

  console.log('\n📉 LOW ENGAGEMENT POST ANALYSIS:');
  console.log(JSON.stringify(velocity.calculateVelocity(lowPost), null, 2));
}
