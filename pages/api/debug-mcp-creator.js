import { createMcpClient, executeToolCall } from '../../lib/mcp-client.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed. Use GET.' });
	}

	const { creator = 'elonmusk' } = req.query;
	let mcpClient = null;

	try {
		console.log(`🔍 DEBUG: Looking up ${creator}`);

		mcpClient = await createMcpClient();

		// Execute Creator tool
		const result = await executeToolCall(mcpClient, 'Creator', {
			screenName: creator,
			network: 'x',
		});

		// Extract raw text
		let rawText = '';
		if (result && result.content) {
			for (const content of result.content) {
				if (content.type === 'text') {
					rawText += content.text + '\n\n';
				}
			}
		}

		// Test LLM parsing
		const parsingPrompt = `Parse this creator data and return JSON:
${rawText}

Return: {"handle": "username", "followerCount": number, "engagements": number, "platform": "x"}`;

		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
		const parsingResult = await model.generateContent(parsingPrompt);
		const llmParsed = parsingResult.response.text();

		res.status(200).json({
			success: true,
			debug: {
				creator,
				rawMcpResponse: rawText,
				llmParsingResult: llmParsed,
				timestamp: new Date().toISOString(),
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
			debug: {
				creator,
				timestamp: new Date().toISOString(),
			},
		});
	} finally {
		if (mcpClient && mcpClient.close) {
			await mcpClient.close();
		}
	}
}
