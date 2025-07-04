import { useState, useEffect, useCallback } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Button,
	Input,
	Select,
	FormControl,
	FormLabel,
	Alert,
	AlertIcon,
	Badge,
	Card,
	CardBody,
	CardHeader,
	Heading,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Progress,
	Spinner,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	useColorModeValue,
	Textarea,
	Wrap,
	WrapItem,
	Tag,
	TagLabel,
	TagCloseButton,
	IconButton,
	Tooltip,
	Flex,
	Spacer,
} from '@chakra-ui/react';
import { TrendingUp, Hash, Target, Zap, Copy, RefreshCw } from 'lucide-react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
} from 'recharts';

const HashtagOptimizer = () => {
	const [content, setContent] = useState('');
	const [platform, setPlatform] = useState('x');
	const [niche, setNiche] = useState('crypto');
	const [currentHashtags, setCurrentHashtags] = useState([]);
	const [suggestions, setSuggestions] = useState([]);
	const [trendingHashtags, setTrendingHashtags] = useState([]);
	const [analysis, setAnalysis] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const cardBg = useColorModeValue('white', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const platforms = [
		{ value: 'x', label: 'X (Twitter)', maxHashtags: 10 },
		{ value: 'instagram', label: 'Instagram', maxHashtags: 30 },
		{ value: 'tiktok', label: 'TikTok', maxHashtags: 10 },
		{ value: 'linkedin', label: 'LinkedIn', maxHashtags: 5 },
		{ value: 'youtube', label: 'YouTube', maxHashtags: 15 },
	];

	const niches = [
		{ value: 'crypto', label: 'Cryptocurrency & Blockchain' },
		{ value: 'ai', label: 'AI & Machine Learning' },
		{ value: 'tech', label: 'Technology & Programming' },
		{ value: 'business', label: 'Business & Entrepreneurship' },
		{ value: 'marketing', label: 'Marketing & Social Media' },
		{ value: 'finance', label: 'Finance & Investing' },
		{ value: 'gaming', label: 'Gaming & Esports' },
		{ value: 'lifestyle', label: 'Lifestyle & Wellness' },
		{ value: 'education', label: 'Education & Learning' },
		{ value: 'entertainment', label: 'Entertainment & Media' },
	];

	// Extract hashtags from content
	useEffect(() => {
		const hashtagRegex = /#\w+/g;
		const extractedHashtags = content.match(hashtagRegex) || [];
		setCurrentHashtags(extractedHashtags.map((tag) => tag.substring(1)));
	}, [content]);

	// Load trending hashtags on component mount
	const loadTrendingHashtags = useCallback(async () => {
		try {
			// Simulate trending hashtags based on niche
			const trendingData = getTrendingHashtagsForNiche(niche);
			setTrendingHashtags(trendingData);
		} catch (err) {
			console.error('Failed to load trending hashtags:', err);
		}
	}, [niche]);

	useEffect(() => {
		loadTrendingHashtags();
	}, [loadTrendingHashtags]);

	// Simulate trending hashtags (in real implementation, this would call LunarCrush API)
	const getTrendingHashtagsForNiche = (selectedNiche) => {
		const hashtagData = {
			crypto: [
				{ tag: 'bitcoin', engagement: 950000, trend: 'up', volume: 120000 },
				{ tag: 'ethereum', engagement: 780000, trend: 'up', volume: 98000 },
				{ tag: 'crypto', engagement: 650000, trend: 'stable', volume: 156000 },
				{ tag: 'blockchain', engagement: 420000, trend: 'up', volume: 67000 },
				{ tag: 'defi', engagement: 380000, trend: 'down', volume: 45000 },
				{ tag: 'nft', engagement: 320000, trend: 'down', volume: 38000 },
				{ tag: 'web3', engagement: 290000, trend: 'up', volume: 41000 },
				{ tag: 'altcoin', engagement: 250000, trend: 'stable', volume: 32000 },
			],
			ai: [
				{ tag: 'ai', engagement: 890000, trend: 'up', volume: 145000 },
				{
					tag: 'machinelearning',
					engagement: 420000,
					trend: 'up',
					volume: 67000,
				},
				{ tag: 'chatgpt', engagement: 380000, trend: 'stable', volume: 52000 },
				{
					tag: 'artificialintelligence',
					engagement: 350000,
					trend: 'up',
					volume: 48000,
				},
				{ tag: 'automation', engagement: 290000, trend: 'up', volume: 38000 },
				{ tag: 'robotics', engagement: 240000, trend: 'stable', volume: 31000 },
				{ tag: 'deeplearning', engagement: 210000, trend: 'up', volume: 28000 },
				{
					tag: 'neuralnetwork',
					engagement: 180000,
					trend: 'stable',
					volume: 24000,
				},
			],
			tech: [
				{ tag: 'technology', engagement: 750000, trend: 'up', volume: 98000 },
				{ tag: 'programming', engagement: 520000, trend: 'up', volume: 67000 },
				{ tag: 'coding', engagement: 480000, trend: 'up', volume: 62000 },
				{
					tag: 'javascript',
					engagement: 380000,
					trend: 'stable',
					volume: 49000,
				},
				{ tag: 'python', engagement: 360000, trend: 'up', volume: 46000 },
				{ tag: 'react', engagement: 290000, trend: 'up', volume: 38000 },
				{ tag: 'nodejs', engagement: 250000, trend: 'stable', volume: 32000 },
				{ tag: 'webdev', engagement: 220000, trend: 'up', volume: 29000 },
			],
		};

		return hashtagData[selectedNiche] || hashtagData.crypto;
	};

	const analyzeHashtags = async () => {
		if (!content.trim() && currentHashtags.length === 0) {
			setError('Please enter content or hashtags to analyze');
			return;
		}

		setLoading(true);
		setError('');
		setAnalysis(null);
		setSuggestions([]);

		try {
			// Simulate AI analysis (in real implementation, this would call Gemini API)
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const aiSuggestions = generateHashtagSuggestions(
				content,
				currentHashtags,
				niche,
				platform
			);
			const hashtagAnalysis = analyzeCurrentHashtags(currentHashtags, platform);

			setSuggestions(aiSuggestions);
			setAnalysis(hashtagAnalysis);
		} catch (err) {
			setError('Failed to analyze hashtags. Please try again.');
			console.error('Hashtag analysis error:', err);
		} finally {
			setLoading(false);
		}
	};

	const generateHashtagSuggestions = (
		contentText,
		existing,
		selectedNiche,
		selectedPlatform
	) => {
		const platformData = platforms.find((p) => p.value === selectedPlatform);
		const trending = getTrendingHashtagsForNiche(selectedNiche);

		// Filter out existing hashtags and select top performers
		const available = trending.filter((h) => !existing.includes(h.tag));
		const maxSuggestions = Math.min(
			platformData.maxHashtags - existing.length,
			8
		);

		return available.slice(0, maxSuggestions).map((hashtag) => ({
			...hashtag,
			reason: generateSuggestionReason(hashtag, contentText),
			confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
		}));
	};

	const generateSuggestionReason = (hashtag, contentText) => {
		const reasons = [
			`High engagement rate (${Math.floor(
				hashtag.engagement / 1000
			)}K interactions)`,
			`Trending ${hashtag.trend === 'up' ? 'upward' : 'stable'} in your niche`,
			`Strong community presence with ${Math.floor(
				hashtag.volume / 1000
			)}K mentions`,
			`Optimal for ${platform.toUpperCase()} algorithm`,
			`Complements your content theme`,
		];
		return reasons[Math.floor(Math.random() * reasons.length)];
	};

	const analyzeCurrentHashtags = (hashtags, selectedPlatform) => {
		const platformData = platforms.find((p) => p.value === selectedPlatform);
		const trending = getTrendingHashtagsForNiche(niche);

		const analysis = hashtags.map((tag) => {
			const trendingData = trending.find(
				(t) => t.tag.toLowerCase() === tag.toLowerCase()
			);
			return {
				tag,
				performance: trendingData
					? 'high'
					: Math.random() > 0.5
					? 'medium'
					: 'low',
				engagement: trendingData
					? trendingData.engagement
					: Math.floor(Math.random() * 100000) + 10000,
				trend: trendingData
					? trendingData.trend
					: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
				recommendation: trendingData
					? 'keep'
					: Math.random() > 0.3
					? 'optimize'
					: 'replace',
			};
		});

		return {
			hashtags: analysis,
			totalCount: hashtags.length,
			maxAllowed: platformData.maxHashtags,
			overallScore: Math.floor(Math.random() * 30) + 70,
			recommendations: generateOverallRecommendations(analysis, platformData),
		};
	};

	const generateOverallRecommendations = (hashtagAnalysis, platformData) => {
		const recs = [];

		if (hashtagAnalysis.length > platformData.maxHashtags) {
			recs.push(
				`Reduce hashtags to ${
					platformData.maxHashtags
				} for optimal ${platform.toUpperCase()} performance`
			);
		} else if (hashtagAnalysis.length < platformData.maxHashtags - 2) {
			recs.push(
				`Add ${
					platformData.maxHashtags - hashtagAnalysis.length
				} more hashtags to maximize reach`
			);
		}

		const lowPerforming = hashtagAnalysis.filter(
			(h) => h.performance === 'low'
		);
		if (lowPerforming.length > 0) {
			recs.push(
				`Replace ${lowPerforming.length} low-performing hashtags with trending alternatives`
			);
		}

		const downTrending = hashtagAnalysis.filter((h) => h.trend === 'down');
		if (downTrending.length > 0) {
			recs.push(`Consider replacing ${downTrending.length} declining hashtags`);
		}

		return recs.slice(0, 3); // Max 3 recommendations
	};

	const addHashtag = (hashtag) => {
		const platformData = platforms.find((p) => p.value === platform);
		if (currentHashtags.length >= platformData.maxHashtags) {
			setError(
				`Maximum ${
					platformData.maxHashtags
				} hashtags allowed for ${platform.toUpperCase()}`
			);
			return;
		}

		if (!currentHashtags.includes(hashtag)) {
			const newContent = content + (content ? ' ' : '') + `#${hashtag}`;
			setContent(newContent);
		}
	};

	const removeHashtag = (hashtag) => {
		const newContent = content
			.replace(new RegExp(`#${hashtag}\\b`, 'g'), '')
			.trim();
		setContent(newContent);
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		// You could add a toast notification here
	};

	const getPerformanceColor = (performance) => {
		switch (performance) {
			case 'high':
				return 'green';
			case 'medium':
				return 'orange';
			case 'low':
				return 'red';
			default:
				return 'gray';
		}
	};

	const getTrendIcon = (trend) => {
		switch (trend) {
			case 'up':
				return '📈';
			case 'down':
				return '📉';
			case 'stable':
				return '➡️';
			default:
				return '❓';
		}
	};

	return (
		<Box maxW='6xl' mx='auto'>
			<VStack spacing={6} align='stretch'>
				{/* Header */}
				<Box textAlign='center'>
					<Heading size='lg' mb={2} color='purple.500'>
						🏷️ Hashtag Optimization Tool
					</Heading>
					<Text color='gray.600'>
						AI-powered hashtag analysis and trending recommendations
					</Text>
				</Box>

				{/* Input Section */}
				<Card bg={cardBg} borderRadius='lg'>
					<CardBody>
						<VStack spacing={4} align='stretch'>
							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
								<FormControl>
									<FormLabel fontWeight='bold'>Platform</FormLabel>
									<Select
										value={platform}
										onChange={(e) => setPlatform(e.target.value)}>
										{platforms.map((p) => (
											<option key={p.value} value={p.value}>
												{p.label} (max {p.maxHashtags})
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl>
									<FormLabel fontWeight='bold'>Content Niche</FormLabel>
									<Select
										value={niche}
										onChange={(e) => setNiche(e.target.value)}>
										{niches.map((n) => (
											<option key={n.value} value={n.value}>
												{n.label}
											</option>
										))}
									</Select>
								</FormControl>
							</SimpleGrid>

							<FormControl>
								<FormLabel fontWeight='bold'>Your Content</FormLabel>
								<Textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder='Enter your post content with hashtags, or just hashtags to analyze...'
									rows={4}
								/>
								<HStack justify='space-between' mt={2}>
									<Text fontSize='sm' color='gray.500'>
										{currentHashtags.length} hashtags found
									</Text>
									<Text fontSize='sm' color='gray.500'>
										{content.length} characters
									</Text>
								</HStack>
							</FormControl>

							{/* Current Hashtags */}
							{currentHashtags.length > 0 && (
								<Box>
									<Text fontWeight='bold' mb={2}>
										Current Hashtags:
									</Text>
									<Wrap>
										{currentHashtags.map((tag, index) => (
											<WrapItem key={index}>
												<Tag size='md' colorScheme='blue' borderRadius='full'>
													<TagLabel>#{tag}</TagLabel>
													<TagCloseButton onClick={() => removeHashtag(tag)} />
												</Tag>
											</WrapItem>
										))}
									</Wrap>
								</Box>
							)}

							<Button
								colorScheme='purple'
								size='lg'
								onClick={analyzeHashtags}
								isLoading={loading}
								loadingText='Analyzing hashtags...'
								leftIcon={<Hash />}>
								🤖 Analyze & Optimize Hashtags
							</Button>
						</VStack>
					</CardBody>
				</Card>

				{/* Error Alert */}
				{error && (
					<Alert status='error' borderRadius='lg'>
						<AlertIcon />
						{error}
					</Alert>
				)}

				{/* Loading State */}
				{loading && (
					<Card bg={cardBg} borderRadius='lg'>
						<CardBody>
							<VStack spacing={4}>
								<Spinner size='xl' color='purple.500' />
								<Text>Analyzing hashtags with AI and trending data...</Text>
								<Progress
									size='lg'
									colorScheme='purple'
									isIndeterminate
									w='100%'
								/>
							</VStack>
						</CardBody>
					</Card>
				)}

				{/* Results */}
				{(analysis || suggestions.length > 0) && (
					<Tabs>
						<TabList>
							{analysis && <Tab>Current Analysis</Tab>}
							{suggestions.length > 0 && (
								<Tab>AI Suggestions ({suggestions.length})</Tab>
							)}
							<Tab>Trending Now</Tab>
						</TabList>

						<TabPanels>
							{/* Current Analysis Tab */}
							{analysis && (
								<TabPanel>
									<VStack spacing={6} align='stretch'>
										{/* Overview Stats */}
										<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
											<Stat textAlign='center'>
												<StatLabel>Overall Score</StatLabel>
												<StatNumber color='purple.500'>
													{analysis.overallScore}%
												</StatNumber>
												<StatHelpText>Optimization level</StatHelpText>
											</Stat>

											<Stat textAlign='center'>
												<StatLabel>Hashtags Used</StatLabel>
												<StatNumber color='blue.500'>
													{analysis.totalCount}/{analysis.maxAllowed}
												</StatNumber>
												<StatHelpText>Platform limit</StatHelpText>
											</Stat>

											<Stat textAlign='center'>
												<StatLabel>High Performers</StatLabel>
												<StatNumber color='green.500'>
													{
														analysis.hashtags.filter(
															(h) => h.performance === 'high'
														).length
													}
												</StatNumber>
												<StatHelpText>Top hashtags</StatHelpText>
											</Stat>

											<Stat textAlign='center'>
												<StatLabel>Need Replacement</StatLabel>
												<StatNumber color='red.500'>
													{
														analysis.hashtags.filter(
															(h) => h.recommendation === 'replace'
														).length
													}
												</StatNumber>
												<StatHelpText>Low performers</StatHelpText>
											</Stat>
										</SimpleGrid>

										{/* Hashtag Performance Table */}
										<Card>
											<CardHeader>
												<Heading size='md'>
													Hashtag Performance Analysis
												</Heading>
											</CardHeader>
											<CardBody>
												<TableContainer>
													<Table variant='simple'>
														<Thead>
															<Tr>
																<Th>Hashtag</Th>
																<Th>Performance</Th>
																<Th>Engagement</Th>
																<Th>Trend</Th>
																<Th>Recommendation</Th>
															</Tr>
														</Thead>
														<Tbody>
															{analysis.hashtags.map((hashtag, index) => (
																<Tr key={index}>
																	<Td fontWeight='bold'>#{hashtag.tag}</Td>
																	<Td>
																		<Badge
																			colorScheme={getPerformanceColor(
																				hashtag.performance
																			)}>
																			{hashtag.performance}
																		</Badge>
																	</Td>
																	<Td>
																		{(hashtag.engagement / 1000).toFixed(1)}K
																	</Td>
																	<Td>
																		{getTrendIcon(hashtag.trend)}{' '}
																		{hashtag.trend}
																	</Td>
																	<Td>
																		<Badge
																			colorScheme={
																				hashtag.recommendation === 'keep'
																					? 'green'
																					: 'orange'
																			}>
																			{hashtag.recommendation}
																		</Badge>
																	</Td>
																</Tr>
															))}
														</Tbody>
													</Table>
												</TableContainer>
											</CardBody>
										</Card>

										{/* Recommendations */}
										{analysis.recommendations.length > 0 && (
											<Card>
												<CardHeader>
													<Heading size='md'>
														💡 Optimization Recommendations
													</Heading>
												</CardHeader>
												<CardBody>
													<VStack align='stretch' spacing={2}>
														{analysis.recommendations.map((rec, index) => (
															<Box
																key={index}
																bg='purple.50'
																p={3}
																borderRadius='md'>
																<Text>• {rec}</Text>
															</Box>
														))}
													</VStack>
												</CardBody>
											</Card>
										)}
									</VStack>
								</TabPanel>
							)}

							{/* AI Suggestions Tab */}
							{suggestions.length > 0 && (
								<TabPanel>
									<VStack spacing={4} align='stretch'>
										<Box>
											<Heading size='md' mb={3}>
												🤖 AI-Powered Hashtag Suggestions
											</Heading>
											<Text color='gray.600' fontSize='sm'>
												Based on your content, platform, and trending data
											</Text>
										</Box>

										<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
											{suggestions.map((suggestion, index) => (
												<Card
													key={index}
													borderWidth='1px'
													borderColor={borderColor}>
													<CardBody>
														<Flex align='center' mb={3}>
															<Text fontWeight='bold' fontSize='lg'>
																#{suggestion.tag}
															</Text>
															<Spacer />
															<Badge colorScheme='green'>
																{suggestion.confidence}%
															</Badge>
														</Flex>

														<VStack align='stretch' spacing={2}>
															<HStack>
																<Text fontSize='sm' color='gray.600'>
																	Engagement:
																</Text>
																<Text fontSize='sm' fontWeight='bold'>
																	{(suggestion.engagement / 1000).toFixed(1)}K
																</Text>
															</HStack>

															<HStack>
																<Text fontSize='sm' color='gray.600'>
																	Trend:
																</Text>
																<Text fontSize='sm'>
																	{getTrendIcon(suggestion.trend)}{' '}
																	{suggestion.trend}
																</Text>
															</HStack>

															<Text fontSize='xs' color='gray.500'>
																{suggestion.reason}
															</Text>

															<HStack mt={3}>
																<Button
																	size='sm'
																	colorScheme='purple'
																	onClick={() => addHashtag(suggestion.tag)}
																	flex={1}>
																	Add to Content
																</Button>
																<Tooltip label='Copy hashtag'>
																	<IconButton
																		size='sm'
																		icon={<Copy />}
																		onClick={() =>
																			copyToClipboard(`#${suggestion.tag}`)
																		}
																	/>
																</Tooltip>
															</HStack>
														</VStack>
													</CardBody>
												</Card>
											))}
										</SimpleGrid>
									</VStack>
								</TabPanel>
							)}

							{/* Trending Tab */}
							<TabPanel>
								<VStack spacing={4} align='stretch'>
									<Flex align='center'>
										<Heading size='md'>
											📈 Trending in{' '}
											{niches.find((n) => n.value === niche)?.label}
										</Heading>
										<Spacer />
										<Button
											size='sm'
											leftIcon={<RefreshCw />}
											onClick={loadTrendingHashtags}>
											Refresh
										</Button>
									</Flex>

									<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
										{trendingHashtags.map((hashtag, index) => (
											<Card
												key={index}
												borderWidth='1px'
												borderColor={borderColor}>
												<CardBody>
													<VStack align='stretch' spacing={2}>
														<Flex align='center'>
															<Text fontWeight='bold'>#{hashtag.tag}</Text>
															<Spacer />
															<Text fontSize='sm'>
																{getTrendIcon(hashtag.trend)}
															</Text>
														</Flex>

														<Progress
															value={(hashtag.engagement / 1000000) * 100}
															size='sm'
															colorScheme='purple'
														/>

														<HStack justify='space-between' fontSize='sm'>
															<Text color='gray.600'>
																{(hashtag.engagement / 1000).toFixed(1)}K
															</Text>
															<Text color='gray.600'>
																{(hashtag.volume / 1000).toFixed(1)}K posts
															</Text>
														</HStack>

														<Button
															size='sm'
															colorScheme='purple'
															variant='outline'
															onClick={() => addHashtag(hashtag.tag)}>
															Add to Content
														</Button>
													</VStack>
												</CardBody>
											</Card>
										))}
									</SimpleGrid>
								</VStack>
							</TabPanel>
						</TabPanels>
					</Tabs>
				)}
			</VStack>
		</Box>
	);
};

export default HashtagOptimizer;
