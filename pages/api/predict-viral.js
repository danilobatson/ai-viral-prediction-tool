/**
 * Main Viral Prediction API Endpoint v2
 * Integrates with LunarCrush API, ML model, and LLM analysis
 */

import cors from 'cors';
import axios from 'axios';

const EnhancedViralPredictorV2 = require('../../algorithm/models/enhanced_viral_predictor_v2');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com', 'https://lunarcrush.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true
};

// Rate limiting
const rateLimitStore = new Map();
const RATE_LIMIT = 60;
const RATE_WINDOW = 60 * 1000;

function rateLimitMiddleware(req, res, next) {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (!rateLimitStore.has(clientIP)) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }

  const clientData = rateLimitStore.get(clientIP);

  if (now > clientData.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }

  if (clientData.count >= RATE_LIMIT) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Too many requests. Limit: ${RATE_LIMIT} requests per minute`,
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }

  clientData.count++;
  next();
}

// Initialize predictor
let predictor = null;

async function initializePredictor() {
  if (!predictor) {
    try {
      predictor = new EnhancedViralPredictorV2();
      await predictor.initializeMLModel();
      console.log('✅ Enhanced Viral Predictor V2 initialized');
    } catch (error) {
      console.error('❌ Failed to initialize predictor:', error);
      throw error;
    }
  }
  return predictor;
}

export default async function handler(req, res) {
  // Apply CORS
  await new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Apply rate limiting
  await new Promise((resolve, reject) => {
    rateLimitMiddleware(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    const viralPredictor = await initializePredictor();
    const { postData, options = {} } = req.body;

    if (!postData) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'postData is required in request body'
      });
    }

    // Check API key status
    const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const lunarCrushApiKey = process.env.LUNARCRUSH_API_KEY;
    const llmEnabled = process.env.LLM_ENABLED === 'true';

    // Enrich with LunarCrush data if requested
    let enrichedPostData = postData;
    let lunarCrushEnrichment = {
      requested: !!options.enrichWithLunarCrush,
      successful: false,
      error: null
    };

    if (options.enrichWithLunarCrush && postData.symbol) {
      try {
        const lunarCrushResponse = await axios.get(
          `https://lunarcrush.com/api4/public/coins/${postData.symbol}/v1`,
          {
            headers: { 'Authorization': `Bearer ${lunarCrushApiKey}` },
            timeout: 5000
          }
        );

        enrichedPostData = {
          ...postData,
          lunarCrushData: lunarCrushResponse.data
        };
        lunarCrushEnrichment.successful = true;
      } catch (lunarCrushError) {
        console.warn('⚠️ LunarCrush API enrichment failed:', lunarCrushError.message);
        lunarCrushEnrichment.error = lunarCrushError.message;
      }
    }

    // Make prediction with V2 predictor (includes LLM analysis)
    const startTime = Date.now();
    const prediction = await viralPredictor.predictViral(enrichedPostData);
    const predictionTime = Date.now() - startTime;

    // Format response with enhanced LLM status indicators
    const response = {
      success: true,
      prediction: {
        viralProbability: prediction.viralProbability,
        confidence: prediction.confidence,
        category: prediction.category,
        expectedEngagement: prediction.expectedEngagement
      },
      analysis: {
        componentScores: prediction.componentScores,
        detailedAnalysis: prediction.detailedAnalysis,
        keyFactors: prediction.keyFactors,
        recommendations: prediction.recommendations
      },

      // 🔍 ENHANCED LLM STATUS SECTION
      llmStatus: {
        enabled: llmEnabled,
        apiKeyConfigured: !!geminiApiKey,
        apiKeyValid: !!geminiApiKey && geminiApiKey.length > 10,
        activeProvider: geminiApiKey ? 'google-gemini' : 'rule-based-fallback',
        analysisMethod: prediction.detailedAnalysis?.llmAnalysis?.llmEnabled ? 'llm' : 'fallback',
        llmScore: prediction.detailedAnalysis?.llmAnalysis?.llmScore || null,
        processingTime: prediction.detailedAnalysis?.llmAnalysis?.processingTime || 0,
        fallbackReason: !prediction.detailedAnalysis?.llmAnalysis?.llmEnabled ? 'API key not configured or invalid' : null
      },

      // 🔍 ENHANCED SYSTEM STATUS SECTION
      systemStatus: {
        mlModelAvailable: prediction.enhancedFeatures?.mlModelAvailable || false,
        hybridPrediction: prediction.enhancedFeatures?.hybridPrediction || false,
        predictionMethod: prediction.predictionMethod || 'rule-based',
        lunarCrushIntegration: {
          apiKeyConfigured: !!lunarCrushApiKey,
          enrichmentStatus: lunarCrushEnrichment
        }
      },

      // 🔍 ENHANCED FEATURES SECTION
      enhancedFeatures: {
        ...prediction.enhancedFeatures,
        totalProcessingTime: `${predictionTime}ms`,
        apiVersion: '3.1.0',
        featureFlags: {
          llmAnalysis: prediction.detailedAnalysis?.llmAnalysis?.llmEnabled || false,
          mlPrediction: prediction.enhancedFeatures?.mlModelAvailable || false,
          lunarCrushEnrichment: lunarCrushEnrichment.successful,
          hybridScoring: true
        }
      },

      metadata: {
        predictionTime: `${predictionTime}ms`,
        predictionMethod: prediction.predictionMethod || 'hybrid-v2',
        modelVersion: '3.1.0',
        timestamp: new Date().toISOString(),
        apiEndpoint: '/api/predict-viral',
        requestId: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    };

    console.log(`✅ V2 Prediction completed in ${predictionTime}ms - Probability: ${prediction.viralProbability}% - LLM: ${response.llmStatus.analysisMethod}`);
    res.status(200).json(response);

  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({
      error: 'Prediction failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      llmStatus: {
        enabled: process.env.LLM_ENABLED === 'true',
        apiKeyConfigured: !!process.env.GOOGLE_GEMINI_API_KEY,
        error: 'Prediction service unavailable'
      },
      timestamp: new Date().toISOString()
    });
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' },
    responseLimit: '2mb',
  },
}
