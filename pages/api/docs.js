/**
 * API Documentation Endpoint
 * Provides interactive API documentation
 */

export default function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const documentation = {
		title: 'AI Viral Probability Analysis API',
		version: '3.1.0',
		description:
			'Advanced viral probability estimation API with ML integration',
		baseUrl:
			process.env.NODE_ENV === 'production'
				? 'https://your-domain.com/api'
				: 'http://localhost:3001/api',

		endpoints: {
			'/predict-viral': {
				method: 'POST',
				description: 'Predict viral potential of a single post',
				parameters: {
					postData: {
						type: 'object',
						required: true,
						properties: {
							text: { type: 'string', description: 'Post content' },
							creator: {
								type: 'object',
								properties: {
									follower_count: { type: 'number' },
									verified: { type: 'boolean' },
								},
							},
							interactions: {
								type: 'number',
								description: 'Current interactions',
							},
							created_time: { type: 'string', format: 'ISO 8601' },
						},
					},
					options: {
						type: 'object',
						properties: {
							enrichWithLunarCrush: { type: 'boolean', default: false },
						},
					},
				},
				response: {
					prediction: {
						viralProbability: {
							type: 'number',
							description: 'Probability 0-100%',
						},
						confidence: {
							type: 'number',
							description: 'Confidence score 0-100%',
						},
						category: { type: 'string', description: 'Viral category' },
					},
				},
			},

			'/predict-bulk': {
				method: 'POST',
				description: 'Predict viral potential for multiple posts',
				parameters: {
					posts: {
						type: 'array',
						maxItems: 50,
						items: { type: 'object', description: 'Post data object' },
					},
				},
			},

			'/health': {
				method: 'GET',
				description: 'Check API health and status',
			},
		},

		rateLimit: {
			limit: 60,
			window: '1 minute',
			message: 'Rate limit applies to all endpoints',
		},

		authentication: {
			type: 'API Key',
			description: 'LunarCrush API key required for enhanced features',
			environment: 'LUNARCRUSH_API_KEY',
		},
	};

	res.status(200).json(documentation);
}
