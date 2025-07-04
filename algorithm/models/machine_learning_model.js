/**
 * Machine Learning Model for Viral Prediction
 * Simple neural network implementation for viral probability optimization
 * Target: 90%+ accuracy through supervised learning
 */

const fs = require('fs');
const path = require('path');

class MachineLearningModel {
  constructor() {
    // Neural network architecture
    this.inputSize = 12;
    this.hiddenSize = 16;
    this.outputSize = 1;
    
    // Initialize weights randomly
    this.weights = {
      input_hidden: this.initializeMatrix(this.inputSize, this.hiddenSize),
      hidden_output: this.initializeMatrix(this.hiddenSize, this.outputSize),
      hidden_bias: this.initializeArray(this.hiddenSize),
      output_bias: this.initializeArray(this.outputSize)
    };
    
    // Training parameters
    this.learningRate = 0.01;
    this.epochs = 1000;
    this.trainingHistory = [];
    
    // Model performance metrics
    this.accuracy = 0;
    this.loss = 0;
    this.validationAccuracy = 0;
  }

  /**
   * Initialize weight matrix with random values
   */
  initializeMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = (Math.random() - 0.5) * 0.5; // Xavier initialization
      }
    }
    return matrix;
  }

  /**
   * Initialize bias array with random values
   */
  initializeArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
      array[i] = (Math.random() - 0.5) * 0.1;
    }
    return array;
  }

  /**
   * Sigmoid activation function
   */
  sigmoid(x) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
  }

  /**
   * Sigmoid derivative
   */
  sigmoidDerivative(x) {
    return x * (1 - x);
  }

  /**
   * Forward propagation
   */
  forward(inputs) {
    // Input to hidden layer
    const hidden = [];
    for (let i = 0; i < this.hiddenSize; i++) {
      let sum = this.weights.hidden_bias[i];
      for (let j = 0; j < this.inputSize; j++) {
        sum += inputs[j] * this.weights.input_hidden[j][i];
      }
      hidden[i] = this.sigmoid(sum);
    }

    // Hidden to output layer
    const output = [];
    for (let i = 0; i < this.outputSize; i++) {
      let sum = this.weights.output_bias[i];
      for (let j = 0; j < this.hiddenSize; j++) {
        sum += hidden[j] * this.weights.hidden_output[j][i];
      }
      output[i] = this.sigmoid(sum);
    }

    return { hidden, output };
  }

  /**
   * Backward propagation
   */
  backward(inputs, target, forwardResult) {
    const { hidden, output } = forwardResult;
    
    // Calculate output error
    const outputErrors = [];
    for (let i = 0; i < this.outputSize; i++) {
      outputErrors[i] = (target[i] - output[i]) * this.sigmoidDerivative(output[i]);
    }

    // Calculate hidden layer errors
    const hiddenErrors = [];
    for (let i = 0; i < this.hiddenSize; i++) {
      let error = 0;
      for (let j = 0; j < this.outputSize; j++) {
        error += outputErrors[j] * this.weights.hidden_output[i][j];
      }
      hiddenErrors[i] = error * this.sigmoidDerivative(hidden[i]);
    }

    // Update hidden to output weights
    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        this.weights.hidden_output[i][j] += this.learningRate * outputErrors[j] * hidden[i];
      }
    }

    // Update output bias
    for (let i = 0; i < this.outputSize; i++) {
      this.weights.output_bias[i] += this.learningRate * outputErrors[i];
    }

    // Update input to hidden weights
    for (let i = 0; i < this.inputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        this.weights.input_hidden[i][j] += this.learningRate * hiddenErrors[j] * inputs[i];
      }
    }

    // Update hidden bias
    for (let i = 0; i < this.hiddenSize; i++) {
      this.weights.hidden_bias[i] += this.learningRate * hiddenErrors[i];
    }
  }

  /**
   * Train the model
   */
  train(trainingData, validationData = null) {
    console.log('🔄 Starting ML model training...');
    console.log(`Training samples: ${trainingData.length}`);
    console.log(`Epochs: ${this.epochs}`);
    console.log(`Learning rate: ${this.learningRate}`);
    
    let finalTotalLoss = 0;
    let finalCorrect = 0;
    
    for (let epoch = 0; epoch < this.epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;
      
      // Shuffle training data
      const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
      
      for (const sample of shuffled) {
        const { features, probability } = sample;
        const target = [probability];
        
        // Forward pass
        const forwardResult = this.forward(features);
        const prediction = forwardResult.output[0];
        
        // Calculate loss (Mean Squared Error)
        const loss = Math.pow(target[0] - prediction, 2);
        totalLoss += loss;
        
        // Check accuracy (within 0.2 threshold)
        if (Math.abs(prediction - target[0]) < 0.2) {
          correct++;
        }
        
        // Backward pass
        this.backward(features, target, forwardResult);
      }
      
      // Calculate metrics
      const avgLoss = totalLoss / trainingData.length;
      const accuracy = (correct / trainingData.length) * 100;
      
      // Store final metrics
      finalTotalLoss = totalLoss;
      finalCorrect = correct;
      
      // Validation
      let valAccuracy = 0;
      if (validationData && epoch % 100 === 0) {
        valAccuracy = this.evaluate(validationData);
      }
      
      // Store training history
      this.trainingHistory.push({
        epoch,
        loss: avgLoss,
        accuracy,
        validationAccuracy: valAccuracy
      });
      
      // Log progress
      if (epoch % 100 === 0) {
        console.log(`Epoch ${epoch}: Loss=${avgLoss.toFixed(4)}, Accuracy=${accuracy.toFixed(2)}%, Val Accuracy=${valAccuracy.toFixed(2)}%`);
      }
      
      // Early stopping if converged
      if (avgLoss < 0.01 && accuracy > 90) {
        console.log(`🎯 Early stopping at epoch ${epoch} - Target accuracy reached!`);
        break;
      }
    }
    
    // Set final metrics
    this.loss = finalTotalLoss / trainingData.length;
    this.accuracy = (finalCorrect / trainingData.length) * 100;
    
    console.log('✅ Training completed!');
    console.log(`Final accuracy: ${this.accuracy.toFixed(2)}%`);
    console.log(`Final loss: ${this.loss.toFixed(4)}`);
    
    return {
      accuracy: this.accuracy,
      loss: this.loss,
      history: this.trainingHistory
    };
  }

  /**
   * Evaluate model on test data
   */
  evaluate(testData) {
    let correct = 0;
    let totalLoss = 0;
    
    for (const sample of testData) {
      const { features, probability } = sample;
      const prediction = this.predict(features);
      
      // Calculate loss
      const loss = Math.pow(probability - prediction, 2);
      totalLoss += loss;
      
      // Check accuracy
      if (Math.abs(prediction - probability) < 0.2) {
        correct++;
      }
    }
    
    const accuracy = (correct / testData.length) * 100;
    const avgLoss = totalLoss / testData.length;
    
    this.validationAccuracy = accuracy;
    
    return accuracy;
  }

  /**
   * Make prediction
   */
  predict(features) {
    const result = this.forward(features);
    return result.output[0];
  }

  /**
   * Predict with confidence
   */
  predictWithConfidence(features) {
    const prediction = this.predict(features);
    
    // Calculate confidence based on how close to 0 or 1 the prediction is
    const confidence = Math.abs(prediction - 0.5) * 2;
    
    return {
      probability: prediction,
      confidence: Math.min(confidence, 1.0)
    };
  }

  /**
   * Save model to file
   */
  saveModel(filename = 'viral_ml_model.json') {
    const modelPath = path.join(__dirname, '../data/processed', filename);
    
    // Ensure directory exists
    const dir = path.dirname(modelPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const modelData = {
      weights: this.weights,
      architecture: {
        inputSize: this.inputSize,
        hiddenSize: this.hiddenSize,
        outputSize: this.outputSize
      },
      performance: {
        accuracy: this.accuracy,
        loss: this.loss,
        validationAccuracy: this.validationAccuracy
      },
      trainingHistory: this.trainingHistory,
      metadata: {
        saved_at: new Date().toISOString(),
        version: '2.2.0'
      }
    };
    
    fs.writeFileSync(modelPath, JSON.stringify(modelData, null, 2));
    console.log(`✅ Model saved to ${modelPath}`);
    
    return modelPath;
  }

  /**
   * Load model from file
   */
  loadModel(filename = 'viral_ml_model.json') {
    const modelPath = path.join(__dirname, '../data/processed', filename);
    
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model not found: ${modelPath}`);
    }
    
    const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
    
    this.weights = modelData.weights;
    this.inputSize = modelData.architecture.inputSize;
    this.hiddenSize = modelData.architecture.hiddenSize;
    this.outputSize = modelData.architecture.outputSize;
    this.accuracy = modelData.performance.accuracy;
    this.loss = modelData.performance.loss;
    this.validationAccuracy = modelData.performance.validationAccuracy;
    this.trainingHistory = modelData.trainingHistory;
    
    console.log(`✅ Model loaded from ${modelPath}`);
    console.log(`Model accuracy: ${this.accuracy.toFixed(2)}%`);
    
    return modelData;
  }
}

module.exports = MachineLearningModel;
