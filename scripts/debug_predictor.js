/**
 * Debug the original viral predictor to see its output structure
 */

const ViralPredictor = require('../algorithm/viral_predictor');

const predictor = new ViralPredictor();

const testPost = {
  text: "🚀 Bitcoin just hit $100K! This is the moment we've all been waiting for! #BTC #Crypto #ToTheMoon",
  creator: {
    follower_count: 75000,
    verified: true
  },
  interactions: 5000,
  created_time: new Date().toISOString()
};

console.log('🔍 Testing original viral predictor...\n');

const result = predictor.predictViral(testPost);

console.log('📊 Original Predictor Output:');
console.log(JSON.stringify(result, null, 2));

console.log('\n🔍 Key Properties:');
console.log('viralProbability:', result.viralProbability);
console.log('confidence:', result.confidence);
console.log('keyFactors:', result.keyFactors);
console.log('keyFactors type:', typeof result.keyFactors);
console.log('keyFactors isArray:', Array.isArray(result.keyFactors));
console.log('componentScores:', result.componentScores);
console.log('detailedAnalysis:', result.detailedAnalysis);
