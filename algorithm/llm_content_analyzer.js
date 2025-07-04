/**
 * LLM Content Analyzer with Fallback
 * Uses Google Gemini when available, falls back to rule-based analysis
 */

const LLMContentAnalyzerFallback = require('./llm_content_analyzer_fallback');

class LLMContentAnalyzer {
	constructor() {
		this.apiKey = process.env.GOOGLE_GEMINI_API_KEY;
		this.enabled = process.env.LLM_ENABLED === 'true' && this.apiKey;
		this.fallback = new LLMContentAnalyzerFallback();

		if (this.enabled) {
			try {
				const { GoogleGenerativeAI } = require('@google/generative-ai');
				this.genAI = new GoogleGenerativeAI(this.apiKey);
				this.model = this.genAI.getGenerativeModel({
					model: 'gemini-2.0-flash-lite',
				});
				console.log('✅ Google Gemini LLM initialized');
			} catch (error) {
				console.warn(
					'⚠️ LLM initialization failed, using fallback:',
					error.message
				);
				this.enabled = false;
			}
		} else {
			console.log('ℹ️ LLM disabled - using rule-based fallback analyzer');
		}
	}

	async analyzeContent(text) {
		if (!this.enabled) {
			return await this.fallback.analyzeContent(text);
		}

		try {
			const prompt = `
Analyze this social media post for viral potential in the crypto/finance space.
Focus on emotional appeal, credibility indicators, and engagement triggers.

Post: "${text}"

Return your analysis in this exact JSON format:
{
  "emotionalScore": 0-100,
  "credibilityScore": 0-100,
  "engagementTriggers": ["trigger1", "trigger2"],
  "viralElements": ["element1", "element2"],
  "sentiment": "positive/negative/neutral",
  "urgency": 0-100,
  "specificity": 0-100,
  "socialProof": 0-100,
  "callToAction": 0-100,
  "trending": 0-100
}

Only return the JSON, no additional text.
`;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const analysis = JSON.parse(response.text());

			const llmScore = this.calculateLLMScore(analysis);

			return {
				...analysis,
				llmScore,
				llmEnabled: true,
				processingTime: Date.now(),
			};
		} catch (error) {
			console.warn('⚠️ LLM analysis failed, using fallback:', error.message);
			return await this.fallback.analyzeContent(text);
		}
	}

	calculateLLMScore(analysis) {
		const weights = {
			emotionalScore: 0.25,
			credibilityScore: 0.2,
			urgency: 0.15,
			specificity: 0.1,
			socialProof: 0.1,
			callToAction: 0.1,
			trending: 0.1,
		};

		let score = 0;
		Object.entries(weights).forEach(([key, weight]) => {
			score += (analysis[key] || 0) * weight;
		});

		return Math.round(score);
	}

	async getTrendingTopics(text) {
		if (!this.enabled) {
			return await this.fallback.getTrendingTopics(text);
		}

		try {
			const prompt = `
Extract trending topics and hashtags from this crypto post that could contribute to viral potential:

Post: "${text}"

Return as JSON array of strings (max 10 topics):
["topic1", "topic2", "topic3"]

Only return the JSON array, no additional text.
`;

			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const topics = JSON.parse(response.text());

			return Array.isArray(topics) ? topics : ['general'];
		} catch (error) {
			console.warn(
				'⚠️ Trending topics analysis failed, using fallback:',
				error.message
			);
			return await this.fallback.getTrendingTopics(text);
		}
	}

	async batchAnalyze(posts) {
		if (!this.enabled) {
			return await this.fallback.batchAnalyze(posts);
		}

		const analyses = await Promise.all(
			posts.map(async (post) => {
				try {
					return await this.analyzeContent(post.text || post.content || '');
				} catch (error) {
					console.warn(
						'⚠️ Batch analysis error, using fallback:',
						error.message
					);
					return await this.fallback.analyzeContent(
						post.text || post.content || ''
					);
				}
			})
		);

		return analyses;
	}
}

module.exports = LLMContentAnalyzer;
