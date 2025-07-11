const fs = require('fs');

const componentFile = 'components/ViralPredictor/index.js';
let content = fs.readFileSync(componentFile, 'utf8');

// Replace the handlePredict function with streaming version
const streamingHandlePredict = `	const handlePredict = async () => {
		if (!content.trim()) {
			toast({
				title: 'Tweet Required',
				description: 'Please enter your original tweet content to analyze',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setLoading(true);
		setError('');
		setCreatorError('');
		setResults(null);
		setShowConfetti(false);

		try {
			// Use streaming endpoint for real-time updates
			const response = await fetch('/api/analyze-stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					content: content.trim(), 
					creator: creator.trim().replace(/^@+/, '') || undefined 
				}),
			});

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split('\\n');

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const update = JSON.parse(line.slice(6));
							
							// Update progress with real-time messages
							updateProgress(update.step, update.message);
							
							// Handle special events
							if (update.step === 'success' && update.data?.creatorData) {
								console.log('📊 Real-time creator data:', update.data.creatorData);
							}
							
							if (update.step === 'complete' && update.data) {
								updateProgress('complete', 'Analysis complete!');
								setResults(update.data);

								if (update.data.viralProbability >= 70) {
									setTimeout(() => setShowConfetti(true), 500);
								}

								toast({
									title: \`\${update.data.viralProbability}% Viral Potential!\`,
									description: update.data.hasCreatorData
										? '𝕏 Enhanced with real-time account analytics'
										: '📊 General content analysis',
									status: update.data.viralProbability >= 70 ? 'success' : 'info',
									duration: 5000,
									isClosable: true,
								});
							}
							
							if (update.step === 'error') {
								throw new Error(update.message);
							}
							
							if (update.step === 'warning') {
								setCreatorError(update.message);
							}
							
						} catch (parseError) {
							console.warn('Could not parse streaming update:', line);
						}
					}
				}
			}

		} catch (err) {
			setError(err.message);
			updateProgress('error', err.message);
			toast({
				title: 'Analysis Failed',
				description: err.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};`;

// Replace the function
const functionPattern = /const handlePredict = async \(\) => \{[\s\S]*?\};/;
content = content.replace(functionPattern, streamingHandlePredict);

fs.writeFileSync(componentFile, content);
console.log('✅ Updated frontend to use streaming API');
