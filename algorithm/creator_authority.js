/**
 * Creator Authority Scoring System
 * Analyzes creator influence potential for viral prediction
 * Key insight: 50K-100K followers = optimal viral probability
 */

class CreatorAuthority {
  constructor() {
    // Authority thresholds based on Phase 1 analysis
    this.THRESHOLDS = {
      MEGA_INFLUENCER: 1000000,  // 1M+ followers
      MAJOR_INFLUENCER: 100000,  // 100K+ followers
      MICRO_INFLUENCER: 10000,   // 10K+ followers
      EMERGING_CREATOR: 1000,    // 1K+ followers
      NEW_CREATOR: 100          // 100+ followers
    };

    // Optimal range for viral content (Phase 1 findings)
    this.OPTIMAL_FOLLOWER_RANGE = {
      MIN: 50000,
      MAX: 100000
    };

    // Engagement rate benchmarks
    this.ENGAGEMENT_BENCHMARKS = {
      EXCELLENT: 0.10,  // 10%+ engagement rate
      GOOD: 0.05,       // 5%+ engagement rate  
      AVERAGE: 0.02,    // 2%+ engagement rate
      POOR: 0.01        // 1%+ engagement rate
    };
  }

  /**
   * Calculate comprehensive creator authority score
   * @param {Object} creatorData - Creator profile and engagement data
   * @returns {Object} Authority metrics and viral influence potential
   */
  calculateAuthority(creatorData) {
    const {
      follower_count = 0,
      following_count = 0,
      posts_count = 0,
      avg_interactions = 0,
      viral_posts_count = 0,
      account_age_days = 0,
      verified = false,
      bio_keywords = [],
      recent_posts = []
    } = creatorData;

    // Calculate individual authority components
    const followerScore = this.calculateFollowerScore(follower_count);
    const engagementScore = this.calculateEngagementScore(follower_count, avg_interactions);
    const viralHistoryScore = this.calculateViralHistoryScore(viral_posts_count, posts_count);
    const accountMaturityScore = this.calculateAccountMaturity(account_age_days);
    const credibilityScore = this.calculateCredibilityScore(creatorData);
    const contentConsistencyScore = this.calculateContentConsistency(recent_posts);

    // Calculate weighted authority score
    const authorityScore = this.calculateWeightedScore({
      followerScore,
      engagementScore,
      viralHistoryScore,
      accountMaturityScore,
      credibilityScore,
      contentConsistencyScore
    });

    // Determine authority tier
    const authorityTier = this.getAuthorityTier(follower_count, authorityScore);
    
    // Calculate viral probability multiplier
    const viralMultiplier = this.calculateViralMultiplier(follower_count, authorityScore);

    return {
      authorityScore: Math.round(authorityScore * 100) / 100,
      authorityTier,
      viralMultiplier,
      isOptimalRange: this.isInOptimalRange(follower_count),
      components: {
        followerScore: Math.round(followerScore * 100) / 100,
        engagementScore: Math.round(engagementScore * 100) / 100,
        viralHistoryScore: Math.round(viralHistoryScore * 100) / 100,
        accountMaturityScore: Math.round(accountMaturityScore * 100) / 100,
        credibilityScore: Math.round(credibilityScore * 100) / 100,
        contentConsistencyScore: Math.round(contentConsistencyScore * 100) / 100
      },
      insights: this.generateInsights(creatorData, authorityScore),
      metadata: {
        followerCount: follower_count,
        calculatedAt: new Date().toISOString(),
        optimalRange: this.OPTIMAL_FOLLOWER_RANGE
      }
    };
  }

  /**
   * Calculate follower score with optimal range weighting
   */
  calculateFollowerScore(followerCount) {
    if (followerCount === 0) return 0;

    // Logarithmic scaling for follower count
    const logScore = Math.log10(followerCount) / Math.log10(this.THRESHOLDS.MEGA_INFLUENCER);
    
    // Bonus for optimal range (50K-100K followers)
    const optimalRangeBonus = this.isInOptimalRange(followerCount) ? 0.3 : 0;
    
    // Diminishing returns for mega-influencers
    const diminishingFactor = followerCount > this.THRESHOLDS.MAJOR_INFLUENCER ? 0.8 : 1.0;
    
    return Math.min((logScore + optimalRangeBonus) * diminishingFactor, 1.0);
  }

