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

const BatchAnalysis = () => {
	const [posts, setPosts] = useState('');
	const [platform, setPlatform] = useState('twitter');
	const [niche, setNiche] = useState('crypto');
	const [contentType, setContentType] = useState('text');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [results, setResults] = useState(null);
	const [progress, setProgress] = useState(0);
	const [currentPost, setCurrentPost] = useState(0);
	const [includeCreatorAnalysis, setIncludeCreatorAnalysis] = useState(false);
	const [rateLimitDelay, setRateLimitDelay] = useState('1000');
	const toast = useToast();

	const platforms = [
		{ value: 'twitter', label: 'X/Twitter', supported: true },
		{ value: 'instagram', label: 'Instagram', supported: false },
		{ value: 'linkedin', label: 'LinkedIn', supported: false },
		{ value: 'tiktok', label: 'TikTok', supported: false },
		{ value: 'youtube', label: 'YouTube', supported: true },
		{ value: 'reddit', label: 'Reddit', supported: true },
	];

	const niches = [
		{ value: 'crypto', label: 'Cryptocurrency & DeFi' },
		{ value: 'ai', label: 'AI & Machine Learning' },
		{ value: 'tech', label: 'Technology' },
		{ value: 'business', label: 'Business & Finance' },
		{ value: 'marketing', label: 'Marketing & Growth' },
		{ value: 'startup', label: 'Startups & Innovation' },
		{ value: 'gaming', label: 'Gaming & Entertainment' },
		{ value: 'nft', label: 'NFTs & Digital Art' },
		{ value: 'defi', label: 'DeFi & Web3' },
		{ value: 'trading', label: 'Trading & Investing' },
	];

	const contentTypes = [
		{ value: 'text', label: 'Text Post' },
		{ value: 'image', label: 'Image Post' },
		{ value: 'video', label: 'Video Post' },
		{ value: 'poll', label: 'Poll' },
		{ value: 'thread', label: 'Thread/Series' },
		{ value: 'story', label: 'Story' },
		{ value: 'live', label: 'Live Stream' },
		{ value: 'other', label: 'Other' },
	];

	const getPlatformSupport = () => {
		const p = platforms.find((p) => p.value === platform);
		return {
			supported: p?.supported || false,
			label: p?.supported ? 'MCP Data' : 'Analysis Only',
			note: p?.supported
				? 'Real-time data via LunarCrush'
				: 'Limited analysis without real-time data',
		};
	};

	const analyzePost = async (postText, index, totalPosts) => {
		try {
			const response = await fetch('/api/predict-viral-ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					postData: {
						text: postText,
						platform,
						niche,
						contentType,
						media_count:
							contentType === 'image' ? 1 : contentType === 'video' ? 1 : 0,
						hashtags: (postText.match(/#\w+/g) || []).length,
						mentions: (postText.match(/@\w+/g) || []).length,
						urls: (postText.match(/https?:\/\/\S+/g) || []).length,
						created_time: new Date().toISOString(),
						current_time: new Date().toISOString(),
					},
					options: {
						includeAIAnalysis: true,
						includeDetailedBreakdown: true,
						model: 'gemini-2.0-flash-lite',
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || 'Analysis failed');
			}

			return {
				id: index + 1,
				content:
					postText.length > 100 ? postText.substring(0, 100) + '...' : postText,
				fullContent: postText,
				viralProbability: data.viralProbability || 0,
				confidence: data.confidence || 0,
				category: data.category || 'Unknown',
				expectedEngagement: data.expectedEngagement || 0,
				keyFactors: Array.isArray(data.keyFactors)
					? data.keyFactors.join(', ')
					: data.keyFactors || 'Unknown',
				aiAnalysis: data.aiAnalysis || '',
				componentScores: data.componentScores || {},
				recommendations: data.recommendations || [],
				timestamp: new Date().toISOString(),
				platform: platform,
				niche: niche,
				contentType: contentType,
			};
		} catch (error) {
			console.error(`Error analyzing post ${index + 1}:`, error);
			return {
				id: index + 1,
				content:
					postText.length > 100 ? postText.substring(0, 100) + '...' : postText,
				fullContent: postText,
				viralProbability: 0,
				confidence: 0,
				category: 'Error',
				expectedEngagement: 0,
				keyFactors: 'Analysis failed',
				error: error.message,
				timestamp: new Date().toISOString(),
				platform: platform,
				niche: niche,
				contentType: contentType,
			};
		}
	};

	const handleAnalyze = async () => {
		if (!posts.trim()) {
			toast({
				title: 'Input Required',
				description: 'Please enter posts to analyze',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		const postList = posts.split('\n').filter((post) => post.trim());

		if (postList.length > 50) {
			toast({
				title: 'Too Many Posts',
				description:
					'Please limit to 50 posts per batch to ensure optimal performance',
				status: 'warning',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		setIsAnalyzing(true);
		setProgress(0);
		setCurrentPost(0);
		const analysisResults = [];
		const delayMs = parseInt(rateLimitDelay);

		try {
			toast({
				title: 'Batch Analysis Started',
				description: `Analyzing ${postList.length} posts with real AI and MCP data`,
				status: 'info',
				duration: 3000,
				isClosable: true,
			});

			for (let i = 0; i < postList.length; i++) {
				setCurrentPost(i + 1);
				setProgress(((i + 1) / postList.length) * 100);

				// Real API analysis for each post
				const result = await analyzePost(postList[i], i, postList.length);
				analysisResults.push(result);

				// Rate limiting to prevent API overload
				if (i < postList.length - 1 && delayMs > 0) {
					await new Promise((resolve) => setTimeout(resolve, delayMs));
				}
			}

			// Calculate summary statistics
			const validResults = analysisResults.filter((r) => !r.error);
			const avgViralProbability =
				validResults.length > 0
					? Math.round(
							validResults.reduce((sum, r) => sum + r.viralProbability, 0) /
								validResults.length
					  )
					: 0;

			const highViralCount = validResults.filter(
				(r) => r.viralProbability >= 70
			).length;
			const recommendedPosts = validResults
				.filter((r) => r.viralProbability >= 80)
				.sort((a, b) => b.viralProbability - a.viralProbability)
				.slice(0, 5);

			setResults({
				posts: analysisResults,
				summary: {
					totalPosts: postList.length,
					successfulAnalyses: validResults.length,
					failedAnalyses: analysisResults.length - validResults.length,
					avgViralProbability,
					avgConfidence:
						validResults.length > 0
							? Math.round(
									validResults.reduce((sum, r) => sum + r.confidence, 0) /
										validResults.length
							  )
							: 0,
					highViralCount,
					recommendedPosts,
					platform: platforms.find((p) => p.value === platform)?.label,
					niche: niches.find((n) => n.value === niche)?.label,
					contentType: contentTypes.find((ct) => ct.value === contentType)
						?.label,
					analysisDate: new Date().toLocaleDateString(),
					supportLevel: getPlatformSupport().label,
				},
			});

			toast({
				title: 'Analysis Complete!',
				description: `Successfully analyzed ${validResults.length}/${postList.length} posts`,
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
				'Post ID',
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
		a.download = `viral-batch-analysis-${
			new Date().toISOString().split('T')[0]
		}.csv`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);

		toast({
			title: 'Export Successful',
			description: 'Results exported to CSV with full analysis data',
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
					<Heading size='lg' mb={2}>
						📊 Batch Analysis Tool
					</Heading>
					<Text color='gray.600'>
						Analyze multiple posts simultaneously using real AI and MCP data
					</Text>
					<Badge
						mt={2}
						colorScheme={getPlatformSupport().supported ? 'green' : 'orange'}>
						{getPlatformSupport().label}
					</Badge>
				</Box>

				{/* Input Section */}
				<Card>
					<CardHeader>
						<HStack justify='space-between'>
							<HStack>
								<Icon as={Upload} />
								<Heading size='md'>Input Posts</Heading>
							</HStack>
							<Tooltip label='Configure analysis parameters'>
								<Icon as={Settings} cursor='pointer' />
							</Tooltip>
						</HStack>
					</CardHeader>
					<CardBody>
						<VStack spacing={4}>
							<Textarea
								placeholder="Enter multiple posts (one per line)...&#10;&#10;Example:&#10;🚀 Bitcoin just hit $100K! This is history in the making. #Bitcoin #Crypto&#10;AI agents are going to revolutionize how we work. The future is here! #AI #Tech&#10;Just launched my new startup. Excited to share what we've been building! #Startup"
								value={posts}
								onChange={(e) => setPosts(e.target.value)}
								rows={8}
								resize='vertical'
							/>

							<SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w='full'>
								<Select
									value={platform}
									onChange={(e) => setPlatform(e.target.value)}>
									{platforms.map((p) => (
										<option key={p.value} value={p.value}>
											{p.label} {p.supported ? '✓' : '⚠️'}
										</option>
									))}
								</Select>

								<Select
									value={niche}
									onChange={(e) => setNiche(e.target.value)}>
									{niches.map((n) => (
										<option key={n.value} value={n.value}>
											{n.label}
										</option>
									))}
								</Select>

								<Select
									value={contentType}
									onChange={(e) => setContentType(e.target.value)}>
									{contentTypes.map((ct) => (
										<option key={ct.value} value={ct.value}>
											{ct.label}
										</option>
									))}
								</Select>
							</SimpleGrid>

							<HStack w='full' spacing={4}>
								<FormControl display='flex' alignItems='center'>
									<FormLabel htmlFor='rate-limit' mb='0' fontSize='sm'>
										Rate Limit (ms):
									</FormLabel>
									<Select
										id='rate-limit'
										value={rateLimitDelay}
										onChange={(e) => setRateLimitDelay(e.target.value)}
										size='sm'
										w='120px'>
										<option value='500'>500ms</option>
										<option value='1000'>1000ms</option>
										<option value='2000'>2000ms</option>
										<option value='3000'>3000ms</option>
									</Select>
								</FormControl>

								<FormControl display='flex' alignItems='center'>
									<FormLabel htmlFor='creator-analysis' mb='0' fontSize='sm'>
										Include Creator Analysis:
									</FormLabel>
									<Switch
										id='creator-analysis'
										isChecked={includeCreatorAnalysis}
										onChange={(e) =>
											setIncludeCreatorAnalysis(e.target.checked)
										}
									/>
								</FormControl>
							</HStack>

							<Button
								colorScheme='purple'
								onClick={handleAnalyze}
								isLoading={isAnalyzing}
								loadingText={`Analyzing post ${currentPost}...`}
								leftIcon={<Icon as={BarChart3} />}
								size='lg'
								width='full'
								isDisabled={!posts.trim()}>
								Analyze All Posts with Real AI
							</Button>

							{!getPlatformSupport().supported && (
								<Alert status='warning' borderRadius='md'>
									<AlertIcon />
									<Box>
										<AlertTitle>Limited Platform Support</AlertTitle>
										<AlertDescription fontSize='sm'>
											{getPlatformSupport().note}
										</AlertDescription>
									</Box>
								</Alert>
							)}
						</VStack>
					</CardBody>
				</Card>

				{/* Progress */}
				{isAnalyzing && (
					<Card>
						<CardBody>
							<VStack spacing={3}>
								<HStack w='full' justify='space-between'>
									<Text fontWeight='bold'>
										Real-Time Analysis in Progress...
									</Text>
									<Badge colorScheme='blue'>{Math.round(progress)}%</Badge>
								</HStack>
								<Progress value={progress} width='full' colorScheme='purple' />
								<Text fontSize='sm' color='gray.600'>
									Processing post {currentPost} with Gemini AI + MCP data -{' '}
									{Math.round(progress)}% complete
								</Text>
								<Text fontSize='xs' color='gray.500'>
									Rate limited to {rateLimitDelay}ms between requests for
									optimal performance
								</Text>
							</VStack>
						</CardBody>
					</Card>
				)}

				{/* Results */}
				{results && (
					<VStack spacing={6} align='stretch'>
						{/* Enhanced Summary */}
						<Card>
							<CardHeader>
								<HStack justify='space-between'>
									<HStack>
										<Icon as={TrendingUp} />
										<Heading size='md'>Analysis Summary</Heading>
									</HStack>
									<Button
										leftIcon={<Icon as={Download} />}
										onClick={exportResults}
										size='sm'
										variant='outline'>
										Export Full CSV
									</Button>
								</HStack>
							</CardHeader>
							<CardBody>
								<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
									<Stat textAlign='center'>
										<StatLabel>Total Posts</StatLabel>
										<StatNumber>{results.summary.totalPosts}</StatNumber>
										<StatHelpText>
											{results.summary.successfulAnalyses} successful
										</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Avg Viral Score</StatLabel>
										<StatNumber>
											{results.summary.avgViralProbability}%
										</StatNumber>
										<StatHelpText>
											{results.summary.avgConfidence}% confidence
										</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>High Viral Potential</StatLabel>
										<StatNumber>{results.summary.highViralCount}</StatNumber>
										<StatHelpText>70%+ Score</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Data Source</StatLabel>
										<StatNumber fontSize='lg'>
											{results.summary.supportLevel}
										</StatNumber>
										<StatHelpText>{results.summary.platform}</StatHelpText>
									</Stat>
								</SimpleGrid>

								<Box p={3} bg='gray.50' borderRadius='md' fontSize='sm'>
									<Text>
										<strong>Analysis Configuration:</strong>
									</Text>
									<Text>
										Platform: {results.summary.platform} | Niche:{' '}
										{results.summary.niche} | Content:{' '}
										{results.summary.contentType}
									</Text>
									<Text>
										Date: {results.summary.analysisDate} | Rate Limit:{' '}
										{rateLimitDelay}ms
									</Text>
								</Box>
							</CardBody>
						</Card>

						{/* Top Recommendations */}
						{results.summary.recommendedPosts.length > 0 && (
							<Card>
								<CardHeader>
									<HStack>
										<Icon as={Zap} />
										<Heading size='md'>
											Top Recommendations (
											{results.summary.recommendedPosts.length})
										</Heading>
									</HStack>
								</CardHeader>
								<CardBody>
									<VStack spacing={3}>
										{results.summary.recommendedPosts.map((post) => (
											<Alert key={post.id} status='success' borderRadius='md'>
												<AlertIcon />
												<Box flex='1'>
													<AlertTitle>
														Post #{post.id} - {post.viralProbability}% Viral
														Score ({post.confidence}% confidence)
													</AlertTitle>
													<AlertDescription fontSize='sm'>
														{post.content}
													</AlertDescription>
												</Box>
												<Badge colorScheme='green'>{post.category}</Badge>
											</Alert>
										))}
									</VStack>
								</CardBody>
							</Card>
						)}

						{/* Detailed Results */}
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
												<Th>Post</Th>
												<Th>Content Preview</Th>
												<Th isNumeric>Viral Score</Th>
												<Th isNumeric>Confidence</Th>
												<Th isNumeric>Expected Engagement</Th>
												<Th>Category</Th>
												<Th>Status</Th>
											</Tr>
										</Thead>
										<Tbody>
											{results.posts.map((post) => (
												<Tr key={post.id}>
													<Td fontWeight='bold'>#{post.id}</Td>
													<Td
														maxW='300px'
														overflow='hidden'
														textOverflow='ellipsis'>
														{post.content}
													</Td>
													<Td isNumeric>
														<Badge
															colorScheme={
																post.error
																	? 'red'
																	: post.viralProbability >= 80
																	? 'green'
																	: post.viralProbability >= 60
																	? 'yellow'
																	: post.viralProbability >= 40
																	? 'orange'
																	: 'red'
															}>
															{post.error
																? 'Error'
																: `${post.viralProbability}%`}
														</Badge>
													</Td>
													<Td isNumeric>
														{post.error ? 'N/A' : `${post.confidence}%`}
													</Td>
													<Td isNumeric>
														{post.error
															? 'N/A'
															: post.expectedEngagement.toLocaleString()}
													</Td>
													<Td>
														<Badge
															size='sm'
															variant='outline'
															colorScheme={post.error ? 'red' : 'blue'}>
															{post.category}
														</Badge>
													</Td>
													<Td>
														<Icon
															as={post.error ? AlertCircle : CheckCircle}
															color={post.error ? 'red.500' : 'green.500'}
														/>
													</Td>
												</Tr>
											))}
										</Tbody>
									</Table>
								</TableContainer>
							</CardBody>
						</Card>

						{/* Analysis Metadata */}
						<Box
							fontSize='xs'
							color='gray.500'
							textAlign='center'
							bg='gray.50'
							p={3}
							borderRadius='md'>
							<Text>
								Batch analysis completed at {new Date().toLocaleString()} using
								real AI and MCP data
							</Text>
							<Text mt={1}>
								Powered by Google Gemini 2.0 Flash Lite + LunarCrush MCP
								Protocol
							</Text>
							<Text mt={1}>
								{results.summary.successfulAnalyses}/
								{results.summary.totalPosts} posts analyzed successfully
							</Text>
						</Box>
					</VStack>
				)}
			</VStack>
		</Box>
	);
};

export default BatchAnalysis;
