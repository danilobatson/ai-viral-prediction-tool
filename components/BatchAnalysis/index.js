import { useState } from 'react';
import {
	Box,
	VStack,
	HStack,
	Heading,
	Text,
	Button,
	Card,
	CardBody,
	CardHeader,
	Textarea,
	Select,
	Progress,
	Badge,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Divider,
	useToast,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Icon,
	CircularProgress,
	CircularProgressLabel,
	Switch,
	FormControl,
	FormLabel,
	Tooltip,
} from '@chakra-ui/react';
import {
	Upload,
	Download,
	BarChart3,
	TrendingUp,
	Users,
	Clock,
	CheckCircle,
	AlertCircle,
	FileText,
	Zap,
	Settings,
	Info,
} from 'lucide-react';
import { niches, contentTypes } from './enhanced-options';

const BatchAnalysis = () => {
	const [posts, setPosts] = useState('');
	const [platform] = useState('twitter');
	const [niche, setNiche] = useState('crypto');
	const [contentType, setContentType] = useState('text');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [results, setResults] = useState(null);
	const [progress, setProgress] = useState(0);
	const [currentPost, setCurrentPost] = useState(0);
	const [includeCreatorAnalysis, setIncludeCreatorAnalysis] = useState(false);
	const [rateLimitDelay, setRateLimitDelay] = useState('1000');
	const toast = useToast();


	const startBatchAnalysis = async () => {
		if (!posts.trim()) {
			toast({
				title: 'No Content',
				description: 'Please enter tweets to analyze',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		const postList = posts
			.split('\n')
			.map((post) => post.trim())
			.filter((post) => post.length > 0);

		if (postList.length === 0) {
			toast({
				title: 'No Valid Content',
				description: 'Please enter valid tweets to analyze',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (postList.length > 50) {
			toast({
				title: 'Too Many Posts',
				description: 'Maximum 50 tweets per batch. Please reduce the number.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsAnalyzing(true);
		setProgress(0);
		setCurrentPost(0);
		setResults(null);

		const delay = parseInt(rateLimitDelay);
		const analysisResults = [];
		const errors = [];

		try {
			for (let i = 0; i < postList.length; i++) {
				setCurrentPost(i + 1);
				setProgress(((i + 1) / postList.length) * 100);

				try {
					const postData = {
						text: postList[i],
						platform: 'twitter', // Always Twitter
						niche,
						contentType,
						created_time: new Date().toISOString(),
					};

					const response = await fetch('/api/predict-viral-ai', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ postData }),
					});

					const data = await response.json();

					if (data.success) {
						analysisResults.push({
							id: i + 1,
							content: postList[i].substring(0, 100),
							fullContent: postList[i],
							viralProbability: data.prediction.confidence || 0,
							confidence: data.prediction.confidence || 0,
							expectedEngagement: data.prediction.expectedEngagement || 0,
							category: data.prediction.category || 'Unknown',
							keyFactors: data.prediction.recommendations?.join(', ') || 'No recommendations',
							platform: 'Twitter',
							niche: niches.find((n) => n.value === niche)?.label || niche,
							contentType: contentTypes.find((ct) => ct.value === contentType)?.label || contentType,
							timestamp: new Date().toISOString(),
							aiAnalysis: data.prediction.analysis || '',
							error: null,
						});
					} else {
						errors.push({
							post: i + 1,
							content: postList[i].substring(0, 50),
							error: data.error || 'Analysis failed',
						});

						analysisResults.push({
							id: i + 1,
							content: postList[i].substring(0, 100),
							fullContent: postList[i],
							viralProbability: 0,
							confidence: 0,
							expectedEngagement: 0,
							category: 'Error',
							keyFactors: 'Analysis failed',
							platform: 'Twitter',
							niche: niches.find((n) => n.value === niche)?.label || niche,
							contentType: contentTypes.find((ct) => ct.value === contentType)?.label || contentType,
							timestamp: new Date().toISOString(),
							aiAnalysis: '',
							error: data.error || 'Analysis failed',
						});
					}
				} catch (error) {
					console.error(`Error analyzing post ${i + 1}:`, error);
					errors.push({
						post: i + 1,
						content: postList[i].substring(0, 50),
						error: error.message,
					});
				}

				// Rate limiting delay
				if (i < postList.length - 1) {
					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}

			// Calculate summary statistics
			const validResults = analysisResults.filter((r) => !r.error);
			const avgProbability = validResults.length > 0
				? validResults.reduce((sum, r) => sum + r.viralProbability, 0) / validResults.length
				: 0;
			const highPotential = validResults.filter((r) => r.viralProbability >= 70).length;
			const topResult = validResults.length > 0
				? validResults.reduce((max, r) => (r.viralProbability > max.viralProbability ? r : max), validResults[0])
				: null;

			const summary = {
				totalAnalyzed: postList.length,
				successful: validResults.length,
				failed: errors.length,
				avgProbability: Math.round(avgProbability),
				highPotential,
				topPerformer: topResult,
				errors: errors.slice(0, 5), // Show max 5 errors
			};

			setResults({
				summary,
				posts: analysisResults,
				timestamp: new Date().toISOString(),
			});

			toast({
				title: 'Batch Analysis Complete',
				description: `Successfully analyzed ${validResults.length}/${postList.length} tweets`,
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		} catch (error) {
			console.error('Batch analysis error:', error);
			toast({
				title: 'Analysis Failed',
				description: error.message || 'Something went wrong. Please try again.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsAnalyzing(false);
		}
	};

	const exportResults = () => {
		if (!results) return;

		const csvContent = [
			[
				'Tweet ID',
				'Content Preview',
				'Full Content',
				'Viral Probability',
				'Confidence',
				'Expected Engagement',
				'Category',
				'Key Factors',
				'Platform',
				'Niche',
				'Content Type',
				'Analysis Date',
				'AI Analysis',
				'Error',
			],
			...results.posts.map((post) => [
				post.id,
				`"${post.content.replace(/"/g, '""')}"`,
				`"${post.fullContent.replace(/"/g, '""')}"`,
				post.viralProbability,
				post.confidence,
				post.expectedEngagement,
				post.category,
				`"${post.keyFactors.replace(/"/g, '""')}"`,
				post.platform,
				post.niche,
				post.contentType,
				post.timestamp,
				`"${(post.aiAnalysis || '').replace(/"/g, '""')}"`,
				post.error || '',
			]),
		]
			.map((row) => row.join(','))
			.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `twitter-batch-analysis-${
			new Date().toISOString().split('T')[0]
		}.csv`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);

		toast({
			title: 'Export Successful',
			description: 'Twitter analysis results exported to CSV',
			status: 'success',
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<Box maxW='6xl' mx='auto' p={6}>
			<VStack spacing={6} align='stretch'>
				{/* Header */}
				<Box textAlign='center'>
					<Badge colorScheme='blue' fontSize='sm' mb={2}>
						🐦 Twitter/X Batch Analysis
					</Badge>
					<Heading size='lg' mb={2}>
						Twitter Batch Probability Analysis
					</Heading>
					<Text color='gray.600'>
						Analyze multiple tweets simultaneously using LunarCrush MCP and AI
					</Text>
					<Badge colorScheme='green' mt={2}>
						✅ Live Twitter Data via MCP
					</Badge>
				</Box>

				{/* Platform Info */}
				<Alert status='info' borderRadius='lg'>
					<AlertIcon />
					<Box>
						<Text fontWeight='bold'>Twitter Batch Processing</Text>
						<Text fontSize='sm'>
							Optimized for Twitter&apos;s viral mechanics. Process up to 50
							tweets at once with real-time social data analysis.
						</Text>
					</Box>
				</Alert>

				{/* Input Section */}
				<Card>
					<CardHeader>
						<HStack justify='space-between'>
							<HStack>
								<Icon as={Upload} />
								<Heading size='md'>Input Tweets</Heading>
							</HStack>
							<Tooltip label='Configure analysis parameters'>
								<Icon as={Settings} cursor='pointer' />
							</Tooltip>
						</HStack>
					</CardHeader>
					<CardBody>
						<VStack spacing={4}>
							<Textarea
								placeholder="Enter multiple tweets (one per line)...&#10;&#10;Example:&#10;🚀 Bitcoin just hit $100K! This is history in the making.&#10;The crypto market is looking bullish today 📈&#10;Just bought the dip on ETH. Let's see where this goes!"
								value={posts}
								onChange={(e) => setPosts(e.target.value)}
								minH='200px'
								resize='vertical'
							/>

							<HStack w='full' spacing={4}>
								<FormControl>
									<FormLabel fontSize='sm'>Niche</FormLabel>
									<Select
										value={niche}
										onChange={(e) => setNiche(e.target.value)}
										size='sm'>
										{niches.map((n) => (
											<option key={n.value} value={n.value}>
												{n.label}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl>
									<FormLabel fontSize='sm'>Content Type</FormLabel>
									<Select
										value={contentType}
										onChange={(e) => setContentType(e.target.value)}
										size='sm'>
										{contentTypes.map((ct) => (
											<option key={ct.value} value={ct.value}>
												{ct.label}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl>
									<FormLabel fontSize='sm'>Rate Limit (ms)</FormLabel>
									<Select
										value={rateLimitDelay}
										onChange={(e) => setRateLimitDelay(e.target.value)}
										size='sm'>
										<option value='500'>500ms (Fast)</option>
										<option value='1000'>1s (Balanced)</option>
										<option value='2000'>2s (Safe)</option>
										<option value='3000'>3s (Conservative)</option>
									</Select>
								</FormControl>
							</HStack>

							<Button
								colorScheme='purple'
								size='lg'
								onClick={startBatchAnalysis}
								isLoading={isAnalyzing}
								loadingText={`Analyzing tweet ${currentPost}...`}
								w='full'>
								📊 Start Twitter Batch Analysis
							</Button>
						</VStack>
					</CardBody>
				</Card>

				{/* Progress */}
				{isAnalyzing && (
					<Card>
						<CardBody>
							<VStack spacing={4}>
								<HStack w='full' justify='space-between'>
									<Text fontWeight='bold'>Analyzing Tweets...</Text>
									<Text fontSize='sm' color='gray.600'>
										{currentPost} of{' '}
										{posts.split('\n').filter((p) => p.trim()).length}
									</Text>
								</HStack>
								<Progress
									value={progress}
									size='lg'
									colorScheme='purple'
									w='full'
								/>
								<Text fontSize='sm' color='gray.600' textAlign='center'>
									Processing tweets with LunarCrush MCP + Google Gemini AI
								</Text>
							</VStack>
						</CardBody>
					</Card>
				)}

				{/* Results Summary */}
				{results && (
					<>
						<Card>
							<CardHeader>
								<HStack justify='space-between'>
									<HStack>
										<Icon as={BarChart3} />
										<Heading size='md'>Analysis Summary</Heading>
									</HStack>
									<Button
										leftIcon={<Download />}
										onClick={exportResults}
										size='sm'
										variant='outline'>
										Export CSV
									</Button>
								</HStack>
							</CardHeader>
							<CardBody>
								<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
									<Stat>
										<StatLabel>Total Analyzed</StatLabel>
										<StatNumber>{results.summary.totalAnalyzed}</StatNumber>
										<StatHelpText>Tweets processed</StatHelpText>
									</Stat>
									<Stat>
										<StatLabel>Success Rate</StatLabel>
										<StatNumber>
											{Math.round(
												(results.summary.successful /
													results.summary.totalAnalyzed) *
													100
											)}
											%
										</StatNumber>
										<StatHelpText>
											{results.summary.successful} successful
										</StatHelpText>
									</Stat>
									<Stat>
										<StatLabel>Avg Probability</StatLabel>
										<StatNumber>{results.summary.avgProbability}%</StatNumber>
										<StatHelpText>Viral likelihood</StatHelpText>
									</Stat>
									<Stat>
										<StatLabel>High Potential</StatLabel>
										<StatNumber>{results.summary.highPotential}</StatNumber>
										<StatHelpText>70%+ probability</StatHelpText>
									</Stat>
								</SimpleGrid>

								{results.summary.topPerformer && (
									<>
										<Divider my={4} />
										<Alert status='success' borderRadius='lg'>
											<AlertIcon />
											<Box>
												<AlertTitle>Top Performing Tweet</AlertTitle>
												<AlertDescription fontSize='sm'>
													&quot;{results.summary.topPerformer.content}...&quot;
													-{' '}
													<strong>
														{results.summary.topPerformer.viralProbability}%
														probability
													</strong>
												</AlertDescription>
											</Box>
										</Alert>
									</>
								)}
							</CardBody>
						</Card>

						{/* Results Table */}
						<Card>
							<CardHeader>
								<HStack>
									<Icon as={FileText} />
									<Heading size='md'>Detailed Results</Heading>
								</HStack>
							</CardHeader>
							<CardBody>
								<TableContainer>
									<Table variant='simple' size='sm'>
										<Thead>
											<Tr>
												<Th>Tweet</Th>
												<Th>Content</Th>
												<Th>Probability</Th>
												<Th>Expected Engagement</Th>
												<Th>Category</Th>
												<Th>Status</Th>
											</Tr>
										</Thead>
										<Tbody>
											{results.posts.map((post) => (
												<Tr key={post.id}>
													<Td>{post.id}</Td>
													<Td maxW='300px'>
														<Text fontSize='sm' noOfLines={2}>
															{post.content}
														</Text>
													</Td>
													<Td>
														<Badge
															colorScheme={
																post.viralProbability >= 70
																	? 'green'
																	: post.viralProbability >= 40
																	? 'orange'
																	: 'red'
															}>
															{post.viralProbability}%
														</Badge>
													</Td>
													<Td>{post.expectedEngagement}</Td>
													<Td>
														<Badge size='sm'>{post.category}</Badge>
													</Td>
													<Td>
														{post.error ? (
															<Icon as={AlertCircle} color='red.500' />
														) : (
															<Icon as={CheckCircle} color='green.500' />
														)}
													</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							</CardBody>
						</Card>
					</>
				)}

				{/* Twitter Tips */}
				<Alert status='info' borderRadius='lg'>
					<AlertIcon />
					<Box>
						<Text fontWeight='bold'>Twitter Batch Analysis Tips</Text>
						<Text fontSize='sm'>
							• Keep tweets under 280 characters for accurate analysis
							<br />
							• Mix different content types for comprehensive insights
							<br />
							• Use rate limiting to avoid API restrictions
							<br />• Focus on crypto/finance content for best LunarCrush data
							coverage
						</Text>
					</Box>
				</Alert>
			</VStack>
		</Box>
	);
};

export default BatchAnalysis;
