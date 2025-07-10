// Centralized Gemini configuration for consistency
export const GEMINI_CONFIG = {
	// Use consistent model across all endpoints
	model: 'gemini-2.0-flash-lite',

	// Optimized generation configs for different use cases
	viralAnalysis: {
		temperature: 0.7,
		topK: 40,
		topP: 0.95,
		maxOutputTokens: 2048,
	},

	orchestration: {
		temperature: 0.3, // Lower for more consistent tool selection
		topK: 20,
		topP: 0.8,
		maxOutputTokens: 512,
	},

	marketing: {
		temperature: 0.8, // Higher for creative marketing insights
		topK: 50,
		topP: 0.95,
		maxOutputTokens: 1024,
	},
};

// Helper to create model with config
export function createGeminiModel(genAI, configType = 'viralAnalysis') {
	return genAI.getGenerativeModel({
		model: GEMINI_CONFIG.model,
		generationConfig: GEMINI_CONFIG[configType],
	});
}
