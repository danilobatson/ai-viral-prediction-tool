/**
 * Enhanced Viral Predictor v2 with LLM Integration
 * Combines rule-based, ML, and LLM analysis for maximum accuracy
 */

const ViralPredictor = require('../viral_predictor');
const MachineLearningModel = require('./machine_learning_model');
const LLMContentAnalyzer = require('../llm_content_analyzer');

class EnhancedViralPredictorV2 {
  constructor() {
    this.ruleBasedPredictor = new ViralPredictor();
    this.mlModel = new MachineLearningModel();
    this.llmAnalyzer = new LLMContentAnalyzer();
    this.isMLModelLoaded = false;
    
    // Hybrid prediction weights with LLM
    this.HYBRID_WEIGHTS = {
      RULE_BASED: 0.30,  // 30% rule-based system
      ML_BASED: 0.45,    // 45% ML model
      LLM_BASED: 0.25    // 25% LLM analysis
    };
    
    this.initializeMLModel();
  }

  async initializeMLModel() {
    try {
      await this.mlModel.loadModel();
      this.isMLModelLoaded = true;
      console.log('✅ ML model loaded successfully');
    } catch (error) {
      console.log('⚠️ ML model not found, using rule-based + LLM only');
      this.isMLModelLoaded = false;
    }
  }

  /**
   * Enhanced viral prediction with ML + LLM integration
   */
  async predictViral(postData) {
    const startTime = Date.now();
    
    // Get rule-based prediction
    const ruleBasedResult = this.ruleBasedPredictor.predictViral(postData);
    
    // Get LLM analysis
    const llmAnalysis = await this.llmAnalyzer.analyzeContent(postData.text || '');
    
    // Get ML prediction if available
    let mlPrediction = null;
    if (this.isMLModelLoaded) {
      const mlFeatures = this.extractMLFeatures(postData, ruleBasedResult, llmAnalysis);
      mlPrediction = this.mlModel.predictWithConfidence(mlFeatures);
    }

    // Safely extract rule-based probability and confidence
    const ruleBasedProb = ruleBasedResult.viralProbability / 100;
    const ruleBasedConf = ruleBasedResult.confidence ? ruleBasedResult.confidence / 100 : 0.5;

    // Combine all predictions
    const hybridProbability = this.combinePredictions(
      ruleBasedProb,
      mlPrediction ? mlPrediction.probability : ruleBasedProb,
      llmAnalysis.llmScore / 100
    );

    // Calculate enhanced confidence
    const confidence = this.calculateEnhancedConfidence(
      ruleBasedConf,
      mlPrediction ? mlPrediction.confidence : ruleBasedConf,
      llmAnalysis.llmEnabled ? 0.85 : 0.5, // LLM confidence
      hybridProbability
    );

    const processingTime = Date.now() - startTime;

    // Safely extract key factors
    const existingKeyFactors = Array.isArray(ruleBasedResult.keyFactors) 
      ? ruleBasedResult.keyFactors 
      : (ruleBasedResult.keyFactors ? [ruleBasedResult.keyFactors] : []);

    return {
      viralProbability: Math.round(hybridProbability * 100),
      confidence: Math.round(confidence * 100),
      category: this.categorizeViral(hybridProbability),
      expectedEngagement: this.calculateExpectedEngagement(hybridProbability, postData),
      
      // Component scores
      componentScores: {
        ruleBasedScore: ruleBasedResult.viralProbability,
        mlScore: mlPrediction ? Math.round(mlPrediction.probability * 100) : null,
        llmScore: llmAnalysis.llmScore,
        velocityScore: ruleBasedResult.componentScores?.velocityScore || 0,
        authorityScore: ruleBasedResult.componentScores?.authorityScore || 0,
        contentScore: ruleBasedResult.componentScores?.contentScore || 0,
        timingScore: ruleBasedResult.componentScores?.timingScore || 0
      },
      
      // Detailed analysis
      detailedAnalysis: {
        engagement: ruleBasedResult.detailedAnalysis?.engagement || {},
        content: ruleBasedResult.detailedAnalysis?.content || {},
        timing: ruleBasedResult.detailedAnalysis?.timing || {},
        authority: ruleBasedResult.detailedAnalysis?.authority || {},
        llmAnalysis: llmAnalysis,
        trending: await this.llmAnalyzer.getTrendingTopics(postData.text || '')
      },
      
      // Enhanced features
      enhancedFeatures: {
        mlModelAvailable: this.isMLModelLoaded,
        llmAnalysisEnabled: llmAnalysis.llmEnabled,
        hybridPrediction: true,
        processingTime: `${processingTime}ms`
      },
      
      // Metadata
      keyFactors: this.identifyKeyFactors(existingKeyFactors, llmAnalysis, hybridProbability),
      recommendations: this.generateRecommendations(hybridProbability, llmAnalysis, ruleBasedResult),
      predictionMethod: 'hybrid-v2'
    };
  }

  /**
   * Combine rule-based, ML, and LLM predictions
   */
  combinePredictions(ruleBasedProb, mlProb, llmProb) {
    if (!this.isMLModelLoaded) {
      // Rule-based + LLM only
      return (ruleBasedProb * 0.60) + (llmProb * 0.40);
    }
    
    // Full hybrid: Rule-based + ML + LLM
    return (ruleBasedProb * this.HYBRID_WEIGHTS.RULE_BASED) + 
           (mlProb * this.HYBRID_WEIGHTS.ML_BASED) + 
           (llmProb * this.HYBRID_WEIGHTS.LLM_BASED);
  }

