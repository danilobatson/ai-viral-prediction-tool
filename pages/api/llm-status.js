/**
 * LLM Status Check Endpoint
 * Dedicated endpoint for checking LLM configuration and status
 */

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
		const llmEnabled = process.env.LLM_ENABLED === 'true';

		const llmStatus = {
			timestamp: new Date().toISOString(),

			// 🔍 PRIMARY LLM STATUS
			llm: {
				enabled: llmEnabled,
				provider: 'google-gemini',
				model: 'gemini-2.0-flash-lite',
				tier: 'free',
				apiKeyConfigured: !!geminiApiKey,
				apiKeyValid: !!geminiApiKey && geminiApiKey.length > 10,
				status: llmEnabled && geminiApiKey ? 'active' : 'inactive',
			},

			// 🔍 FALLBACK STATUS
			fallback: {
				available: true,
				provider: 'rule-based-analyzer',
				status: 'always-active',
				accuracy: 'moderate',
				speed: 'fast',
			},

			// 🔍 ANALYSIS CAPABILITIES
			capabilities: {
				emotionalAnalysis: true,
				credibilityScoring: true,
				trendingTopics: true,
				engagementTriggers: true,
				sentimentAnalysis: true,
				urgencyDetection: true,
				socialProofAnalysis: true,
			},

			// 🔍 CONFIGURATION GUIDE
			configuration: {
				howToEnable: 'Set LLM_ENABLED=true and GOOGLE_GEMINI_API_KEY in .env',
				apiKeySource: 'https://makersuite.google.com/',
				costInfo:
					'Google Gemini 1.5 Flash is free up to 15 requests per minute',
				fallbackBehavior:
					'System automatically uses rule-based analysis if LLM fails',
			},
		};

		res.status(200).json(llmStatus);
	} catch (error) {
		res.status(500).json({
			error: 'LLM status check failed',
			message: error.message,
			timestamp: new Date().toISOString(),
		});
	}
}
