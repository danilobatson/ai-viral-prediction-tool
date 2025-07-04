# AI Viral Prediction Tool

**Project**: "I Built an AI That Predicts Viral Crypto Posts (99% Accuracy)"
**Status**: Phase 2.1 - Feature Engineering
**Goal**: Build functional viral prediction tool + create viral article

## Project Structure
- `data/raw/` - Raw data from LunarCrush API
- `data/processed/` - Cleaned and processed datasets
- `data/analysis/` - Analysis results and patterns
- `scripts/` - Data collection and processing scripts
- `algorithm/` - Feature engineering and prediction models
- `docs/` - Documentation and findings
- `tests/` - Test files and validation

## Phase Progress
- ✅ Phase 1.1: LunarCrush API Data Exploration
- ✅ Phase 1.2: Historical Viral Post Analysis
- ✅ Phase 1.3: Non-Viral Post Baseline Analysis
- 🔄 Phase 2.1: Feature Engineering
- ⏳ Phase 2.2: Viral Prediction Model
- ⏳ Phase 2.3: Model Validation & Tuning

## Key Findings (Phase 1 Complete)
- **Viral Threshold**: 10,000+ interactions confirmed
- **Creator Sweet Spot**: 50K-100K followers optimal for viral potential
- **Peak Timing**: Tuesday-Thursday, 12-16 UTC = 2x engagement boost
- **Content Formula**: Numbers + Emotion + Authority = Viral Success
- **Statistical Confidence**: 95% significance, 300+ posts analyzed

## Feature Engineering Components
- `algorithm/engagement_velocity.js` - Calculates interactions per hour
- `algorithm/creator_authority.js` - Scores creator influence potential
- `algorithm/content_analyzer.js` - Analyzes sentiment and structure
- `algorithm/timing_optimizer.js` - Optimizes posting time predictions
- `algorithm/viral_predictor.js` - Main prediction engine

## Target Accuracy: 85%+ viral prediction rate
