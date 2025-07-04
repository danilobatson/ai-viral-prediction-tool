/**
 * LLM Content Analyzer - Fallback Version
 * Provides rule-based content analysis when LLM is not available
 */

class LLMContentAnalyzerFallback {
  constructor() {
    this.enabled = false;
    console.log('ℹ️ LLM fallback analyzer initialized (no external API required)');
  }

  /**
   * Analyze content with rule-based approach
   */
  async analyzeContent(text) {
    if (!text) text = '';
    
    // Rule-based analysis
    const emotionalScore = this.calculateEmotionalScore(text);
    const credibilityScore = this.calculateCredibilityScore(text);
    const urgencyScore = this.calculateUrgencyScore(text);
    const socialProofScore = this.calculateSocialProofScore(text);
    const specificityScore = this.calculateSpecificityScore(text);
    
    return {
      emotionalScore,
      credibilityScore,
      engagementTriggers: this.extractEngagementTriggers(text),
      viralElements: this.extractViralElements(text),
      sentiment: this.analyzeSentiment(text),
      urgency: urgencyScore,
      specificity: specificityScore,
      socialProof: socialProofScore,
      callToAction: this.detectCallToAction(text),
      trending: this.detectTrending(text),
      llmScore: Math.round((emotionalScore + credibilityScore + urgencyScore + socialProofScore) / 4),
      llmEnabled: false,
      processingTime: 0
    };
  }

  calculateEmotionalScore(text) {
    const emotionalWords = [
      'amazing', 'incredible', 'unbelievable', 'shocking', 'explosive', 'massive',
      'huge', 'insane', 'crazy', 'wild', 'epic', 'legendary', 'historic',
      'revolutionary', 'breakthrough', 'game-changing', 'wow', 'omg'
    ];
    
    const emotionalSymbols = ['🚀', '💎', '🔥', '⚡', '💰', '🎯', '🌟', '✨', '🎉', '💯'];
    
    let score = 0;
    const lowerText = text.toLowerCase();
    
    emotionalWords.forEach(word => {
      if (lowerText.includes(word)) score += 10;
    });
    
    emotionalSymbols.forEach(symbol => {
      if (text.includes(symbol)) score += 15;
    });
    
    // Excitement indicators
    if (text.includes('!')) score += 5;
    if (text.includes('!!')) score += 10;
    if (text.includes('!!!')) score += 15;
    
    return Math.min(score, 100);
  }

  calculateCredibilityScore(text) {
    let score = 50; // Base score
    
    // Numbers and statistics
    if (/\d+%/.test(text)) score += 15;
    if (/\$\d+/.test(text)) score += 10;
    if (/\d+x/.test(text)) score += 10;
    
    // Time references
    if (text.includes('just') || text.includes('now') || text.includes('breaking')) score += 10;
    
    // Authority indicators
    if (text.includes('analysis') || text.includes('data') || text.includes('research')) score += 10;
    
    return Math.min(score, 100);
  }

  calculateUrgencyScore(text) {
    const urgencyWords = ['now', 'urgent', 'breaking', 'alert', 'just', 'happening', 'live'];
    let score = 0;
    
    urgencyWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 15;
    });
    
    return Math.min(score, 100);
  }

  calculateSocialProofScore(text) {
    let score = 0;
    
    // Social indicators
    if (text.includes('everyone') || text.includes('people') || text.includes('users')) score += 20;
    if (text.includes('trending') || text.includes('viral') || text.includes('popular')) score += 25;
    if (text.includes('community') || text.includes('together')) score += 15;
    
    return Math.min(score, 100);
  }

  calculateSpecificityScore(text) {
    let score = 0;
    
    // Specific numbers
    if (/\d+/.test(text)) score += 20;
    if (/\d+\.\d+/.test(text)) score += 10;
    if (/\d+k|million|billion/.test(text.toLowerCase())) score += 15;
    
    return Math.min(score, 100);
  }

  extractEngagementTriggers(text) {
    const triggers = [];
    
    if (text.includes('🚀')) triggers.push('rocket_emoji');
    if (text.includes('!')) triggers.push('exclamation');
    if (/\d+%/.test(text)) triggers.push('percentage');
    if (text.includes('#')) triggers.push('hashtag');
    
    return triggers;
  }

  extractViralElements(text) {
    const elements = [];
    
    if (text.includes('$')) elements.push('money_reference');
    if (text.includes('🚀')) elements.push('growth_symbol');
    if (text.toLowerCase().includes('bitcoin') || text.toLowerCase().includes('btc')) elements.push('crypto_topic');
    if (text.includes('!')) elements.push('excitement');
    
    return elements;
  }

  analyzeSentiment(text) {
    const positiveWords = ['amazing', 'great', 'awesome', 'incredible', 'fantastic', 'excellent'];
    const negativeWords = ['terrible', 'awful', 'bad', 'horrible', 'disaster', 'crash'];
    
    let positive = 0;
    let negative = 0;
    
    positiveWords.forEach(word => {
      if (text.toLowerCase().includes(word)) positive++;
    });
    
    negativeWords.forEach(word => {
      if (text.toLowerCase().includes(word)) negative++;
    });
    
    if (positive > negative) return 'positive';
    if (negative > positive) return 'negative';
    return 'neutral';
  }

  detectCallToAction(text) {
    const ctaWords = ['buy', 'sell', 'trade', 'invest', 'check', 'look', 'click', 'join'];
    let score = 0;
    
    ctaWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 20;
    });
    
    return Math.min(score, 100);
  }

  detectTrending(text) {
    const trendingWords = ['trending', 'viral', 'hot', 'popular', 'breaking', 'news'];
    let score = 0;
    
    trendingWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 25;
    });
    
    return Math.min(score, 100);
  }

  async getTrendingTopics(text) {
    const topics = [];
    
    if (text.toLowerCase().includes('bitcoin') || text.toLowerCase().includes('btc')) topics.push('bitcoin');
    if (text.toLowerCase().includes('ethereum') || text.toLowerCase().includes('eth')) topics.push('ethereum');
    if (text.toLowerCase().includes('crypto')) topics.push('crypto');
    if (text.includes('#')) {
      const hashtags = text.match(/#\w+/g);
      if (hashtags) topics.push(...hashtags);
    }
    
    return topics.length > 0 ? topics : ['general'];
  }

  async batchAnalyze(posts) {
    return Promise.all(posts.map(post => this.analyzeContent(post.text || post.content || '')));
  }
}

module.exports = LLMContentAnalyzerFallback;
