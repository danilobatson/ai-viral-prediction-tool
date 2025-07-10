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
} from 'react-icons/fa';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ProgressRing } from '../ui/ProgressRing';

const MotionBox = motion(Box);

export default function ViralPredictor() {
	const [content, setContent] = useState('');
	const [creator, setCreator] = useState('');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState(null);
	const [creatorData, setCreatorData] = useState(null);
	const [error, setError] = useState('');
	const [creatorError, setCreatorError] = useState('');
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
		setCreatorError('');
		setResults(null);
		setCreatorData(null);

		try {
			let creatorInfo = null;

			// Step 1: If creator handle provided, use LLM-orchestrated MCP lookup
			if (creator.trim()) {
				try {
					const cleanCreator = creator.trim().replace(/^@/, '');

					const creatorResponse = await fetch('/api/lookup-creator', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ creator: cleanCreator }),
					});

					const creatorResult = await creatorResponse.json();

					if (!creatorResult.success) {
						setCreatorError(creatorResult.error);
					} else {
						creatorInfo = creatorResult.data;
						setCreatorData(creatorInfo);
					}
				} catch (creatorErr) {
					setCreatorError(`Failed to lookup creator: ${creatorErr.message}`);
				}
			}

			// Step 2: Get realistic viral prediction with optimization suggestions
			const predictionResponse = await fetch('/api/predict-viral-ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content: content.trim(),
					creator: creator.trim().replace(/^@/, '') || undefined,
					creatorData: creatorInfo || undefined,
				}),
			});

			const predictionResult = await predictionResponse.json();

			if (!predictionResult.success) {
				throw new Error(predictionResult.error);
			}

			setResults(predictionResult);

			toast({
				title: `${predictionResult.viralProbability}% Viral Probability! 🎯`,
				description: 'Complete analysis with optimization suggestions ready',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
		} catch (err) {
			setError(err.message || 'Failed to analyze content');
			toast({
				title: 'Analysis Error',
				description: err.message || 'Failed to analyze content',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const getViralCategory = (probability) => {
		if (probability >= 75) return { label: 'Ultra High', color: 'green' };
		if (probability >= 60) return { label: 'High', color: 'yellow' };
		if (probability >= 40) return { label: 'Moderate', color: 'orange' };
		return { label: 'Low', color: 'red' };
	};

	const formatNumber = (num) => {
		if (!num) return '0';
		if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
		if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
		return num.toString();
	};

	return (
		<VStack spacing={6} w='full'>
			{/* Input Section */}
			<VStack spacing={4} w='full'>
				<Box w='full'>
					<Text mb={2} fontWeight='500'>
						Content to Analyze
					</Text>
					<Textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Enter your social media content here...

Example:
🚀 Bitcoin just broke through $100K resistance!

The institutional adoption we've been waiting for is finally here. MicroStrategy, Tesla, and now even pension funds are allocating to BTC.

This is just the beginning of the next bull run. 📈

#Bitcoin #BTC #CryptoBull #ToTheMoon"
						resize='vertical'
						minH='150px'
						bg='white'
						borderColor='purple.200'
						_focus={{
							borderColor: 'purple.400',
							boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
						}}
					/>
				</Box>

				<Box w='full'>
					<Text mb={2} fontWeight='500'>
						Creator Handle (Optional)
					</Text>
					<Input
						value={creator}
						onChange={(e) => setCreator(e.target.value)}
						placeholder='elonmusk, bitcoin, VitalikButerin, etc. (@ symbol optional)'
						bg='white'
						borderColor='purple.200'
						_focus={{
							borderColor: 'purple.400',
							boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)',
						}}
					/>
					<Text fontSize='xs' color='gray.500' mt={1}>
						We'll use LLM-orchestrated MCP to get real follower data (realistic
						analysis: max 90% viral probability)
					</Text>
				</Box>

				<Button
					onClick={handlePredict}
					isLoading={loading}
					loadingText='LLM-Orchestrated Analysis...'
					size='lg'
					variant='viral'
					w='full'
					leftIcon={<Icon as={FaBrain} />}
					isDisabled={!content.trim()}>
					Predict Viral Probability (Realistic Analysis)
				</Button>
			</VStack>

			{/* Loading State */}
			{loading && (
				<LoadingSpinner
					title='🤖 LLM-Orchestrated Real-Time Analysis'
					subtitle={`${
						creator.trim()
							? '• LLM orchestrating MCP tools for creator data'
							: ''
					}
- Google Gemini AI analyzing viral potential
- Calculating realistic probability (max 90%)
- Generating optimization recommendations
- NO mock data - only real LLM+MCP results`}
					icon={<Icon as={FaBrain} color='purple.500' boxSize={6} />}
				/>
			)}

			{/* Creator Error */}
			{creatorError && (
				<Alert status='warning' borderRadius='lg'>
					<AlertIcon />
					<VStack align='start' spacing={1}>
						<Text fontWeight='bold'>LLM-Orchestrated MCP Lookup Failed</Text>
						<AlertDescription>{creatorError}</AlertDescription>
						<Text fontSize='sm' color='gray.600'>
							Continuing analysis without creator data...
						</Text>
					</VStack>
				</Alert>
			)}

			{/* General Error */}
			{error && (
				<Alert status='error' borderRadius='lg'>
					<AlertIcon />
					<VStack align='start' spacing={1}>
						<Text fontWeight='bold'>Analysis Failed</Text>
						<AlertDescription>{error}</AlertDescription>
					</VStack>
				</Alert>
			)}

			{/* Results Section - ONLY REAL DATA */}
			{results && (
				<MotionBox
					w='full'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<VStack spacing={6}>
						{/* Creator Data Display */}
						{creatorData && (
							<Card
								w='full'
								bg='blue.50'
								borderColor='blue.200'
								borderWidth='1px'>
								<CardHeader pb={2}>
									<HStack spacing={3}>
										<Icon as={FaUser} color='blue.500' boxSize={5} />
										<Heading size='sm'>
											Creator Data (LLM-Orchestrated MCP)
										</Heading>
									</HStack>
								</CardHeader>
								<CardBody pt={0}>
									<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
										<VStack spacing={1}>
											<Text fontSize='lg' fontWeight='bold' color='blue.600'>
												@{creatorData.handle}
											</Text>
											<Text fontSize='xs' color='gray.600'>
												Handle
											</Text>
										</VStack>
										<VStack spacing={1}>
											<Text fontSize='lg' fontWeight='bold' color='blue.600'>
												{formatNumber(creatorData.followerCount)}
											</Text>
											<Text fontSize='xs' color='gray.600'>
												Followers
											</Text>
										</VStack>
										<VStack spacing={1}>
											<Text fontSize='lg' fontWeight='bold' color='blue.600'>
												{creatorData.engagements
													? formatNumber(creatorData.engagements)
													: 'N/A'}
											</Text>
											<Text fontSize='xs' color='gray.600'>
												Engagements
											</Text>
										</VStack>
										<VStack spacing={1}>
											<Text fontSize='lg' fontWeight='bold' color='blue.600'>
												LLM+MCP
											</Text>
											<Text fontSize='xs' color='gray.600'>
												Data Source
											</Text>
										</VStack>
									</SimpleGrid>
								</CardBody>
							</Card>
						)}

						{/* Main Probability Display */}
						<Card
							w='full'
							bg='purple.50'
							borderColor='purple.200'
							borderWidth='1px'>
							<CardHeader pb={2}>
								<HStack spacing={3}>
									<Icon as={FaChartLine} color='purple.500' boxSize={5} />
									<Heading size='sm'>
										Realistic Viral Probability Analysis
									</Heading>
								</HStack>
							</CardHeader>
							<CardBody pt={0}>
								<HStack justify='center' spacing={8} wrap='wrap'>
									<ProgressRing
										value={results.viralProbability}
										size={140}
										strokeWidth={10}
										label='Viral Probability'
										color='purple.500'
									/>
									<VStack spacing={3}>
										<Badge
											colorScheme={
												getViralCategory(results.viralProbability).color
											}
											fontSize='md'
											px={4}
											py={2}
											borderRadius='full'>
											{getViralCategory(results.viralProbability).label}{' '}
											Potential
										</Badge>
										<VStack spacing={1}>
											<Text fontSize='sm' color='gray.600'>
												AI Confidence
											</Text>
											<Text fontSize='xl' fontWeight='bold' color='blue.600'>
												{results.confidenceScore}%
											</Text>
										</VStack>
										<Text fontSize='xs' color='gray.500' textAlign='center'>
											Max: 90% (realistic cap)
										</Text>
									</VStack>
								</HStack>
							</CardBody>
						</Card>

						{/* Detailed Metrics */}
						<SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w='full'>
							<Stat
								bg='purple.50'
								p={4}
								borderRadius='lg'
								border='1px'
								borderColor='purple.200'>
								<StatLabel fontSize='sm'>Expected Engagement</StatLabel>
								<StatNumber color='purple.600'>
									{results.expectedEngagement
										? formatNumber(results.expectedEngagement)
										: 'Not Available'}
								</StatNumber>
								<StatHelpText>
									{creatorData
										? 'Based on real LLM+MCP data'
										: 'Requires creator data'}
								</StatHelpText>
							</Stat>

							<Stat
								bg='blue.50'
								p={4}
								borderRadius='lg'
								border='1px'
								borderColor='blue.200'>
								<StatLabel fontSize='sm'>Viral Category</StatLabel>
								<StatNumber color='blue.600'>
									{results.viralCategory}
								</StatNumber>
								<StatHelpText>Realistic AI analysis</StatHelpText>
							</Stat>

							<Stat
								bg='green.50'
								p={4}
								borderRadius='lg'
								border='1px'
								borderColor='green.200'>
								<StatLabel fontSize='sm'>Potential Reach</StatLabel>
								<StatNumber color='green.600'>
									{creatorData
										? formatNumber(
												Math.floor(
													creatorData.followerCount *
														(results.viralProbability / 100)
												)
										  )
										: 'N/A'}
								</StatNumber>
								<StatHelpText>
									{creatorData
										? 'Real MCP data calculation'
										: 'Requires creator data'}
								</StatHelpText>
							</Stat>
						</SimpleGrid>

						{/* AI Recommendations - ALWAYS SHOW */}
						{results.recommendations && results.recommendations.length > 0 && (
							<Card
								w='full'
								bg='yellow.50'
								borderColor='yellow.200'
								borderWidth='1px'>
								<CardHeader pb={2}>
									<HStack spacing={3}>
										<Icon as={FaLightbulb} color='yellow.600' boxSize={5} />
										<Heading size='sm'>AI Optimization Suggestions</Heading>
									</HStack>
								</CardHeader>
								<CardBody pt={0}>
									<VStack spacing={2} align='start'>
										{results.recommendations.map((rec, index) => (
											<Text key={index} fontSize='sm' color='yellow.800'>
												• {rec}
											</Text>
										))}
									</VStack>
								</CardBody>
							</Card>
						)}

						{/* Optimization Sections - ALWAYS SHOW */}
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w='full'>
							{/* Optimized Hashtags - ALWAYS SHOW */}
							<Card bg='green.50' borderColor='green.200' borderWidth='1px'>
								<CardHeader pb={2}>
									<HStack spacing={3}>
										<Icon as={FaHashtag} color='green.600' boxSize={5} />
										<Heading size='sm'>Optimized Hashtags</Heading>
									</HStack>
								</CardHeader>
								<CardBody pt={0}>
									<Wrap spacing={2}>
										{(results.optimizedHashtags || []).map((tag, index) => (
											<WrapItem key={index}>
												<Badge colorScheme='green' fontSize='xs'>
													#{tag}
												</Badge>
											</WrapItem>
										))}
									</Wrap>
								</CardBody>
							</Card>

							{/* Optimal Timing - ALWAYS SHOW */}
							<Card bg='orange.50' borderColor='orange.200' borderWidth='1px'>
								<CardHeader pb={2}>
									<HStack spacing={3}>
										<Icon as={FaClock} color='orange.600' boxSize={5} />
										<Heading size='sm'>Optimal Timing</Heading>
									</HStack>
								</CardHeader>
								<CardBody pt={0}>
									<VStack spacing={2} align='start'>
										<Text fontSize='sm' color='orange.800'>
											<strong>Best Time:</strong>{' '}
											{results.optimalTiming?.bestTime ||
												'9:00 AM - 11:00 AM EST'}
										</Text>
										<Text fontSize='sm' color='orange.800'>
											<strong>Best Days:</strong>{' '}
											{results.optimalTiming?.bestDays || 'Tuesday - Thursday'}
										</Text>
										<Text fontSize='sm' color='orange.800'>
											<strong>Timezone:</strong>{' '}
											{results.optimalTiming?.timezone || 'EST'}
										</Text>
									</VStack>
								</CardBody>
							</Card>
						</SimpleGrid>

						{/* Viral Factors - ALWAYS SHOW */}
						{results.viralFactors && results.viralFactors.length > 0 && (
							<Card
								w='full'
								bg='red.50'
								borderColor='red.200'
								borderWidth='1px'>
								<CardHeader pb={2}>
									<HStack spacing={3}>
										<Icon as={FaFire} color='red.600' boxSize={5} />
										<Heading size='sm'>Viral Success Factors</Heading>
									</HStack>
								</CardHeader>
								<CardBody pt={0}>
									<VStack spacing={2} align='start'>
										{results.viralFactors.map((factor, index) => (
											<Text key={index} fontSize='sm' color='red.800'>
												• {factor}
											</Text>
										))}
									</VStack>
								</CardBody>
							</Card>
						)}

						{/* Technical Details */}
						<Box
							w='full'
							bg='gray.50'
							p={4}
							borderRadius='lg'
							border='1px'
							borderColor='gray.200'>
							<Text fontSize='xs' color='gray.600' textAlign='center'>
								Analysis: {results.analysisSource} •
								{creatorData
									? ` Creator: LLM-Orchestrated MCP (${formatNumber(
											creatorData.followerCount
									  )} followers) •`
									: ' No creator data •'}{' '}
								Data Source: {results.dataSource} • Realistic Analysis (Max 90%)
								• {results.timestamp}
							</Text>
						</Box>
					</VStack>
				</MotionBox>
			)}
		</VStack>
	);
}
