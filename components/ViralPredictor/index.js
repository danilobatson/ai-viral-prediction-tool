import {
	Box,
	VStack,
	HStack,
	Text,
	Textarea,
	Input,
	Button,
	Progress,
	Badge,
	useToast,
	SimpleGrid,
	Icon,
	Divider,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Container,
	Heading,
	Card,
	Alert,
	AlertIcon,
	AlertDescription,
	CardBody,
	CardHeader,
	Wrap,
	WrapItem,
	Link,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
	FaHeart,
	FaReply,
	FaShare,
	FaClock,
	FaLightbulb,
	FaHashtag,
	FaTwitter,
	FaBrain,
	FaExternalLinkAlt,
	FaDatabase,
} from 'react-icons/fa';
import { formatNumber } from '../../lib/number-utils';
import TwitterProgress from '../ui/SocialMediaProgress';
import ViralMeter from '../ui/ViralMeter';
import GlassCard from '../ui/GlassCard';
import ConfettiEffect from '../ui/ConfettiEffect';
import ModernHero from '../ui/ModernHero';
import Footer from '../ui/Footer';

const MotionBox = motion(Box);

export default function ViralPredictor() {
	const [content, setContent] = useState('');
	const [creator, setCreator] = useState('');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState(null);
	const [error, setError] = useState('');
	const [creatorError, setCreatorError] = useState('');
	const [progressStep, setProgressStep] = useState('');
	const [progressMessage, setProgressMessage] = useState('');
	const [showConfetti, setShowConfetti] = useState(false);
	const predictorRef = useRef(null);
	const toast = useToast();

	const scrollToPredictor = () => {
		predictorRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	const updateProgress = (step, message = '') => {
		console.log(`🔄 Progress: ${step} - ${message}`);
		setProgressStep(step);
		setProgressMessage(message);
	};

	const handlePredict = async () => {
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
			// Start the streaming request
			const response = await fetch('/api/analyze-stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content: content.trim(),
					creator: creator.trim().replace(/^@+/, '') || undefined,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to start analysis');
			}

			// Use proper streaming with EventSource-like behavior
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');

				// Keep the last incomplete line in buffer
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						try {
							const update = JSON.parse(line.slice(6));

							// Update progress with real-time messages
							updateProgress(update.step, update.message);
							console.log('📡 Streaming update:', update.step, update.message);

							// Handle special events
							if (update.step === 'success' && update.data?.creatorData) {
								console.log(
									'📊 Real-time creator data:',
									update.data.creatorData
								);
							}

							if (update.step === 'complete' && update.data) {
								updateProgress('complete', 'Analysis complete!');
								setResults(update.data);

								if (update.data.viralProbability >= 70) {
									setTimeout(() => setShowConfetti(true), 500);
								}

								toast({
									title: `${update.data.viralProbability}% Viral Potential!`,
									description: update.data.hasCreatorData
										? '𝕏 Enhanced with real-time account analytics'
										: '📊 General content analysis',
									status:
										update.data.viralProbability >= 70 ? 'success' : 'info',
									duration: 5000,
									isClosable: true,
								});

								// Exit streaming loop
								reader.cancel();
								return;
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

				// Force UI update by adding small delay
				await new Promise((resolve) => setTimeout(resolve, 50));
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
	};

	const getViralCategoryColor = (category) => {
		switch (category) {
			case 'Ultra High':
				return 'red';
			case 'High':
				return 'orange';
			case 'Moderate':
				return 'yellow';
			case 'Low':
				return 'gray';
			default:
				return 'gray';
		}
	};

	const getTwitterEmoji = (probability) => {
		if (probability >= 80) return '🔥';
		if (probability >= 70) return '🚀';
		if (probability >= 60) return '💫';
		if (probability >= 50) return '✨';
		return '👍';
	};

	const cleanHandle = (handle) => {
		return handle.trim().replace(/^@+/, '');
	};

	return (
		<Box minH='100vh' bg='gray.50'>
			<ConfettiEffect
				trigger={showConfetti}
				viralProbability={results?.viralProbability}
			/>

			{/* Modern Hero Section */}
			<ModernHero onScrollToPredictor={scrollToPredictor} />

			{/* Main Content */}
			<Container maxW='6xl' py={20} ref={predictorRef}>
				<VStack spacing={12} align='stretch'>
					{/* Input Section */}
					<MotionBox
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}>
						<GlassCard p={8}>
							<VStack spacing={6}>
								<VStack spacing={2} textAlign='center'>
									<Heading
										size='lg'
										bgGradient='linear(to-r, gray.700, black)'
										bgClip='text'>
										𝕏 Analyze Your Original Tweet
									</Heading>
									<Text color='gray.600'>
										Paste your original tweet content and get instant viral
										predictions. Retweets not supported.
									</Text>
								</VStack>

								<Textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder="Example original tweet:

🚀 Bitcoin just broke through $100K resistance!

The institutional adoption we've been waiting for is finally here. MicroStrategy, Tesla, and now even pension funds are allocating to BTC.

This is just the beginning of the next bull run. 📈

#Bitcoin #BTC #CryptoBull #ToTheMoon"
									size='lg'
									minH='200px'
									resize='vertical'
									bg='white'
									border='2px solid'
									borderColor='transparent'
									_focus={{
										borderColor: 'gray.700',
										boxShadow: '0 0 0 1px gray.700',
									}}
									borderRadius='xl'
								/>

								<HStack w='full' spacing={4}>
									<Input
										value={creator}
										onChange={(e) => setCreator(e.target.value)}
										placeholder='Your 𝕏 handle: username (no @ needed)'
										size='lg'
										flex={1}
										bg='white'
										border='2px solid'
										borderColor='transparent'
										_focus={{
											borderColor: 'gray.700',
											boxShadow: '0 0 0 1px gray.700',
										}}
										borderRadius='xl'
									/>
									<Button
										colorScheme='gray'
										onClick={handlePredict}
										isLoading={loading}
										loadingText='Analyzing...'
										size='lg'
										minW='200px'
										borderRadius='xl'
										bg='black'
										color='white'
										_hover={{
											bg: 'gray.800',
											transform: 'translateY(-2px)',
											boxShadow: 'xl',
										}}
										_active={{
											transform: 'translateY(0px)',
										}}>
										𝕏 Predict Viral Potential
									</Button>
								</HStack>

								{creator.trim() && (
									<Text fontSize='sm' color='gray.500'>
										Will analyze: @{cleanHandle(creator)}&apos;s engagement
										patterns
									</Text>
								)}
							</VStack>
						</GlassCard>
					</MotionBox>

					{/* Loading State */}
					{loading && (
						<MotionBox
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}>
							<TwitterProgress
								currentStep={progressStep}
								currentMessage={progressMessage}
								error={error}
							/>
						</MotionBox>
					)}

					{/* Creator Error Warning */}
					{creatorError && !loading && (
						<MotionBox
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}>
							<Alert status='warning' borderRadius='lg'>
								<AlertIcon />
								<Box>
									<Text fontWeight='bold'>𝕏 Account Lookup Failed</Text>
									<AlertDescription>{creatorError}</AlertDescription>
									<Text fontSize='sm' mt={2} color='gray.600'>
										Don&apos;t worry! We&apos;ll still analyze your original
										tweet content with general patterns.
									</Text>
								</Box>
							</Alert>
						</MotionBox>
					)}

					{/* Results Section */}
					{results && !loading && (
						<MotionBox
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}>
							<VStack spacing={8}>
								{/* Viral Probability Meter */}
								<GlassCard p={8} textAlign='center'>
									<VStack spacing={6}>
										<ViralMeter
											probability={results.viralProbability}
											category={results.viralCategory}
											isAnimating={true}
										/>

										<VStack spacing={2}>
											<HStack spacing={2}>
												<Text fontSize='2xl'>
													{getTwitterEmoji(results.viralProbability)}
												</Text>
												<Badge
													colorScheme={getViralCategoryColor(
														results.viralCategory
													)}
													fontSize='lg'
													px={4}
													py={2}
													borderRadius='full'>
													{results.viralCategory} Viral Potential
												</Badge>
											</HStack>
											<Text color='gray.600'>
												{results.hasCreatorData
													? '✅ Personalized for your 𝕏 account'
													: creatorError
													? "📊 General analysis (couldn't get account data)"
													: '📊 General original tweet analysis'}
											</Text>
										</VStack>
									</VStack>
								</GlassCard>

								{/* Expected 𝕏 Engagement */}
								{results.hasCreatorData && results.creatorData && (
									<Card bg='white' borderRadius='xl' boxShadow='lg'>
										<CardHeader pb={2}>
											<HStack spacing={3}>
												<Icon as={FaTwitter} color='black' boxSize={5} />
												<Heading size='md'>Your Expected 𝕏 Engagement</Heading>
												<Badge colorScheme='blue' fontSize='xs'>
													Powered by LunarCrush MCP
												</Badge>
											</HStack>
										</CardHeader>
										<CardBody>
											<SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
												{[
													{
														label: '𝕏 Handle',
														value: `@${results.creatorData.handle}`,
														icon: FaTwitter,
														color: 'gray',
													},
													{
														label: 'Followers',
														value: formatNumber(results.creatorData.followers),
														icon: FaHeart,
														color: 'red',
													},
													{
														label: 'Avg Engagement',
														value: formatNumber(
															results.creatorData.engagements
														),
														icon: FaReply,
														color: 'green',
													},
													{
														label: 'This Tweet',
														value: formatNumber(results.expectedEngagement),
														icon: FaShare,
														color: 'purple',
													},
												].map((stat, index) => (
													<MotionBox
														key={stat.label}
														initial={{ opacity: 0, y: 20 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ duration: 0.5, delay: index * 0.1 }}>
														<Stat textAlign='center'>
															<HStack justify='center' mb={2}>
																<Icon
																	as={stat.icon}
																	color={`${stat.color}.500`}
																/>
															</HStack>
															<StatNumber
																fontSize='xl'
																color={`${stat.color}.500`}>
																{stat.value}
															</StatNumber>
															<StatLabel fontSize='sm' color='gray.600'>
																{stat.label}
															</StatLabel>
														</Stat>
													</MotionBox>
												))}
											</SimpleGrid>
										</CardBody>
									</Card>
								)}

								{/* 𝕏 Psychology Analysis */}
								{results.psychologyScore && (
									<Card bg='white' borderRadius='xl' boxShadow='lg'>
										<CardHeader pb={2}>
											<HStack spacing={3}>
												<Icon as={FaBrain} color='purple.500' boxSize={5} />
												<Heading size='md'>Why People Will Engage on 𝕏</Heading>
											</HStack>
										</CardHeader>
										<CardBody>
											<SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
												{[
													{
														key: 'emotional_appeal',
														label: 'Emotional Impact',
														desc: 'Makes people feel something',
														emoji: '😍',
													},
													{
														key: 'shareability',
														label: 'Share Value',
														desc: 'Worth sharing to followers',
														emoji: '🔄',
													},
													{
														key: 'practicalValue',
														label: 'Useful Content',
														desc: 'Helpful or informative',
														emoji: '💡',
													},
													{
														key: 'story',
														label: 'Story Appeal',
														desc: 'Has narrative hook',
														emoji: '📖',
													},
												].map((item, index) => (
													<MotionBox
														key={item.key}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ duration: 0.5, delay: index * 0.1 }}>
														<Stat textAlign='center'>
															<Text fontSize='2xl' mb={2}>
																{item.emoji}
															</Text>
															<StatNumber fontSize='3xl' color='purple.500'>
																{results.psychologyScore[item.key]}%
															</StatNumber>
															<StatLabel fontWeight='bold'>
																{item.label}
															</StatLabel>
															<StatHelpText fontSize='xs'>
																{item.desc}
															</StatHelpText>
														</Stat>
													</MotionBox>
												))}
											</SimpleGrid>
										</CardBody>
									</Card>
								)}

								{/* 𝕏 Tips & Hashtags */}
								<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w='full'>
									{/* 𝕏 Optimization Tips */}
									{results.recommendations &&
										results.recommendations.length > 0 && (
											<Card bg='white' borderRadius='xl' boxShadow='lg'>
												<CardHeader pb={2}>
													<HStack spacing={3}>
														<Icon
															as={FaLightbulb}
															color='orange.500'
															boxSize={5}
														/>
														<Heading size='md'>
															How to Get More Engagement
														</Heading>
													</HStack>
												</CardHeader>
												<CardBody>
													<VStack align='start' spacing={4}>
														{results.recommendations.map((rec, index) => (
															<MotionBox
																key={index}
																initial={{ opacity: 0, x: -20 }}
																animate={{ opacity: 1, x: 0 }}
																transition={{
																	duration: 0.5,
																	delay: index * 0.1,
																}}>
																<HStack align='start' spacing={3}>
																	<Badge
																		colorScheme='orange'
																		borderRadius='full'
																		minW='24px'
																		h='24px'
																		display='flex'
																		alignItems='center'
																		justifyContent='center'>
																		{index + 1}
																	</Badge>
																	<Text fontSize='sm'>{rec}</Text>
																</HStack>
															</MotionBox>
														))}
													</VStack>
												</CardBody>
											</Card>
										)}

									{/* Hashtags & Best Times */}
									<VStack spacing={8}>
										{/* Trending Hashtags */}
										{results.optimizedHashtags &&
											results.optimizedHashtags.length > 0 && (
												<Card
													bg='white'
													borderRadius='xl'
													boxShadow='lg'
													w='full'>
													<CardHeader pb={2}>
														<HStack spacing={3}>
															<Icon
																as={FaHashtag}
																color='blue.500'
																boxSize={5}
															/>
															<Heading size='md'>Trending Hashtags</Heading>
														</HStack>
													</CardHeader>
													<CardBody>
														<Wrap>
															{results.optimizedHashtags.map((tag, index) => (
																<WrapItem key={index}>
																	<MotionBox
																		initial={{ opacity: 0, scale: 0.8 }}
																		animate={{ opacity: 1, scale: 1 }}
																		transition={{
																			duration: 0.3,
																			delay: index * 0.05,
																		}}
																		whileHover={{ scale: 1.05 }}>
																		<Badge
																			colorScheme='blue'
																			variant='outline'
																			fontSize='sm'
																			px={3}
																			py={1}
																			borderRadius='full'>
																			{tag}
																		</Badge>
																	</MotionBox>
																</WrapItem>
															))}
														</Wrap>
													</CardBody>
												</Card>
											)}

										{/* Best Tweet Times */}
										{results.optimalTiming && (
											<Card
												bg='white'
												borderRadius='xl'
												boxShadow='lg'
												w='full'>
												<CardHeader pb={2}>
													<HStack spacing={3}>
														<Icon as={FaClock} color='green.500' boxSize={5} />
														<Heading size='md'>Best Times to Tweet</Heading>
													</HStack>
												</CardHeader>
												<CardBody>
													<VStack align='start' spacing={3}>
														<HStack>
															<Text fontWeight='bold' color='green.500'>
																📅 Best Days:
															</Text>
															<Text>Tuesday - Thursday</Text>
														</HStack>
														<HStack>
															<Text fontWeight='bold' color='green.500'>
																🕐 Peak Hours:
															</Text>
															<Text>9AM - 12PM</Text>
														</HStack>
														<HStack>
															<Text fontWeight='bold' color='green.500'>
																🌍 Time Zone:
															</Text>
															<Text>EST</Text>
														</HStack>
													</VStack>
												</CardBody>
											</Card>
										)}
									</VStack>
								</SimpleGrid>

								{/* LunarCrush MCP Branding */}
								<Card bg='gray.50' borderRadius='xl' boxShadow='sm'>
									<CardBody>
										<VStack spacing={4} textAlign='center'>
											<Divider />
											<HStack spacing={3}>
												<Icon as={FaDatabase} color='blue.500' boxSize={5} />
												<VStack spacing={1} align='start' alignItems='center'>
													<Text
														fontWeight='bold'
														color='gray.800'
														>
														Powered by LunarCrush MCP
													</Text>
													<Text fontSize='sm' color='gray.600'>
														Real-time social data via Model Context Protocol
													</Text>
													<Link
														href='https://lunarcrush.com/developers/api/endpoints'
														isExternal
														color='blue.500'
														fontSize='sm'
														fontWeight='medium'
														display='flex'
														alignItems='center'
														gap={1}>
														Learn More
														<Icon as={FaExternalLinkAlt} boxSize={3} />
													</Link>
												</VStack>
											</HStack>
											<HStack spacing={6} fontSize='xs' color='gray.500'>
												<Text>✅ Real Creator Data</Text>
												<Text>🔄 Live Social Metrics</Text>
												<Text>🤖 AI-Enhanced Analysis</Text>
												<Text>📊 MCP Integration</Text>
											</HStack>
										</VStack>
									</CardBody>
								</Card>
							</VStack>
						</MotionBox>
					)}
				</VStack>
			</Container>

			{/* Professional Footer */}
			<Footer />
		</Box>
	);
}