  /**
   * Calculate engagement score based on interaction rates
   */
  calculateEngagementScore(followerCount, avgInteractions) {
    if (followerCount === 0) return 0;

    const engagementRate = avgInteractions / followerCount;
    
    if (engagementRate >= this.ENGAGEMENT_BENCHMARKS.EXCELLENT) return 1.0;
    if (engagementRate >= this.ENGAGEMENT_BENCHMARKS.GOOD) return 0.8;
    if (engagementRate >= this.ENGAGEMENT_BENCHMARKS.AVERAGE) return 0.6;
    if (engagementRate >= this.ENGAGEMENT_BENCHMARKS.POOR) return 0.4;
    
    return Math.min(engagementRate / this.ENGAGEMENT_BENCHMARKS.POOR, 0.4);
  }

  /**
   * Calculate viral history score
   */
  calculateViralHistoryScore(viralPostsCount, totalPosts) {
    if (totalPosts === 0) return 0;

    const viralRate = viralPostsCount / totalPosts;
    
    // Sigmoid curve for viral history
    return this.sigmoid(viralRate * 20 - 1);
  }

  /**
   * Calculate account maturity score
   */
  calculateAccountMaturity(accountAgeDays) {
    if (accountAgeDays === 0) return 0;

    // Optimal maturity around 1-3 years
    const optimalDays = 365 * 2; // 2 years
    const maturityFactor = Math.min(accountAgeDays / optimalDays, 1.0);
    
    // Bonus for established accounts
    const establishedBonus = accountAgeDays > 365 ? 0.2 : 0;
    
    return Math.min(maturityFactor + establishedBonus, 1.0);
  }

