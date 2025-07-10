import {
	VStack,
	HStack,
	Text,
	Textarea,
	Button,
	Box,
	Alert,
	AlertIcon,
	AlertDescription,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	Badge,
	Icon,
	useToast,
	Input,
	Card,
	CardBody,
	CardHeader,
	Heading,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
	FaBrain,
	FaUser,
	FaHashtag,
	FaClock,
	FaLightbulb,
	FaChartLine,
	FaFire,
	FaInfoCircle,
} from 'react-icons/fa';
import { formatNumber } from '../../lib/number-utils';
import AnalysisProgress from '../ui/AnalysisProgress';
import CategoryTooltip from '../ui/CategoryTooltip';

const MotionBox = motion(Box);

export default function ViralPredictor() {
	const [content, setContent] = useState('');
	const [creator, setCreator] = useState('');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState(null);
	const [error, setError] = useState('');
	const [progressStep, setProgressStep] = useState('');
	const [progressSteps, setProgressSteps] = useState([]);
	const toast = useToast();

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
		setProgressSteps(['connecting']);

		try {
			console.log('🚀 Starting viral prediction with REAL MCP data...');

			// Simulate progress updates during API call
			const updateProgress = (step, message) => {
				setProgressStep(step);
				setProgressSteps(prev => [...prev, step]);
				console.log(`📊 Progress: ${step} - ${message}`);
			};

			updateProgress('connecting', 'Connecting to LunarCrush MCP...');

			if (creator.trim()) {
				updateProgress('fetching', 'Fetching real creator data...');
			}

			updateProgress('analyzing', 'Running viral analysis...');

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

			updateProgress('complete', 'Analysis complete!');
			setResults(predictionResult);

			toast({
				title: `${predictionResult.viralProbability}% Viral Probability!`,
				description: predictionResult.hasCreatorData
					? 'Analysis based on real MCP creator data'
					: 'Content-only analysis (no creator data)',
				status: predictionResult.hasCreatorData ? 'success' : 'info',
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

	const getViralCategoryEmoji = (category) => {
		switch (category) {
			case 'Ultra High': return '🔥'
			case 'High': return '⭐'
			case 'Moderate': return '📈'
			case 'Low': return '📊'
			default: return '📊'
		}
	};

	return (
		<Box maxW="6xl" mx="auto" p={6}>
			<VStack spacing={8} align="stretch">
				{/* Header */}
				<Box textAlign="center">
					<Badge colorScheme="purple" fontSize="lg" mb={2}>
						🚀 AI Viral Prediction Tool
					</Badge>
					<Heading size="xl" mb={2}>
						Predict Content Viral Potential
					</Heading>
					<Text color="gray.600" fontSize="lg">
						Real-time creator data via LunarCrush MCP + Psychology-enhanced AI analysis
					</Text>
				</Box>

				{/* Viral Categories Info */}
				<Card borderRadius="lg" bg="blue.50" borderColor="blue.200" borderWidth="1px">
					<CardHeader pb={2}>
						<HStack spacing={3}>
							<Icon as={FaInfoCircle} color="blue.500" boxSize={5} />
							<Heading size="sm">Viral Category Definitions</Heading>
						</HStack>
					</CardHeader>
					<CardBody pt={0}>
						<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
							{[
								{ name: 'Ultra High', range: '75%+', color: 'red', emoji: '🔥' },
								{ name: 'High', range: '60-74%', color: 'orange', emoji: '⭐' },
								{ name: 'Moderate', range: '40-59%', color: 'yellow', emoji: '📈' },
								{ name: 'Low', range: '0-39%', color: 'gray', emoji: '📊' }
							].map(category => (
								<CategoryTooltip key={category.name} category={category.name}>
									<Box
										p={3}
										borderRadius="lg"
										bg={`${category.color}.50`}
										borderColor={`${category.color}.200`}
										borderWidth="1px"
										cursor="pointer"
										_hover={{ transform: 'scale(1.02)' }}
										transition="all 0.2s"
									>
										<VStack spacing={1}>
											<Text fontSize="lg">{category.emoji}</Text>
											<Text fontSize="sm" fontWeight="bold" color={`${category.color}.600`}>
												{category.name}
											</Text>
											<Text fontSize="xs" color="gray.600">
												{category.range}
											</Text>
										</VStack>
									</Box>
								</CategoryTooltip>
							))}
						</SimpleGrid>
						<Text fontSize="xs" color="gray.600" mt={3} textAlign="center">
							💡 Hover over categories to see detailed definitions and examples
						</Text>
					</CardBody>
				</Card>

				{/* Input Section */}
				<Card borderRadius="lg">
					<CardBody>
						<VStack spacing={4}>
							<Textarea
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Enter your content here...

🚀 Bitcoin just broke through $100K resistance!

The institutional adoption we've been waiting for is finally here. MicroStrategy, Tesla, and now even pension funds are allocating to BTC.

This is just the beginning of the next bull run. 📈

#Bitcoin #BTC #CryptoBull #ToTheMoon"
								size="lg"
								minH="150px"
								resize="vertical"
							/>

							<HStack w="full" spacing={4}>
								<Input
									value={creator}
									onChange={(e) => setCreator(e.target.value)}
									placeholder="Creator handle (optional): elonmusk"
									size="lg"
									flex={1}
								/>
								<Button
									colorScheme="purple"
									onClick={handlePredict}
									isLoading={loading}
									loadingText="Analyzing..."
									size="lg"
									minW="150px"
								>
									🧠 Predict Viral
								</Button>
							</HStack>
						</VStack>
					</CardBody>
				</Card>

				{/* Loading State with Progress */}
				{loading && (
					<Card borderRadius="lg" borderColor="purple.200" borderWidth="2px">
						<CardBody>
							<AnalysisProgress
								steps={progressSteps}
								currentStep={progressStep}
								error={error}
							/>
						</CardBody>
					</Card>
				)}

				{/* Error Display */}
				{error && !loading && (
					<Alert status="error" borderRadius="lg">
						<AlertIcon />
						<VStack align="start" spacing={1}>
							<Text fontWeight="bold">Analysis Failed</Text>
							<AlertDescription>{error}</AlertDescription>
						</VStack>
					</Alert>
				)}

				{/* Results Section - ONLY REAL DATA */}
				{results && !loading && (
					<MotionBox
						w="full"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<VStack spacing={6}>
							{/* Viral Probability with Category Tooltip */}
							<Card w="full" borderColor={`${getViralCategoryColor(results.viralCategory)}.200`} borderWidth="2px">
								<CardBody textAlign="center">
									<VStack spacing={4}>
										<Box position="relative">
											<Box
												width="120px"
												height="120px"
												borderRadius="50%"
												bg={`${getViralCategoryColor(results.viralCategory)}.100`}
												display="flex"
												alignItems="center"
												justifyContent="center"
												position="relative"
											>
												<Text fontSize="3xl" fontWeight="bold" color={`${getViralCategoryColor(results.viralCategory)}.600`}>
													{results.viralProbability}%
												</Text>
											</Box>
										</Box>
										<VStack spacing={1}>
											<Heading size="lg">{results.viralProbability}% Viral Probability</Heading>
											<CategoryTooltip category={results.viralCategory}>
												<Badge
													colorScheme={getViralCategoryColor(results.viralCategory)}
													fontSize="md"
													cursor="pointer"
													_hover={{ transform: 'scale(1.05)' }}
													transition="all 0.2s"
												>
													{getViralCategoryEmoji(results.viralCategory)} {results.viralCategory}
												</Badge>
											</CategoryTooltip>
											<Text fontSize="sm" color="gray.600">
												{results.hasCreatorData ? '✅ Based on REAL creator data' : '📊 Content-only analysis'}
											</Text>
										</VStack>
									</VStack>
								</CardBody>
							</Card>

							{/* Creator Data Display (only if we have REAL data) */}
							{results.hasCreatorData && results.creatorData && (
								<Card w="full" bg="blue.50" borderColor="blue.200" borderWidth="1px">
									<CardHeader pb={2}>
										<HStack spacing={3}>
											<Icon as={FaUser} color="blue.500" boxSize={5} />
											<Heading size="sm">Real Creator Data (LunarCrush MCP)</Heading>
										</HStack>
									</CardHeader>
									<CardBody pt={0}>
										<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
											<VStack spacing={1}>
												<Text fontSize="lg" fontWeight="bold" color="blue.600">
													@{results.creatorData.handle}
												</Text>
												<Text fontSize="xs" color="gray.600">Handle</Text>
											</VStack>
											<VStack spacing={1}>
												<Text fontSize="lg" fontWeight="bold" color="blue.600">
													{formatNumber(results.creatorData.followers)}
												</Text>
												<Text fontSize="xs" color="gray.600">Followers</Text>
											</VStack>
											<VStack spacing={1}>
												<Text fontSize="lg" fontWeight="bold" color="blue.600">
													{formatNumber(results.creatorData.engagements)}
												</Text>
												<Text fontSize="xs" color="gray.600">Engagements</Text>
											</VStack>
											<VStack spacing={1}>
												<Text fontSize="lg" fontWeight="bold" color="blue.600">
													{formatNumber(results.expectedEngagement)}
												</Text>
												<Text fontSize="xs" color="gray.600">Expected</Text>
											</VStack>
										</SimpleGrid>
									</CardBody>
								</Card>
							)}

							{/* Psychology Scores */}
							{results.psychologyScore && (
								<Card w="full">
									<CardHeader>
										<HStack spacing={3}>
											<Icon as={FaBrain} color="purple.500" boxSize={5} />
											<Heading size="sm">Psychology Analysis</Heading>
										</HStack>
									</CardHeader>
									<CardBody>
										<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
											<Stat>
												<StatLabel>Emotional Trigger</StatLabel>
												<StatNumber>{results.psychologyScore.emotional}%</StatNumber>
												<StatHelpText>Joy, surprise, etc.</StatHelpText>
											</Stat>
											<Stat>
												<StatLabel>Social Currency</StatLabel>
												<StatNumber>{results.psychologyScore.socialCurrency}%</StatNumber>
												<StatHelpText>Sharing value</StatHelpText>
											</Stat>
											<Stat>
												<StatLabel>Practical Value</StatLabel>
												<StatNumber>{results.psychologyScore.practicalValue}%</StatNumber>
												<StatHelpText>Useful info</StatHelpText>
											</Stat>
											<Stat>
												<StatLabel>Story Element</StatLabel>
												<StatNumber>{results.psychologyScore.story}%</StatNumber>
												<StatHelpText>Narrative appeal</StatHelpText>
											</Stat>
										</SimpleGrid>
									</CardBody>
								</Card>
							)}

							{/* Recommendations */}
							{results.recommendations && results.recommendations.length > 0 && (
								<Card w="full">
									<CardHeader>
										<HStack spacing={3}>
											<Icon as={FaLightbulb} color="orange.500" boxSize={5} />
											<Heading size="sm">Optimization Recommendations</Heading>
										</HStack>
									</CardHeader>
									<CardBody>
										<VStack align="start" spacing={3}>
											{results.recommendations.map((rec, index) => (
												<HStack key={index} align="start" spacing={3}>
													<Text color="orange.500" fontWeight="bold">{index + 1}.</Text>
													<Text>{rec}</Text>
												</HStack>
											))}
										</VStack>
									</CardBody>
								</Card>
							)}

							{/* Hashtags & Timing */}
							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
								{/* Optimized Hashtags */}
								{results.optimizedHashtags && results.optimizedHashtags.length > 0 && (
									<Card>
										<CardHeader>
											<HStack spacing={3}>
												<Icon as={FaHashtag} color="blue.500" boxSize={5} />
												<Heading size="sm">Optimized Hashtags</Heading>
											</HStack>
										</CardHeader>
										<CardBody>
											<Wrap>
												{results.optimizedHashtags.map((tag, index) => (
													<WrapItem key={index}>
														<Badge colorScheme="blue" variant="outline" fontSize="sm">
															{tag}
														</Badge>
													</WrapItem>
												))}
											</Wrap>
										</CardBody>
									</Card>
								)}

								{/* Optimal Timing */}
								{results.optimalTiming && (
									<Card>
										<CardHeader>
											<HStack spacing={3}>
												<Icon as={FaClock} color="green.500" boxSize={5} />
												<Heading size="sm">Optimal Timing</Heading>
											</HStack>
										</CardHeader>
										<CardBody>
											<VStack align="start" spacing={2}>
												<Text><strong>Best Time:</strong> {results.optimalTiming.bestTime}</Text>
												<Text><strong>Best Days:</strong> {results.optimalTiming.bestDays}</Text>
												<Text><strong>Timezone:</strong> {results.optimalTiming.timezone}</Text>
											</VStack>
										</CardBody>
									</Card>
								)}
							</SimpleGrid>

							{/* Data Source Info */}
							<Alert status={results.hasCreatorData ? 'success' : 'info'} borderRadius="lg">
								<AlertIcon />
								<Box>
									<Text fontWeight="bold">
										{results.hasCreatorData ? 'Analysis with Real Creator Data' : 'Content-Only Analysis'}
									</Text>
									<Text fontSize="sm">
										Data Source: {results.dataSource} | Model: {results.modelConfig?.model}
									</Text>
								</Box>
							</Alert>
						</VStack>
					</MotionBox>
				)}
			</VStack>
		</Box>
	);
}
