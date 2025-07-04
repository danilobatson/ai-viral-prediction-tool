/**
 * Cross-Validation System for AI Viral Prediction Tool
 * Simplified version for Phase 2.3 validation
 */

class CrossValidator {
    constructor(kFolds = 5) {
        this.kFolds = kFolds;
        this.validationResults = [];
    }

    /**
     * Perform simplified cross-validation
     */
    async performSimplifiedValidation(dataset, ModelClass) {
        console.log(`🔄 Starting ${this.kFolds}-fold cross-validation...`);
        
        // Shuffle dataset
        const shuffledData = this.shuffleArray([...dataset]);
        const foldSize = Math.floor(shuffledData.length / this.kFolds);
        
        let totalAccuracy = 0;
        
        for (let fold = 0; fold < this.kFolds; fold++) {
            console.log(`\n📊 Processing Fold ${fold + 1}/${this.kFolds}...`);
            
            // Split data
            const { trainSet, validationSet } = this.createFoldSplit(shuffledData, fold, foldSize);
            
            // Train model
            const model = new ModelClass();
            model.train(trainSet);
            
            // Evaluate
            const accuracy = this.evaluateModel(model, validationSet);
            totalAccuracy += accuracy;
            
            console.log(`✅ Fold ${fold + 1} Accuracy: ${accuracy.toFixed(2)}%`);
        }
        
        const avgAccuracy = totalAccuracy / this.kFolds;
        console.log(`\n🏆 Average Accuracy: ${avgAccuracy.toFixed(2)}%`);
        
        return { averageAccuracy: avgAccuracy / 100 };
    }
    
    /**
     * Create fold split
     */
    createFoldSplit(data, currentFold, foldSize) {
        const start = currentFold * foldSize;
        const end = (currentFold === this.kFolds - 1) ? data.length : start + foldSize;
        
        const validationSet = data.slice(start, end);
        const trainSet = [...data.slice(0, start), ...data.slice(end)];
        
        return { trainSet, validationSet };
    }
    
    /**
     * Evaluate model
     */
    evaluateModel(model, validationSet) {
        let correct = 0;
        
        for (const sample of validationSet) {
            const prediction = model.predict(sample.features);
            const actual = sample.probability;
            
            // Check if prediction is within 0.2 threshold
            if (Math.abs(prediction - actual) < 0.2) {
                correct++;
            }
        }
        
        return (correct / validationSet.length) * 100;
    }
    
    /**
     * Shuffle array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

module.exports = CrossValidator;
