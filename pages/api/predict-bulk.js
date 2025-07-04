/**
 * Bulk Viral Prediction API Endpoint
 * Handles multiple predictions efficiently
 */

import cors from 'cors';
const EnhancedViralPredictor = require('../../algorithm/models/enhanced_viral_predictor');

const corsOptions = {
	origin:
		process.env.NODE_ENV === 'production'
			? ['https://your-domain.com']
			: ['http://localhost:3001'],
	methods: ['POST'],
	credentials: true,
};

let predictor = null;

async function initializePredictor() {
	if (!predictor) {
		predictor = new EnhancedViralPredictor();
		await predictor.initializeMLModel();
	}
	return predictor;
}

export default async function handler(req, res) {
	// Apply CORS
	await new Promise((resolve, reject) => {
		cors(corsOptions)(req, res, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { posts, options = {} } = req.body;

		if (!posts || !Array.isArray(posts)) {
			return res.status(400).json({
				error: 'Invalid request',
				message: 'posts must be an array of post data objects',
			});
		}

		if (posts.length > 50) {
			return res.status(400).json({
				error: 'Too many posts',
				message: 'Maximum 50 posts allowed per bulk request',
			});
		}

		const viralPredictor = await initializePredictor();
		const startTime = Date.now();

		const predictions = await Promise.all(
			posts.map(async (post, index) => {
				try {
					const prediction = await viralPredictor.predictViral(post);
					return {
						index,
						success: true,
						prediction: {
							viralProbability: prediction.viralProbability,
							confidence: prediction.confidence,
							category: prediction.category,
						},
					};
				} catch (error) {
					return {
						index,
						success: false,
						error: error.message,
					};
				}
			})
		);

		const processingTime = Date.now() - startTime;
		const successful = predictions.filter((p) => p.success).length;

		res.status(200).json({
			success: true,
			summary: {
				total: posts.length,
				successful,
				failed: posts.length - successful,
				processingTime: `${processingTime}ms`,
				averageTime: `${Math.round(processingTime / posts.length)}ms`,
			},
			predictions,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error('❌ Bulk prediction error:', error);
		res.status(500).json({
			error: 'Bulk prediction failed',
			message: error.message,
			timestamp: new Date().toISOString(),
		});
	}
}