  /**
   * Calculate credibility score
   */
  calculateCredibilityScore(creatorData) {
    const { verified = false, bio_keywords = [], follower_count = 0, following_count = 0 } = creatorData;
    
    let score = 0;
    
    // Verified account bonus
    if (verified) score += 0.3;
    
    // Bio quality indicators
    const professionalKeywords = ['ceo', 'founder', 'expert', 'analyst', 'trader', 'investor'];
    const hasProKeywords = bio_keywords.some(keyword => 
      professionalKeywords.includes(keyword.toLowerCase())
    );
    if (hasProKeywords) score += 0.2;
    
    // Follower to following ratio (quality indicator)
    const followerRatio = following_count > 0 ? follower_count / following_count : 0;
    if (followerRatio > 10) score += 0.3;
    else if (followerRatio > 2) score += 0.2;
    
    // Bio length indicator
    if (bio_keywords.length > 5) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate content consistency score
   */
  calculateContentConsistency(recentPosts) {
    if (!recentPosts || recentPosts.length === 0) return 0;

    const engagementVariance = this.calculateEngagementVariance(recentPosts);
    const postingFrequency = this.calculatePostingFrequency(recentPosts);
    
    // Lower variance = more consistent = higher score
    const consistencyScore = Math.max(0, 1 - engagementVariance);
    const frequencyScore = Math.min(postingFrequency / 7, 1.0); // Optimal: 7 posts per week
    
    return (consistencyScore * 0.7) + (frequencyScore * 0.3);
  }

  /**
   * Calculate weighted authority score
   */
  calculateWeightedScore(components) {
    const weights = {
      followerScore: 0.25,
      engagementScore: 0.25,
      viralHistoryScore: 0.20,
      accountMaturityScore: 0.10,
      credibilityScore: 0.15,
      contentConsistencyScore: 0.05
    };

    return Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (components[key] * weight);
    }, 0);
  }

  /**
   * Get authority tier based on follower count and score
   */
  getAuthorityTier(followerCount, authorityScore) {
    if (followerCount >= this.THRESHOLDS.MEGA_INFLUENCER) return 'Mega Influencer';
    if (followerCount >= this.THRESHOLDS.MAJOR_INFLUENCER) return 'Major Influencer';
    if (followerCount >= this.THRESHOLDS.MICRO_INFLUENCER) return 'Micro Influencer';
    if (followerCount >= this.THRESHOLDS.EMERGING_CREATOR) return 'Emerging Creator';
    if (followerCount >= this.THRESHOLDS.NEW_CREATOR) return 'New Creator';
    return 'Beginner';
  }

  /**
   * Calculate viral probability multiplier
   */
  calculateViralMultiplier(followerCount, authorityScore) {
    // Base multiplier from authority score
    const baseMultiplier = 1 + (authorityScore * 2);
    
    // Optimal range bonus
    const optimalBonus = this.isInOptimalRange(followerCount) ? 0.5 : 0;
    
    // Diminishing returns for mega-influencers
    const diminishingFactor = followerCount > this.THRESHOLDS.MEGA_INFLUENCER ? 0.7 : 1.0;
    
    return Math.round((baseMultiplier + optimalBonus) * diminishingFactor * 100) / 100;
  }

  /**
   * Check if follower count is in optimal viral range
   */
  isInOptimalRange(followerCount) {
    return followerCount >= this.OPTIMAL_FOLLOWER_RANGE.MIN && 
           followerCount <= this.OPTIMAL_FOLLOWER_RANGE.MAX;
  }

  /**
   * Generate insights for creator authority
   */
  generateInsights(creatorData, authorityScore) {
    const { follower_count = 0 } = creatorData;
    const insights = [];

    if (this.isInOptimalRange(follower_count)) {
      insights.push('🎯 In optimal viral range (50K-100K followers)');
    }

    if (authorityScore > 0.8) {
      insights.push('⭐ High authority - excellent viral potential');
    } else if (authorityScore > 0.6) {
      insights.push('✅ Good authority - solid viral potential');
    } else if (authorityScore > 0.4) {
      insights.push('📈 Moderate authority - growing potential');
    } else {
      insights.push('🌱 Building authority - focus on consistency');
    }

    if (follower_count < 1000) {
      insights.push('💡 Tip: Focus on consistent posting and engagement');
    }

    return insights;
  }

  /**
   * Utility functions
   */
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  calculateEngagementVariance(posts) {
    if (posts.length < 2) return 0;
    
    const engagements = posts.map(post => post.interactions || 0);
    const mean = engagements.reduce((a, b) => a + b, 0) / engagements.length;
    const variance = engagements.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / engagements.length;
    
    return Math.sqrt(variance) / (mean || 1); // Coefficient of variation
  }

  calculatePostingFrequency(posts) {
    if (posts.length < 2) return 0;
    
    const timestamps = posts.map(post => new Date(post.created_time).getTime());
    const sortedTimestamps = timestamps.sort((a, b) => a - b);
    
    const totalTime = sortedTimestamps[sortedTimestamps.length - 1] - sortedTimestamps[0];
    const averageInterval = totalTime / (posts.length - 1);
    
    return (7 * 24 * 60 * 60 * 1000) / averageInterval; // Posts per week
  }
}

module.exports = CreatorAuthority;

// Example usage and testing
if (require.main === module) {
  const authority = new CreatorAuthority();
  
  // Test case 1: Optimal range creator
  const optimalCreator = {
    follower_count: 75000,
    following_count: 500,
    posts_count: 200,
    avg_interactions: 3750, // 5% engagement rate
    viral_posts_count: 10,
    account_age_days: 730,
    verified: true,
    bio_keywords: ['crypto', 'trader', 'analyst', 'bitcoin'],
    recent_posts: [
      { interactions: 4000, created_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { interactions: 3500, created_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { interactions: 4200, created_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
  };

  console.log('🎯 OPTIMAL CREATOR ANALYSIS:');
  console.log(JSON.stringify(authority.calculateAuthority(optimalCreator), null, 2));
  
  // Test case 2: New creator
  const newCreator = {
    follower_count: 500,
    following_count: 200,
    posts_count: 20,
    avg_interactions: 15,
    viral_posts_count: 0,
    account_age_days: 30,
    verified: false,
    bio_keywords: ['crypto', 'newbie'],
    recent_posts: []
  };

  console.log('\n🌱 NEW CREATOR ANALYSIS:');
  console.log(JSON.stringify(authority.calculateAuthority(newCreator), null, 2));
}
