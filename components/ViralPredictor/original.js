import { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Card,
	CardBody,
	Heading,
	Text,
	VStack,
	HStack,
	Input,
	FormControl,
	FormLabel,
	FormHelperText,
	Textarea,
	Select,
	Badge,
	Progress,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	SimpleGrid,
	Divider,
	Alert,
	AlertIcon,
	Spinner,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	useColorModeValue,
	Icon,
} from '@chakra-ui/react';
import { CheckCircle, TrendingUp, Users, Clock } from 'lucide-react';

const ViralPredictor = () => {
	// State management
	const [textContent, setTextContent] = useState(
		"🚀 Bitcoin just hit $100K! This is the moment we've all been waiting for! #BTC #Crypto #ToTheMoon"
	);
	const [username, setUsername] = useState(''); // NEW: Twitter username
	const [contentType, setContentType] = useState('text');
	const [niche, setNiche] = useState('cryptocurrency');
	const [loading, setLoading] = useState(false);
	const [fetchingCreator, setFetchingCreator] = useState(false); // NEW: Creator fetching state
	const [creatorData, setCreatorData] = useState(null); // NEW: Creator data from API
	const [prediction, setPrediction] = useState(null);
	const [error, setError] = useState('');

	// UI Theme
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	// Content type options
	const contentTypes = [
		{ value: 'text', label: '📝 Text Tweet' },
		{ value: 'image', label: '📸 Image Post' },
		{ value: 'video', label: '🎥 Video Post' },
		{ value: 'thread', label: '🧵 Thread' },
		{ value: 'poll', label: '📊 Poll' },
		{ value: 'quote', label: '💬 Quote Tweet' },
		{ value: 'reply', label: '↩️ Reply' },
	];

	// Niche options (same as before)
	const niches = [
		{ value: 'cryptocurrency', label: '₿ Cryptocurrency', category: 'Finance' },
		{ value: 'technology', label: '💻 Technology', category: 'Tech' },
		{ value: 'business', label: '💼 Business', category: 'Business' },
		{ value: 'sports', label: '⚽ Sports', category: 'Entertainment' },
		{
			value: 'entertainment',
			label: '🎬 Entertainment',
			category: 'Entertainment',
		},
		{ value: 'health', label: '💊 Health & Wellness', category: 'Lifestyle' },
		{ value: 'finance', label: '💰 Finance & Investing', category: 'Finance' },
		{ value: 'news', label: '📰 Breaking News', category: 'News' },
		{ value: 'politics', label: '🏛️ Politics', category: 'News' },
		{ value: 'education', label: '📚 Education', category: 'Education' },
		{ value: 'travel', label: '✈️ Travel', category: 'Lifestyle' },
		{ value: 'food', label: '🍔 Food & Cooking', category: 'Lifestyle' },
		{ value: 'fashion', label: '👗 Fashion & Style', category: 'Lifestyle' },
		{ value: 'gaming', label: '🎮 Gaming', category: 'Entertainment' },
		{ value: 'music', label: '🎵 Music', category: 'Entertainment' },
		{ value: 'art', label: '🎨 Art & Design', category: 'Creative' },
		{ value: 'photography', label: '📷 Photography', category: 'Creative' },
		{ value: 'science', label: '🔬 Science', category: 'Education' },
		{ value: 'ai', label: '🤖 AI & Machine Learning', category: 'Technology' },
		{ value: 'climate', label: '🌍 Climate & Environment', category: 'News' },
		{
			value: 'startup',
			label: '🚀 Startups & Entrepreneurship',
			category: 'Business',
		},
		{
			value: 'marketing',
			label: '📈 Marketing & Growth',
			category: 'Business',
		},
		{
			value: 'personal-development',
			label: '🌟 Personal Development',
			category: 'Lifestyle',
		},
		{ value: 'memes', label: '😂 Memes & Humor', category: 'Entertainment' },
		{ value: 'web3', label: '🌐 Web3 & Blockchain', category: 'Emerging' },
		{ value: 'nft', label: '🖼️ NFTs & Digital Art', category: 'Emerging' },
		{ value: 'defi', label: '🏦 DeFi & Trading', category: 'Emerging' },
		{ value: 'metaverse', label: '🌐 Metaverse', category: 'Emerging' },
		{
			value: 'sustainability',
			label: '🌱 Sustainability',
			category: 'Emerging',
		},
		{ value: 'space', label: '🚀 Space & Astronomy', category: 'Emerging' },
		{ value: 'other', label: '📋 Option Not Listed', category: 'Other' },
	];

	// NEW: Fetch creator data automatically when username changes
	const fetchCreatorData = async (twitterUsername) => {
		if (!twitterUsername || twitterUsername.length < 3) {
			setCreatorData(null);
			return;
		}

		setFetchingCreator(true);
		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: twitterUsername.replace('@', ''),
					network: 'twitter',
				}),
			});

			const data = await response.json();

			if (data.success && data.creator) {
				setCreatorData({
					handle: data.creator.handle,
					followerCount: data.creator.followerCount || 0,
					verified: data.creator.verified || false,
					authorityScore: data.creator.authorityScore || 0,
					mcpSupported: data.creator.mcpSupported || false,
				});
			} else {
				setCreatorData(null);
			}
		} catch (err) {
			console.error('Creator fetch error:', err);
			setCreatorData(null);
		} finally {
			setFetchingCreator(false);
		}
	};

	// NEW: Auto-fetch creator data when username changes (with debounce)
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			fetchCreatorData(username);
		}, 500); // 500ms debounce

		return () => clearTimeout(timeoutId);
	}, [username]);

	// Enhanced viral probability analysis with real creator data
	const analyzeViralProbability = async () => {
		if (!textContent.trim()) {
			setError('Please enter content to analyze');
			return;
		}

		if (username && !creatorData) {
			setError(
				'Unable to fetch creator data. Please verify the username or proceed without it.'
			);
			return;
		}

		setLoading(true);
		setError('');
		setPrediction(null);

		try {
			// Prepare post data with real creator data from LunarCrush API
			const postData = {
				text: textContent,
				platform: 'twitter',
				niche,
				contentType,
				username: username || null,
				// Use real creator data if available, otherwise use defaults
				creator: creatorData
					? {
							follower_count: creatorData.followerCount,
							verified: creatorData.verified,
							handle: creatorData.handle,
							authority_score: creatorData.authorityScore,
					  }
					: {
							follower_count: 10000, // Default fallback
							verified: false,
							handle: 'anonymous',
					  },
				created_time: new Date().toISOString(),
				hashtags: extractHashtags(textContent),
				mentions: extractMentions(textContent),
				media_count: ['image', 'video'].includes(contentType) ? 1 : 0,
			};

			console.log(
				'📊 Sending analysis request with real creator data:',
				postData
			);

			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ postData }),
			});

			const data = await response.json();

			if (data.success) {
				setPrediction(data.prediction);
			} else {
				setError(data.error || 'Analysis failed. Please try again.');
			}
		} catch (err) {
			setError('Network error. Please try again.');
			console.error('Analysis error:', err);
		} finally {
			setLoading(false);
		}
	};

	// Helper functions to extract hashtags and mentions
	const extractHashtags = (text) => {
		const hashtagRegex = /#[a-zA-Z0-9_]+/g;
		return text.match(hashtagRegex) || [];
	};

	const extractMentions = (text) => {
		const mentionRegex = /@[a-zA-Z0-9_]+/g;
		return text.match(mentionRegex) || [];
	};

	// Confidence color mapping
	const getConfidenceColor = (confidence) => {
		if (confidence >= 80) return 'green';
		if (confidence >= 60) return 'blue';
		if (confidence >= 40) return 'yellow';
		if (confidence >= 20) return 'orange';
		return 'red';
	};

	const getViralLabel = (confidence) => {
		if (confidence >= 80) return '🔥 Ultra Viral';
		if (confidence >= 60) return '📈 High Viral';
		if (confidence >= 40) return '📊 Moderate Viral';
		if (confidence >= 20) return '📉 Low Viral';
		return '❌ Minimal Viral';
	};

	return (
		<VStack spacing={6} align='stretch' w='100%' maxW='4xl' mx='auto'>
			{/* Header */}
			<Box textAlign='center'>
				<Heading size='lg' mb={2}>
					✨ Twitter Viral Probability Analyzer
				</Heading>
				<Text color='gray.600'>
					AI-powered analysis with content optimization, timing insights, and
					hashtag intelligence
				</Text>
				<Badge colorScheme='purple' mt={2}>
					ENHANCED WITH CONTENT • TIMING • HASHTAG INTELLIGENCE
				</Badge>
			</Box>

			{/* Main Input Form */}
			<Card bg={cardBg} borderRadius='lg'>
				<CardBody>
					<Tabs variant='enclosed'>
						<TabList>
							<Tab>🎯 Analyze Post</Tab>
							<Tab>📊 Results & Optimization</Tab>
						</TabList>

						<TabPanels>
							{/* Analysis Tab */}
							<TabPanel>
								<VStack spacing={4}>
									<Heading size='md'>Post Analysis</Heading>
									<Text fontSize='sm' color='gray.600'>
										Enter your tweet content and creator details for
										comprehensive viral analysis
									</Text>

									{/* NEW: Twitter Username Input with Auto-Fetch */}
									<FormControl>
										<FormLabel fontWeight='bold'>
											🔍 Twitter Username (Auto-Fetch Creator Data)
										</FormLabel>
										<HStack>
											<Input
												value={username}
												onChange={(e) => setUsername(e.target.value)}
												placeholder='elonmusk'
												bg={cardBg}
												size='lg'
											/>
											{fetchingCreator && (
												<Spinner size='sm' color='blue.500' />
											)}
										</HStack>
										<FormHelperText>
											{username && creatorData ? (
												<HStack spacing={2}>
													<Badge colorScheme='green'>✓ Data Fetched</Badge>
													<Text fontSize='xs'>
														@{creatorData.handle} •{' '}
														{creatorData.followerCount.toLocaleString()}{' '}
														followers
														{creatorData.verified && ' • Verified'}
													</Text>
												</HStack>
											) : username && !fetchingCreator ? (
												<Badge colorScheme='orange'>
													⚠ Creator not found or processing...
												</Badge>
											) : (
												'Enter Twitter username to auto-fetch real follower data via LunarCrush API'
											)}
										</FormHelperText>
									</FormControl>

									{/* Tweet Content */}
									<FormControl>
										<FormLabel fontWeight='bold'>Tweet Content</FormLabel>
										<Textarea
											value={textContent}
											onChange={(e) => setTextContent(e.target.value)}
											placeholder='Enter your tweet content here...'
											rows={4}
											bg={cardBg}
										/>
										<FormHelperText>
											{textContent.length}/280 characters •{' '}
											{extractHashtags(textContent).length} hashtags •{' '}
											{extractMentions(textContent).length} mentions
										</FormHelperText>
									</FormControl>

									{/* Content Type & Niche */}
									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w='100%'>
										<FormControl>
											<FormLabel fontWeight='bold'>Content Type</FormLabel>
											<Select
												value={contentType}
												onChange={(e) => setContentType(e.target.value)}
												bg={cardBg}>
												{contentTypes.map((type) => (
													<option key={type.value} value={type.value}>
														{type.label}
													</option>
												))}
											</Select>
										</FormControl>

										<FormControl>
											<FormLabel fontWeight='bold'>Niche/Category</FormLabel>
											<Select
												value={niche}
												onChange={(e) => setNiche(e.target.value)}
												bg={cardBg}>
												{niches.map((n) => (
													<option key={n.value} value={n.value}>
														{n.label}
													</option>
												))}
											</Select>
										</FormControl>
									</SimpleGrid>

									{/* Analyze Button */}
									<Button
										colorScheme='purple'
										size='lg'
										onClick={analyzeViralProbability}
										isLoading={loading}
										loadingText='Analyzing with AI...'
										w='100%'
										leftIcon={<Icon as={TrendingUp} />}>
										✨ Analyze Viral Potential + Get Optimization Tips
									</Button>
								</VStack>
							</TabPanel>

							{/* Results Tab */}
							<TabPanel>
								{prediction ? (
									<VStack spacing={6} align='stretch'>
										{/* Main Prediction Score */}
										<Box textAlign='center'>
											<Badge
												fontSize='lg'
												p={3}
												borderRadius='full'
												colorScheme={getConfidenceColor(prediction.confidence)}>
												{getViralLabel(prediction.confidence)}
											</Badge>
											<Heading
												size='2xl'
												mt={2}
												color={`${getConfidenceColor(
													prediction.confidence
												)}.500`}>
												{prediction.confidence}%
											</Heading>
											<Text color='gray.600' mt={2}>
												Estimated Viral Probability
											</Text>
											<Progress
												value={prediction.confidence}
												size='lg'
												colorScheme={getConfidenceColor(prediction.confidence)}
												mt={4}
												borderRadius='full'
											/>
										</Box>

										<Divider />

										{/* Twitter-Specific Metrics */}
										<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
											<Stat textAlign='center'>
												<StatLabel>Twitter Optimization</StatLabel>
												<StatNumber fontSize='2xl'>
													{prediction.platformFit ||
														Math.floor(prediction.confidence * 0.9)}
													%
												</StatNumber>
												<StatHelpText>Platform Fit</StatHelpText>
											</Stat>

											<Stat textAlign='center'>
												<StatLabel>Engagement Potential</StatLabel>
												<StatNumber fontSize='2xl'>
													{prediction.expectedEngagement ||
														Math.floor(prediction.confidence * 12)}
												</StatNumber>
												<StatHelpText>Expected Interactions</StatHelpText>
											</Stat>

											<Stat textAlign='center'>
												<StatLabel>Content Score</StatLabel>
												<StatNumber fontSize='2xl'>
													{prediction.contentScore ||
														Math.floor(prediction.confidence * 0.8)}
													%
												</StatNumber>
												<StatHelpText>Content Quality</StatHelpText>
											</Stat>

											<Stat textAlign='center'>
												<StatLabel>Creator Authority</StatLabel>
												<StatNumber fontSize='2xl'>
													{creatorData
														? Math.floor(creatorData.authorityScore * 100)
														: 'N/A'}
													%
												</StatNumber>
												<StatHelpText>
													{creatorData
														? `${creatorData.followerCount.toLocaleString()} followers`
														: 'Not Available'}
												</StatHelpText>
											</Stat>
										</SimpleGrid>

										{/* AI Optimization Suggestions */}
										{prediction.optimizedVersions &&
											prediction.optimizedVersions.length > 0 && (
												<Box>
													<Heading size='md' mb={4}>
														🚀 AI-Optimized Versions
													</Heading>
													<VStack spacing={3}>
														{prediction.optimizedVersions
															.slice(0, 3)
															.map((version, index) => (
																<Alert
																	key={index}
																	status='info'
																	borderRadius='lg'>
																	<AlertIcon />
																	<VStack align='start' spacing={1} flex={1}>
																		<Text fontWeight='bold'>
																			Version {index + 1}:
																		</Text>
																		<Text fontSize='sm'>{version}</Text>
																	</VStack>
																</Alert>
															))}
													</VStack>
												</Box>
											)}

										{/* Key Insights */}
										{prediction.insights && (
											<Box>
												<Heading size='md' mb={4}>
													💡 Key Insights
												</Heading>
												<VStack spacing={2} align='start'>
													{prediction.insights.map((insight, index) => (
														<HStack key={index} align='start'>
															<Icon as={CheckCircle} color='green.500' mt={1} />
															<Text fontSize='sm'>{insight}</Text>
														</HStack>
													))}
												</VStack>
											</Box>
										)}
									</VStack>
								) : (
									<Box textAlign='center' py={8}>
										<Text color='gray.500'>
											Click "Analyze Viral Potential" to see your results and
											optimization tips
										</Text>
									</Box>
								)}
							</TabPanel>
						</TabPanels>
					</Tabs>
				</CardBody>
			</Card>

			{/* Error Display */}
			{error && (
				<Alert status='error' borderRadius='lg'>
					<AlertIcon />
					<Text>{error}</Text>
				</Alert>
			)}

			{/* Loading State */}
			{loading && (
				<Card
					bg={cardBg}
					borderRadius='lg'
					borderWidth='2px'
					borderColor='purple.200'>
					<CardBody>
						<VStack spacing={4}>
							<Spinner size='lg' color='purple.500' />
							<VStack spacing={2}>
								<Text fontWeight='bold' color='purple.600'>
									🤖 AI Analysis in Progress
								</Text>
								<Text fontSize='sm' color='gray.600' textAlign='center'>
									• Processing content with Gemini AI
									<br />
									• Analyzing viral potential with ML algorithms
									<br />• Generating optimization recommendations
									{creatorData && (
										<>
											<br />• Using real creator data: @{creatorData.handle} (
											{creatorData.followerCount.toLocaleString()} followers)
										</>
									)}
								</Text>
							</VStack>
						</VStack>
					</CardBody>
				</Card>
			)}
		</VStack>
	);
};

export default ViralPredictor;