  /**
   * Calculate enhanced confidence with LLM
   */
  calculateEnhancedConfidence(ruleBasedConf, mlConf, llmConf, hybridProb) {
    const baseConfidence = (ruleBasedConf + mlConf + llmConf) / 3;
    const agreementBonus = this.calculateAgreement(ruleBasedConf, mlConf, llmConf) * 0.15;
    const extremeBonus = Math.abs(hybridProb - 0.5) * 0.20;
    
    return Math.min(baseConfidence + agreementBonus + extremeBonus, 1.0);
  }

  /**
   * Calculate agreement between prediction methods
   */
  calculateAgreement(conf1, conf2, conf3) {
    const diffs = [
      Math.abs(conf1 - conf2),
      Math.abs(conf1 - conf3),
      Math.abs(conf2 - conf3)
    ];
    const avgDiff = diffs.reduce((a, b) => a + b) / diffs.length;
    return 1 - avgDiff; // Higher agreement = lower average difference
  }

  /**
   * Extract ML features including LLM analysis
   */
  extractMLFeatures(postData, ruleBasedResult, llmAnalysis) {
    const baseFeatures = [
      (ruleBasedResult.componentScores?.velocityScore || 0) / 100,
      ruleBasedResult.detailedAnalysis?.engagement?.momentum || 0,
      (ruleBasedResult.componentScores?.authorityScore || 0) / 100,
      Math.min((postData.creator?.follower_count || 1000) / 100000, 1),
      (ruleBasedResult.componentScores?.contentScore || 0) / 100,
      ruleBasedResult.detailedAnalysis?.content?.viralFormulaScore || 0,
      (ruleBasedResult.componentScores?.timingScore || 0) / 100,
      ruleBasedResult.detailedAnalysis?.content?.emotionalIntensity || 0,
      ruleBasedResult.detailedAnalysis?.content?.specificityScore || 0,
      ruleBasedResult.detailedAnalysis?.engagement?.earlyDetection || 0,
      this.getPostAgeHours(postData.created_time) / 24,
      Math.min((postData.interactions || 0) / 10000, 1)
    ];

    // Add LLM features
    const llmFeatures = [
      llmAnalysis.emotionalScore / 100,
      llmAnalysis.credibilityScore / 100,
      llmAnalysis.urgency / 100,
      llmAnalysis.socialProof / 100
    ];

    return [...baseFeatures, ...llmFeatures];
  }

  /**
   * Identify key factors from all analysis methods
   */
  identifyKeyFactors(existingFactors, llmAnalysis, hybridProb) {
    const factors = [...existingFactors];
    
    // Add probability-based factors
    if (hybridProb > 0.8) factors.push('Ultra-high viral potential detected');
    if (hybridProb > 0.6) factors.push('High viral potential');
    
    // Add LLM-based factors
    if (llmAnalysis.llmEnabled) {
      if (llmAnalysis.emotionalScore > 70) factors.push('High emotional appeal');
      if (llmAnalysis.urgency > 75) factors.push('Strong urgency indicators');
      if (llmAnalysis.socialProof > 65) factors.push('Social proof elements');
      if (llmAnalysis.trending > 70) factors.push('Trending topic alignment');
    }
    
    return factors;
  }

  /**
   * Generate enhanced recommendations
   */
  generateRecommendations(probability, llmAnalysis, ruleBasedResult) {
    const recommendations = [];
    
    // Basic recommendations based on probability
    if (probability < 0.3) {
      recommendations.push('Consider adding emotional hooks or urgency indicators');
      recommendations.push('Optimize posting timing for better engagement');
    } else if (probability > 0.7) {
      recommendations.push('Strong viral potential - consider maximum promotion');
      recommendations.push('Monitor early engagement for viral confirmation');
    }
    
    // LLM-based recommendations
    if (llmAnalysis.llmEnabled) {
      if (llmAnalysis.credibilityScore < 50) {
        recommendations.push('Add credibility indicators (statistics, sources)');
      }
      if (llmAnalysis.callToAction < 40) {
        recommendations.push('Add a clear call-to-action');
      }
      if (llmAnalysis.socialProof < 50) {
        recommendations.push('Include social proof elements');
      }
    }
    
    // Add existing recommendations if available
    if (ruleBasedResult.recommendations && Array.isArray(ruleBasedResult.recommendations)) {
      recommendations.push(...ruleBasedResult.recommendations);
    }
    
    return recommendations;
  }

  /**
   * Helper methods
   */
  categorizeViral(probability) {
    if (probability > 0.8) return 'Ultra Viral';
    if (probability > 0.6) return 'High Viral';
    if (probability > 0.4) return 'Moderate Viral';
    if (probability > 0.2) return 'Low Viral';
    return 'Minimal Viral';
  }

  calculateExpectedEngagement(probability, postData) {
    const baseEngagement = postData.interactions || 100;
    const followerMultiplier = Math.min((postData.creator?.follower_count || 1000) / 1000, 100);
    return Math.round(baseEngagement * (1 + probability * 10) * followerMultiplier);
  }

  getPostAgeHours(createdTime) {
    if (!createdTime) return 0;
    const now = new Date();
    const created = new Date(createdTime);
    return Math.max(0, (now - created) / (1000 * 60 * 60));
  }
}

module.exports = EnhancedViralPredictorV2;
