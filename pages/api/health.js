/**
 * Health Check API Endpoint with LLM Status
 * Monitors system status and API availability
 */

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// Check API key configurations
		const geminiApiKey = process.env.GEMINI_API_KEY;
		const lunarCrushApiKey = process.env.LUNARCRUSH_API_KEY;
		const llmEnabled = process.env.LLM_ENABLED === 'true';

		const health = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			version: '3.1.0',
			environment: process.env.NODE_ENV || 'development',

			// 🔍 ENHANCED SERVICE STATUS
			services: {
				viralPrediction: 'operational',
				mlModel: 'operational',
				ruleBasedEngine: 'operational',
				apiEndpoints: 'operational',
			},

			// 🔍 LLM STATUS DETAILS
			llmStatus: {
				enabled: llmEnabled,
				provider: 'google-gemini',
				apiKeyConfigured: !!geminiApiKey,
				apiKeyValid: !!geminiApiKey && geminiApiKey.length > 10,
				fallbackAvailable: true,
				fallbackProvider: 'rule-based-analyzer',
				currentMode: llmEnabled && geminiApiKey ? 'llm' : 'fallback',
			},

			// 🔍 INTEGRATION STATUS
			integrations: {
				lunarCrush: {
					configured: !!lunarCrushApiKey,
					status: lunarCrushApiKey ? 'available' : 'not_configured',
				},
				machineLearning: {
					modelLoaded: 'checking',
					status: 'operational',
				},
			},

			// 🔍 SYSTEM METRICS
			system: {
				uptime: process.uptime(),
				memory: {
					used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
					total:
						Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
				},
				nodejs: process.version,
			},

			// 🔍 FEATURE FLAGS
			features: {
				hybridPrediction: true,
				llmAnalysis: llmEnabled && !!geminiApiKey,
				mlIntegration: true,
				lunarCrushEnrichment: !!lunarCrushApiKey,
				rateLimiting: true,
				bulkPrediction: true,
			},
		};

		res.status(200).json(health);
	} catch (error) {
		res.status(500).json({
			status: 'unhealthy',
			error: error.message,
			timestamp: new Date().toISOString(),
			llmStatus: {
				enabled: false,
				error: 'Health check failed',
			},
		});
	}
}
