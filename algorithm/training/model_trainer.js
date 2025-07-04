/**
 * Model Trainer for Viral Prediction ML
 * Trains and optimizes the machine learning model
 * Target: 90%+ accuracy
 */

const DatasetGenerator = require('./dataset_generator');
const MachineLearningModel = require('../models/machine_learning_model');

class ModelTrainer {
  constructor() {
    this.datasetGenerator = new DatasetGenerator();
    this.mlModel = new MachineLearningModel();
    this.trainingResults = null;
  }

  /**
   * Complete training pipeline
   */
  async trainModel() {
    console.log('🚀 Starting Model Training Pipeline...\n');
    
    try {
      // Step 1: Generate or load dataset
      console.log('📊 Step 1: Preparing dataset...');
      const dataset = await this.datasetGenerator.generateTrainingData();
      await this.datasetGenerator.saveDataset();
      
      // Step 2: Train ML model
      console.log('\n🧠 Step 2: Training ML model...');
      this.trainingResults = this.mlModel.train(dataset.training, dataset.test);
      
      // Step 3: Evaluate model
      console.log('\n📈 Step 3: Evaluating model...');
      const testAccuracy = this.mlModel.evaluate(dataset.test);
      
      // Step 4: Save trained model
      console.log('\n💾 Step 4: Saving model...');
      const modelPath = this.mlModel.saveModel();
      
      // Step 5: Performance report
      console.log('\n📋 Step 5: Performance Report');
      this.generatePerformanceReport(testAccuracy);
      
      return {
        success: true,
        accuracy: testAccuracy,
        modelPath,
        trainingResults: this.trainingResults
      };
      
    } catch (error) {
      console.error('❌ Training failed:', error);
      throw error;
    }
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(testAccuracy) {
    console.log('\n🎯 VIRAL PREDICTION ML MODEL - PERFORMANCE REPORT');
    console.log('=' .repeat(60));
    
    console.log(`\n📊 ACCURACY METRICS:`);
    console.log(`Training Accuracy: ${this.trainingResults.accuracy.toFixed(2)}%`);
    console.log(`Test Accuracy: ${testAccuracy.toFixed(2)}%`);
    console.log(`Validation Accuracy: ${this.mlModel.validationAccuracy.toFixed(2)}%`);
    
    console.log(`\n📉 LOSS METRICS:`);
    console.log(`Final Loss: ${this.trainingResults.loss.toFixed(4)}`);
    
    console.log(`\n🎯 TARGET ACHIEVEMENT:`);
    const targetMet = testAccuracy >= 90;
    console.log(`Target (90%+ accuracy): ${targetMet ? '✅ ACHIEVED' : '❌ NOT MET'}`);
    
    if (targetMet) {
      console.log(`🏆 CONGRATULATIONS! Phase 2.2 TARGET ACHIEVED!`);
      console.log(`🚀 Ready for Phase 2.3 - Model Integration`);
    } else {
      console.log(`🔄 Consider adjusting hyperparameters or adding more training data`);
    }
    
    console.log(`\n📈 TRAINING PROGRESS:`);
    const history = this.trainingResults.history;
    if (history.length > 0) {
      const firstEpoch = history[0];
      const lastEpoch = history[history.length - 1];
      console.log(`Initial Accuracy: ${firstEpoch.accuracy.toFixed(2)}%`);
      console.log(`Final Accuracy: ${lastEpoch.accuracy.toFixed(2)}%`);
      console.log(`Improvement: +${(lastEpoch.accuracy - firstEpoch.accuracy).toFixed(2)}%`);
    }
    
    console.log('\n=' .repeat(60));
  }

  /**
   * Test model with sample predictions
   */
  async testSamplePredictions() {
    console.log('\n🧪 Testing Sample Predictions...');
    
    // Load or generate test data
    const testCases = [
      {
        name: 'High Viral Potential',
        features: [0.95, 0.8, 0.85, 0.7, 0.9, 0.8, 2.5, 0.9, 0.8, 0.9, 0.1, 0.8],
        expected: 0.85
      },
      {
        name: 'Low Viral Potential',
        features: [0.1, 0.2, 0.3, 0.1, 0.2, 0.3, 0.5, 0.2, 0.3, 0.1, 0.5, 0.1],
        expected: 0.15
      },
      {
        name: 'Moderate Viral Potential',
        features: [0.5, 0.6, 0.5, 0.4, 0.6, 0.5, 1.2, 0.5, 0.6, 0.4, 0.3, 0.5],
        expected: 0.55
      }
    ];
    
    for (const testCase of testCases) {
      const prediction = this.mlModel.predictWithConfidence(testCase.features);
      const accuracy = Math.abs(prediction.probability - testCase.expected) < 0.2;
      
      console.log(`\n${testCase.name}:`);
      console.log(`  Expected: ${(testCase.expected * 100).toFixed(1)}%`);
      console.log(`  Predicted: ${(prediction.probability * 100).toFixed(1)}%`);
      console.log(`  Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
      console.log(`  Result: ${accuracy ? '✅ ACCURATE' : '❌ INACCURATE'}`);
    }
  }

  /**
   * Cross-validation training
   */
  async crossValidateModel(kFolds = 5) {
    console.log(`\n🔄 Performing ${kFolds}-fold cross-validation...`);
    
    const dataset = await this.datasetGenerator.generateTrainingData();
    const allData = [...dataset.training, ...dataset.test];
    
    // Shuffle data
    const shuffled = allData.sort(() => Math.random() - 0.5);
    const foldSize = Math.floor(shuffled.length / kFolds);
    
    const accuracies = [];
    
    for (let i = 0; i < kFolds; i++) {
      console.log(`\nFold ${i + 1}/${kFolds}:`);
      
      // Split data
      const testStart = i * foldSize;
      const testEnd = testStart + foldSize;
      const testData = shuffled.slice(testStart, testEnd);
      const trainData = [...shuffled.slice(0, testStart), ...shuffled.slice(testEnd)];
      
      // Train model
      const foldModel = new MachineLearningModel();
      foldModel.epochs = 500; // Reduce epochs for cross-validation
      foldModel.train(trainData);
      
      // Evaluate
      const accuracy = foldModel.evaluate(testData);
      accuracies.push(accuracy);
      
      console.log(`  Fold accuracy: ${accuracy.toFixed(2)}%`);
    }
    
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const stdDev = Math.sqrt(accuracies.reduce((a, b) => a + Math.pow(b - avgAccuracy, 2), 0) / accuracies.length);
    
    console.log(`\n📊 Cross-Validation Results:`);
    console.log(`Average Accuracy: ${avgAccuracy.toFixed(2)}%`);
    console.log(`Standard Deviation: ${stdDev.toFixed(2)}%`);
    console.log(`95% Confidence Interval: ${(avgAccuracy - 1.96 * stdDev).toFixed(2)}% - ${(avgAccuracy + 1.96 * stdDev).toFixed(2)}%`);
    
    return {
      averageAccuracy: avgAccuracy,
      standardDeviation: stdDev,
      individualAccuracies: accuracies
    };
  }
}

module.exports = ModelTrainer;

// Example usage
if (require.main === module) {
  const trainer = new ModelTrainer();
  
  trainer.trainModel()
    .then(async (results) => {
      console.log('\n🎉 Training completed successfully!');
      
      // Test sample predictions
      await trainer.testSamplePredictions();
      
      // Optional: Run cross-validation
      // await trainer.crossValidateModel();
      
      console.log('\n🚀 Ready for Phase 2.3 - Model Integration!');
    })
    .catch(error => {
      console.error('❌ Training failed:', error);
    });
}
