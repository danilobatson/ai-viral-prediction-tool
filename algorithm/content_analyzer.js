/**
 * Content Analysis Engine
 * Analyzes sentiment, structure, and viral content patterns
 * Key insight: Numbers + Emotion + Authority = Viral Success
 */

class ContentAnalyzer {
  constructor() {
    // Viral content patterns from Phase 1 analysis
    this.VIRAL_PATTERNS = {
      // Emotional trigger words
      POSITIVE_EMOTIONS: ['amazing', 'incredible', 'huge', 'massive', 'explosive', 'moon', 'rocket', 'fire', 'insane', 'crazy', 'epic'],
      NEGATIVE_EMOTIONS: ['crash', 'dump', 'disaster', 'warning', 'danger', 'alert', 'panic', 'fear', 'breaking'],
      AUTHORITY_WORDS: ['analysis', 'prediction', 'forecast', 'data', 'research', 'study', 'expert', 'professional'],
      ACTION_WORDS: ['buy', 'sell', 'hold', 'watch', 'alert', 'breaking', 'urgent', 'now', 'today'],
      
      // Structural patterns
      QUESTION_PATTERNS: ['?', 'what', 'when', 'why', 'how', 'which', 'where'],
      EXCLAMATION_PATTERNS: ['!', '🔥', '🚀', '💥', '⚡', '🌙'],
      NUMBER_PATTERNS: /\d+[\.,]?\d*[kmb%]?/gi,
      
      // Content types that go viral
      VIRAL_CONTENT_TYPES: {
        PERSONAL_SUCCESS: ['i made', 'i earned', 'i gained', 'i turned', 'my portfolio', 'my trade'],
        PREDICTIONS: ['will hit', 'going to', 'next target', 'prediction', 'forecast', 'will reach'],
        BREAKING_NEWS: ['breaking', 'just in', 'alert', 'urgent', 'happening now'],
        CONTRARIAN: ['everyone is wrong', 'unpopular opinion', 'contrary to', 'against the grain'],
        EDUCATIONAL: ['how to', 'guide', 'tutorial', 'learn', 'understand', 'explain']
      }
    };

    // Sentiment scoring weights
    this.SENTIMENT_WEIGHTS = {
      EMOTIONAL_INTENSITY: 0.3,
      AUTHORITY_SIGNALS: 0.2,
      STRUCTURAL_ELEMENTS: 0.2,
      VIRAL_CONTENT_TYPE: 0.2,
      ENGAGEMENT_TRIGGERS: 0.1
    };
  }

