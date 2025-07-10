import { GoogleGenerativeAI } from '@google/generative-ai';
import {
	createMCPClient,
	getMCPTools,
	createCreatorLookupPrompt,
} from './lib/mcp-client.js';
import 'dotenv/config';

const debugGeminiOrchestration = async () => {
	let client = null;

	try {
		const username = 'elonmusk';
		console.log(`🤖 Debugging Gemini orchestration for @${username}...`);

		// Step 1: Get MCP tools
		client = await createMCPClient(process.env.LUNARCRUSH_API_KEY);
		const availableTools = await getMCPTools(client);

		console.log('🛠️ Available tools for Gemini:');
		console.log(JSON.stringify(availableTools, null, 2));
		console.log('');

		// Step 2: Create orchestration prompt
		const prompt = createCreatorLookupPrompt(username, availableTools);
		console.log('📝 Gemini Orchestration Prompt:');
		console.log('=================================');
		console.log(prompt);
		console.log('');

		// Step 3: Get Gemini response
		const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

		console.log('🧠 Gemini processing...');
		const result = await model.generateContent(prompt);
		const responseText = result.response.text();

		console.log('🤖 Gemini Raw Response:');
		console.log('========================');
		console.log(responseText);
		console.log('');

		// Step 4: Parse tool calls
		console.log('🔧 Parsing tool calls...');
		let toolCalls = [];
		try {
			const jsonMatch = responseText.match(/\[(.*?)\]/s);
			if (jsonMatch) {
				toolCalls = JSON.parse(`[${jsonMatch[1]}]`);
				console.log('✅ Parsed tool calls:');
				console.log(JSON.stringify(toolCalls, null, 2));
			} else {
				console.log('❌ No JSON array found in response');

				// Try to extract any JSON-like content
				const jsonAttempts = responseText.match(/\{[^}]+\}/g);
				if (jsonAttempts) {
					console.log('🔄 Found potential JSON objects:');
					jsonAttempts.forEach((attempt, i) => {
						console.log(`${i + 1}: ${attempt}`);
					});
				}
			}
		} catch (parseError) {
			console.error('❌ JSON parsing failed:', parseError.message);
			console.log('📝 Raw response for manual review:', responseText);
		}
	} catch (error) {
		console.error('❌ Orchestration debug failed:', error.message);
	} finally {
		if (client) {
			await client.close();
		}
	}
};

debugGeminiOrchestration();
