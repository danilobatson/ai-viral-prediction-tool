import {
	VStack,
	HStack,
	Text,
	Textarea,
	Button,
	Box,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Badge,
	Icon,
	useToast,
	Input,
	CardBody,
	CardHeader,
	Heading,
	Wrap,
	WrapItem,
	Container,
	useColorModeValue,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
	FaBrain,
	FaUser,
	FaHashtag,
	FaClock,
	FaLightbulb,
	FaSearch,
} from 'react-icons/fa';
import { formatNumber } from '../../lib/number-utils';
import AnalysisProgress from '../ui/AnalysisProgress';
import ViralMeter from '../ui/ViralMeter';
import GlassCard from '../ui/GlassCard';
import ConfettiEffect from '../ui/ConfettiEffect';
import ModernHero from '../ui/ModernHero';
import ThemeToggle from '../ui/ThemeToggle';

const MotionBox = motion(Box);

export default function ModernViralPredictor() {
	const [content, setContent] = useState('');
	const [creator, setCreator] = useState('');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState(null);
	const [error, setError] = useState('');
	const [progressStep, setProgressStep] = useState('');
	const [showConfetti, setShowConfetti] = useState(false);
	const predictorRef = useRef(null);
	const toast = useToast();

	const bg = useColorModeValue('gray.50', 'gray.900');
	const cardBg = useColorModeValue('white', 'gray.800');

	const scrollToPredictor = () => {
		predictorRef.current?.scrollIntoView({ 
			behavior: 'smooth',
			block: 'start'
		});
	};

	const handlePredict = async () => {
		if (!content.trim()) {
			toast({
				title: 'Content Required',
				description: 'Please enter some content to analyze',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setLoading(true);
		setError('');
		setResults(null);
		setProgressStep('connecting');
		setShowConfetti(false);

		try {
			const updateProgress = (step) => {
				setProgressStep(step);
			};

			updateProgress('connecting');
			
			if (creator.trim()) {
				updateProgress('fetching');
			}
			
			updateProgress('analyzing');

			const predictionResponse = await fetch('/api/predict-viral-ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content: content.trim(),
					creator: creator.trim() || undefined,
				}),
			});

			const predictionResult = await predictionResponse.json();

			if (!predictionResult.success) {
				throw new Error(predictionResult.error);
			}

			updateProgress('complete');
			setResults(predictionResult);

			// Trigger confetti for high viral scores
			if (predictionResult.viralProbability >= 70) {
				setTimeout(() => setShowConfetti(true), 500);
			}

			toast({
				title: `${predictionResult.viralProbability}% Viral Probability!`,
				description: predictionResult.hasCreatorData 
					? 'Enhanced with real creator metrics' 
					: 'Content-only analysis',
				status: predictionResult.viralProbability >= 70 ? 'success' : 'info',
				duration: 5000,
				isClosable: true,
			});

		} catch (err) {
			setError(err.message);
			setProgressStep('error');
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
			case 'Ultra High': return 'red'
			case 'High': return 'orange'
			case 'Moderate': return 'yellow'
			case 'Low': return 'gray'
			default: return 'gray'
		}
	};

	return (
		<Box minH="100vh" bg={bg}>
			<ThemeToggle />
			<ConfettiEffect trigger={showConfetti} viralProbability={results?.viralProbability} />
			
			{/* Modern Hero Section */}
			<ModernHero onScrollToPredictor={scrollToPredictor} />

			{/* Main Content */}
			<Container maxW="6xl" py={20} ref={predictorRef}>
				<VStack spacing={12} align="stretch">
					{/* Input Section */}
					<MotionBox
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<GlassCard p={8}>
							<VStack spacing={6}>
								<VStack spacing={2} textAlign="center">
									<Heading size="lg" bgGradient="linear(to-r, purple.400, pink.400)" bgClip="text">
										✨ Analyze Your Content
									</Heading>
									<Text color="gray.600">
										Paste any content and add a creator handle for enhanced predictions
									</Text>
								</VStack>

								<Alert status="info" borderRadius="lg">
									<AlertIcon />
									<Box>
										<Text fontWeight="bold">Pro Tip</Text>
										<Text fontSize="sm">
											Add a creator handle (like "elonmusk") to get predictions enhanced with their real follower data and engagement patterns.
										</Text>
									</Box>
								</Alert>

								<Textarea
									value={content}
									onChange={(e) => setContent(e.target.value)}
									placeholder="🚀 Bitcoin just broke through $100K resistance!

The institutional adoption we've been waiting for is finally here. MicroStrategy, Tesla, and now even pension funds are allocating to BTC.

This is just the beginning of the next bull run. 📈

#Bitcoin #BTC #CryptoBull #ToTheMoon"
									size="lg"
									minH="200px"
									resize="vertical"
									bg={cardBg}
									border="2px solid"
									borderColor="transparent"
									_focus={{
										borderColor: "purple.400",
										boxShadow: "0 0 0 1px purple.400",
									}}
									borderRadius="xl"
								/>
								
								<HStack w="full" spacing={4}>
									<Input
										value={creator}
										onChange={(e) => setCreator(e.target.value)}
										placeholder="Creator handle (optional): elonmusk"
										size="lg"
										flex={1}
										bg={cardBg}
										border="2px solid"
										borderColor="transparent"
										_focus={{
											borderColor: "purple.400",
											boxShadow: "0 0 0 1px purple.400",
										}}
										borderRadius="xl"
									/>
									<Button
										colorScheme="purple"
										onClick={handlePredict}
										isLoading={loading}
										loadingText="Analyzing..."
										size="lg"
										minW="200px"
										borderRadius="xl"
										bgGradient="linear(to-r, purple.400, pink.400)"
										_hover={{
											bgGradient: "linear(to-r, purple.500, pink.500)",
											transform: "translateY(-2px)",
											boxShadow: "xl",
										}}
										_active={{
											transform: "translateY(0px)",
										}}
									>
										🧠 Predict Viral Potential
									</Button>
								</HStack>
							</VStack>
						</GlassCard>
					</MotionBox>

					{/* Loading State with Progress */}
					{loading && (
						<MotionBox
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<GlassCard p={6}>
								<AnalysisProgress 
									steps={[progressStep]}
									currentStep={progressStep}
									error={error}
								/>
							</GlassCard>
						</MotionBox>
					)}

					{/* Results Section */}
					{results && !loading && (
						<MotionBox
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
						>
							<VStack spacing={8}>
								{/* Viral Probability Meter */}
								<GlassCard p={8} textAlign="center">
									<VStack spacing={6}>
										<ViralMeter 
											probability={results.viralProbability}
											category={results.viralCategory}
											isAnimating={true}
										/>
										
										<VStack spacing={2}>
											<Badge 
												colorScheme={getViralCategoryColor(results.viralCategory)} 
												fontSize="lg"
												px={4}
												py={2}
												borderRadius="full"
											>
												{results.viralCategory} Viral Potential
											</Badge>
											<Text color="gray.600">
												{results.hasCreatorData ? '✅ Enhanced with creator data' : '📊 Content-only analysis'}
											</Text>
										</VStack>
									</VStack>
								</GlassCard>

								{/* Creator Data (if available) */}
								{results.hasCreatorData && results.creatorData && (
									<GlassCard p={6}>
										<CardHeader pb={2}>
											<HStack spacing={3}>
												<Icon as={FaUser} color="blue.500" boxSize={5} />
												<Heading size="md">Creator Analytics</Heading>
											</HStack>
										</CardHeader>
										<CardBody>
											<SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
												{[
													{ label: 'Handle', value: `@${results.creatorData.handle}`, color: 'blue' },
													{ label: 'Followers', value: formatNumber(results.creatorData.followers), color: 'green' },
													{ label: 'Engagements', value: formatNumber(results.creatorData.engagements), color: 'purple' },
													{ label: 'Expected', value: formatNumber(results.expectedEngagement), color: 'orange' },
												].map((stat, index) => (
													<MotionBox
														key={stat.label}
														initial={{ opacity: 0, y: 20 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ duration: 0.5, delay: index * 0.1 }}
													>
														<Stat textAlign="center">
															<StatNumber fontSize="2xl" color={`${stat.color}.500`}>
																{stat.value}
															</StatNumber>
															<StatLabel fontSize="sm" color="gray.600">
																{stat.label}
															</StatLabel>
														</Stat>
													</MotionBox>
												))}
											</SimpleGrid>
										</CardBody>
									</GlassCard>
								)}

								{/* Psychology Scores */}
								{results.psychologyScore && (
									<GlassCard p={6}>
										<CardHeader pb={2}>
											<HStack spacing={3}>
												<Icon as={FaBrain} color="purple.500" boxSize={5} />
												<Heading size="md">Psychology Analysis</Heading>
											</HStack>
										</CardHeader>
										<CardBody>
											<SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
												{[
													{ key: 'emotional', label: 'Emotional Trigger', desc: 'Joy, surprise, etc.' },
													{ key: 'socialCurrency', label: 'Social Currency', desc: 'Sharing value' },
													{ key: 'practicalValue', label: 'Practical Value', desc: 'Useful info' },
													{ key: 'story', label: 'Story Element', desc: 'Narrative appeal' },
												].map((item, index) => (
													<MotionBox
														key={item.key}
														initial={{ opacity: 0, scale: 0.8 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{ duration: 0.5, delay: index * 0.1 }}
													>
														<Stat textAlign="center">
															<StatNumber fontSize="3xl" color="purple.500">
																{results.psychologyScore[item.key]}%
															</StatNumber>
															<StatLabel fontWeight="bold">
																{item.label}
															</StatLabel>
															<StatHelpText fontSize="xs">
																{item.desc}
															</StatHelpText>
														</Stat>
													</MotionBox>
												))}
											</SimpleGrid>
										</CardBody>
									</GlassCard>
								)}

								{/* Recommendations & Hashtags Grid */}
								<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
									{/* Recommendations */}
									{results.recommendations && results.recommendations.length > 0 && (
										<GlassCard p={6}>
											<CardHeader pb={2}>
												<HStack spacing={3}>
													<Icon as={FaLightbulb} color="orange.500" boxSize={5} />
													<Heading size="md">Optimization Tips</Heading>
												</HStack>
											</CardHeader>
											<CardBody>
												<VStack align="start" spacing={4}>
													{results.recommendations.map((rec, index) => (
														<MotionBox
															key={index}
															initial={{ opacity: 0, x: -20 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{ duration: 0.5, delay: index * 0.1 }}
														>
															<HStack align="start" spacing={3}>
																<Badge colorScheme="orange" borderRadius="full" minW="24px" h="24px" display="flex" alignItems="center" justifyContent="center">
																	{index + 1}
																</Badge>
																<Text fontSize="sm">{rec}</Text>
															</HStack>
														</MotionBox>
													))}
												</VStack>
											</CardBody>
										</GlassCard>
									)}

									{/* Hashtags & Timing */}
									<VStack spacing={8}>
										{/* Hashtags */}
										{results.optimizedHashtags && results.optimizedHashtags.length > 0 && (
											<GlassCard p={6} w="full">
												<CardHeader pb={2}>
													<HStack spacing={3}>
														<Icon as={FaHashtag} color="blue.500" boxSize={5} />
														<Heading size="md">Optimized Hashtags</Heading>
													</HStack>
												</CardHeader>
												<CardBody>
													<Wrap>
														{results.optimizedHashtags.map((tag, index) => (
															<WrapItem key={index}>
																<MotionBox
																	initial={{ opacity: 0, scale: 0.8 }}
																	animate={{ opacity: 1, scale: 1 }}
																	transition={{ duration: 0.3, delay: index * 0.05 }}
																	whileHover={{ scale: 1.05 }}
																>
																	<Badge 
																		colorScheme="blue" 
																		variant="outline" 
																		fontSize="sm"
																		px={3}
																		py={1}
																		borderRadius="full"
																	>
																		{tag}
																	</Badge>
																</MotionBox>
															</WrapItem>
														))}
													</Wrap>
												</CardBody>
											</GlassCard>
										)}

										{/* Timing */}
										{results.optimalTiming && (
											<GlassCard p={6} w="full">
												<CardHeader pb={2}>
													<HStack spacing={3}>
														<Icon as={FaClock} color="green.500" boxSize={5} />
														<Heading size="md">Optimal Timing</Heading>
													</HStack>
												</CardHeader>
												<CardBody>
													<VStack align="start" spacing={3}>
														<HStack>
															<Text fontWeight="bold" color="green.500">🕐 Best Time:</Text>
															<Text>{results.optimalTiming.bestTime}</Text>
														</HStack>
														<HStack>
															<Text fontWeight="bold" color="green.500">📅 Best Days:</Text>
															<Text>{results.optimalTiming.bestDays}</Text>
														</HStack>
														<HStack>
															<Text fontWeight="bold" color="green.500">🌍 Timezone:</Text>
															<Text>{results.optimalTiming.timezone}</Text>
														</HStack>
													</VStack>
												</CardBody>
											</GlassCard>
										)}
									</VStack>
								</SimpleGrid>
							</VStack>
						</MotionBox>
					)}
				</VStack>
			</Container>
		</Box>
	);
}