  /**
   * Analyze content for viral potential
   * @param {Object} contentData - Post content and metadata
   * @returns {Object} Content analysis with viral probability
   */
  analyzeContent(contentData) {
    const {
      text = '',
      media_count = 0,
      hashtags = [],
      mentions = [],
      urls = [],
      created_time,
      topic_category = 'general'
    } = contentData;

    // Analyze individual components
    const emotionalAnalysis = this.analyzeEmotionalIntensity(text);
    const authorityAnalysis = this.analyzeAuthoritySignals(text);
    const structuralAnalysis = this.analyzeStructuralElements(text, media_count);
    const contentTypeAnalysis = this.analyzeContentType(text);
    const engagementTriggers = this.analyzeEngagementTriggers(text, hashtags);
    
    // Calculate numbers and specificity score
    const specificityScore = this.calculateSpecificityScore(text);
    
    // Calculate viral content formula score
    const viralFormulaScore = this.calculateViralFormula(
      specificityScore,
      emotionalAnalysis.intensity,
      authorityAnalysis.score
    );

    // Calculate weighted content score
    const contentScore = this.calculateWeightedScore({
      emotionalAnalysis,
      authorityAnalysis,
      structuralAnalysis,
      contentTypeAnalysis,
      engagementTriggers
    });

    // Generate content insights
    const insights = this.generateContentInsights(contentData, contentScore);

    return {
      contentScore: Math.round(contentScore * 100) / 100,
      viralFormulaScore: Math.round(viralFormulaScore * 100) / 100,
      viralProbability: this.calculateViralProbability(contentScore, viralFormulaScore),
      components: {
        emotionalIntensity: Math.round(emotionalAnalysis.intensity * 100) / 100,
        authoritySignals: Math.round(authorityAnalysis.score * 100) / 100,
        structuralScore: Math.round(structuralAnalysis.score * 100) / 100,
        contentTypeScore: Math.round(contentTypeAnalysis.score * 100) / 100,
        engagementTriggers: Math.round(engagementTriggers.score * 100) / 100,
        specificityScore: Math.round(specificityScore * 100) / 100
      },
      patterns: {
        detectedEmotions: emotionalAnalysis.emotions,
        authorityWords: authorityAnalysis.words,
        contentType: contentTypeAnalysis.type,
        engagementElements: engagementTriggers.elements,
        numberCount: (text.match(this.VIRAL_PATTERNS.NUMBER_PATTERNS) || []).length
      },
      insights,
      metadata: {
        textLength: text.length,
        wordCount: text.split(/\s+/).length,
        hashtagCount: hashtags.length,
        mentionCount: mentions.length,
        mediaCount: media_count,
        analyzedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Analyze emotional intensity of content
   */
  analyzeEmotionalIntensity(text) {
    const lowerText = text.toLowerCase();
    const emotions = [];
    let intensity = 0;

    // Check for positive emotions
    this.VIRAL_PATTERNS.POSITIVE_EMOTIONS.forEach(emotion => {
      if (lowerText.includes(emotion)) {
        emotions.push({ type: 'positive', word: emotion });
        intensity += 0.2;
      }
    });

    // Check for negative emotions
    this.VIRAL_PATTERNS.NEGATIVE_EMOTIONS.forEach(emotion => {
      if (lowerText.includes(emotion)) {
        emotions.push({ type: 'negative', word: emotion });
        intensity += 0.15;
      }
    });

    // Check for exclamation and emoji intensity
    const exclamationCount = (text.match(/[!🔥🚀💥⚡🌙]/g) || []).length;
    intensity += Math.min(exclamationCount * 0.1, 0.3);

    // Check for caps lock intensity
    const capsWords = text.match(/\b[A-Z]{2,}\b/g) || [];
    intensity += Math.min(capsWords.length * 0.05, 0.2);

    return {
      intensity: Math.min(intensity, 1.0),
      emotions,
      exclamationCount,
      capsWordsCount: capsWords.length
    };
  }

  /**
   * Analyze authority signals in content
   */
  analyzeAuthoritySignals(text) {
    const lowerText = text.toLowerCase();
    const authorityWords = [];
    let score = 0;

    // Check for authority words
    this.VIRAL_PATTERNS.AUTHORITY_WORDS.forEach(word => {
      if (lowerText.includes(word)) {
        authorityWords.push(word);
        score += 0.15;
      }
    });

    // Check for data references
    const hasNumbers = this.VIRAL_PATTERNS.NUMBER_PATTERNS.test(text);
    if (hasNumbers) {
      score += 0.2;
      authorityWords.push('data_reference');
    }

    // Check for sources or links
    if (lowerText.includes('source') || lowerText.includes('study') || lowerText.includes('research')) {
      score += 0.1;
      authorityWords.push('source_reference');
    }

    return {
      score: Math.min(score, 1.0),
      words: authorityWords
    };
  }

  /**
   * Analyze structural elements
   */
  analyzeStructuralElements(text, mediaCount) {
    let score = 0;
    const elements = [];

    // Check for questions (engagement driver)
    const questionCount = (text.match(/\?/g) || []).length;
    if (questionCount > 0) {
      score += 0.2;
      elements.push(`questions: ${questionCount}`);
    }

    // Check for lists or bullet points
    const listPatterns = /^\s*[-•*]\s/gm;
    if (listPatterns.test(text)) {
      score += 0.15;
      elements.push('structured_list');
    }

    // Check for media presence
    if (mediaCount > 0) {
      score += 0.2;
      elements.push(`media: ${mediaCount}`);
    }

    // Check for optimal length (viral posts tend to be 100-300 characters)
    const length = text.length;
    if (length >= 100 && length <= 300) {
      score += 0.15;
      elements.push('optimal_length');
    }

    // Check for call-to-action elements
    const ctaPatterns = ['retweet', 'share', 'comment', 'follow', 'like', 'what do you think'];
    const hasCTA = ctaPatterns.some(cta => text.toLowerCase().includes(cta));
    if (hasCTA) {
      score += 0.1;
      elements.push('call_to_action');
    }

    return {
      score: Math.min(score, 1.0),
      elements
    };
  }

  /**
   * Analyze content type for viral potential
   */
  analyzeContentType(text) {
    const lowerText = text.toLowerCase();
    let bestType = 'general';
    let bestScore = 0;

    // Check each viral content type
    Object.entries(this.VIRAL_PATTERNS.VIRAL_CONTENT_TYPES).forEach(([type, patterns]) => {
      const matches = patterns.filter(pattern => lowerText.includes(pattern)).length;
      const score = Math.min(matches * 0.3, 1.0);
      
      if (score > bestScore) {
        bestScore = score;
        bestType = type.toLowerCase().replace('_', ' ');
      }
    });

    return {
      type: bestType,
      score: bestScore
    };
  }

  /**
   * Analyze engagement triggers
   */
  analyzeEngagementTriggers(text, hashtags) {
    const elements = [];
    let score = 0;

    // Check for trending hashtags
    const trendingHashtags = ['#bitcoin', '#crypto', '#eth', '#btc', '#defi', '#nft'];
    const hasTrendingHashtag = hashtags.some(tag => 
      trendingHashtags.includes(tag.toLowerCase())
    );
    
    if (hasTrendingHashtag) {
      score += 0.2;
      elements.push('trending_hashtags');
    }

    // Check for urgency words
    const urgencyWords = ['now', 'today', 'urgent', 'breaking', 'just', 'alert'];
    const hasUrgency = urgencyWords.some(word => text.toLowerCase().includes(word));
    
    if (hasUrgency) {
      score += 0.15;
      elements.push('urgency');
    }

    // Check for controversy indicators
    const controversyWords = ['unpopular', 'wrong', 'mistake', 'scam', 'bubble'];
    const hasControversy = controversyWords.some(word => text.toLowerCase().includes(word));
    
    if (hasControversy) {
      score += 0.1;
      elements.push('controversy');
    }

    return {
      score: Math.min(score, 1.0),
      elements
    };
  }

  /**
   * Calculate specificity score (numbers and concrete details)
   */
  calculateSpecificityScore(text) {
    const numbers = text.match(this.VIRAL_PATTERNS.NUMBER_PATTERNS) || [];
    const percentages = (text.match(/\d+%/g) || []).length;
    const currencies = (text.match(/\$\d+/g) || []).length;
    const dates = (text.match(/\d{4}|\d{1,2}\/\d{1,2}/g) || []).length;
    
    const specificityElements = numbers.length + percentages + currencies + dates;
    
    // Viral posts often have 2-5 specific numbers
    const optimalRange = specificityElements >= 2 && specificityElements <= 5;
    const baseScore = Math.min(specificityElements * 0.2, 1.0);
    
    return optimalRange ? Math.min(baseScore + 0.2, 1.0) : baseScore;
  }

  /**
   * Calculate viral formula score: Numbers + Emotion + Authority
   */
  calculateViralFormula(specificityScore, emotionalIntensity, authorityScore) {
    const weights = {
      numbers: 0.4,    // Specificity and concrete data
      emotion: 0.35,   // Emotional intensity
      authority: 0.25  // Authority signals
    };

    return (specificityScore * weights.numbers) + 
           (emotionalIntensity * weights.emotion) + 
           (authorityScore * weights.authority);
  }

  /**
   * Calculate weighted content score
   */
  calculateWeightedScore(components) {
    const { emotionalAnalysis, authorityAnalysis, structuralAnalysis, contentTypeAnalysis, engagementTriggers } = components;
    
    return (emotionalAnalysis.intensity * this.SENTIMENT_WEIGHTS.EMOTIONAL_INTENSITY) +
           (authorityAnalysis.score * this.SENTIMENT_WEIGHTS.AUTHORITY_SIGNALS) +
           (structuralAnalysis.score * this.SENTIMENT_WEIGHTS.STRUCTURAL_ELEMENTS) +
           (contentTypeAnalysis.score * this.SENTIMENT_WEIGHTS.VIRAL_CONTENT_TYPE) +
           (engagementTriggers.score * this.SENTIMENT_WEIGHTS.ENGAGEMENT_TRIGGERS);
  }

  /**
   * Calculate viral probability from content analysis
   */
  calculateViralProbability(contentScore, viralFormulaScore) {
    const combinedScore = (contentScore * 0.6) + (viralFormulaScore * 0.4);
    return this.sigmoid(combinedScore * 6 - 3);
  }

  /**
   * Generate content insights
   */
  generateContentInsights(contentData, contentScore) {
    const insights = [];
    const { text } = contentData;

    if (contentScore > 0.8) {
      insights.push('🔥 Excellent viral content potential');
    } else if (contentScore > 0.6) {
      insights.push('✅ Good viral content elements');
    } else if (contentScore > 0.4) {
      insights.push('📈 Moderate viral potential');
    } else {
      insights.push('📝 Content needs optimization');
    }

    // Specific improvement suggestions
    if (text.length < 100) {
      insights.push('💡 Add more detail for better engagement');
    }

    if (!(this.VIRAL_PATTERNS.NUMBER_PATTERNS.test(text))) {
      insights.push('📊 Add specific numbers or data');
    }

    if (!text.includes('?') && !text.includes('!')) {
      insights.push('❓ Add questions or exclamations');
    }

    return insights;
  }

  /**
   * Utility functions
   */
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
}

module.exports = ContentAnalyzer;

// Example usage and testing
if (require.main === module) {
  const analyzer = new ContentAnalyzer();
  
  // Test case 1: High viral potential content
  const viralContent = {
    text: "🚀 I just turned $1,000 into $25,000 in 30 days trading Bitcoin! My analysis predicted this 2400% gain. Here's my exact strategy... What do you think? #Bitcoin #Trading",
    media_count: 1,
    hashtags: ['#Bitcoin', '#Trading'],
    mentions: [],
    urls: [],
    created_time: new Date().toISOString(),
    topic_category: 'trading'
  };

  console.log('🔥 HIGH VIRAL POTENTIAL CONTENT:');
  console.log(JSON.stringify(analyzer.analyzeContent(viralContent), null, 2));
  
  // Test case 2: Low viral potential content
  const lowContent = {
    text: "Bitcoin price update: Currently trading at $45,000. Market looks stable today.",
    media_count: 0,
    hashtags: [],
    mentions: [],
    urls: [],
    created_time: new Date().toISOString(),
    topic_category: 'price'
  };

  console.log('\n📉 LOW VIRAL POTENTIAL CONTENT:');
  console.log(JSON.stringify(analyzer.analyzeContent(lowContent), null, 2));
}
