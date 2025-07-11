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
	Progress,
	Icon,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaRocket, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ProgressRing } from '../ui/ProgressRing';
import { GradientText } from '../ui/GradientText';

const MotionBox = motion(Box);

export default function EnhancedViralPredictor() {
	const [content, setContent] = useState('');
	const [creator, setCreator] = useState('');
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState(null);
	const [error, setError] = useState('');
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

		try {
			const response = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, creator: creator.trim() || undefined }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Analysis failed');
			}

			setResults(data);

			toast({
				title: 'Analysis Complete!',
				description: 'Your viral prediction is ready',
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
		if (probability >= 80) return { label: 'Ultra High', color: 'green' };
		if (probability >= 60) return { label: 'High', color: 'yellow' };
		if (probability >= 40) return { label: 'Moderate', color: 'orange' };
		return { label: 'Low', color: 'red' };
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
						placeholder='Enter your social media content here... (crypto topics work best!)'
						resize='vertical'
						minH='120px'
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
					<input
						type='text'
						value={creator}
						onChange={(e) => setCreator(e.target.value)}
						placeholder='@elonmusk, @bitcoin, etc.'
						style={{
							width: '100%',
							padding: '12px',
							border: '2px solid var(--chakra-colors-purple-200)',
							borderRadius: '6px',
							backgroundColor: 'white',
							fontSize: '16px',
						}}
					/>
				</Box>

				<Button
					onClick={handlePredict}
					isLoading={loading}
					loadingText='Analyzing with AI...'
					size='lg'
					variant='viral'
					w='full'
					leftIcon={<Icon as={FaBrain} />}
					isDisabled={!content.trim()}>
					Predict Viral Probability
				</Button>
			</VStack>

			{/* Loading State */}
			{loading && (
				<LoadingSpinner
					title='🤖 AI Analysis in Progress'
					subtitle='Processing content with Google Gemini AI • Analyzing viral patterns with ML algorithms • Calculating engagement predictions'
					icon={<Icon as={FaBrain} color='purple.500' boxSize={6} />}
				/>
			)}

			{/* Error State */}
			{error && (
				<Alert status='error' borderRadius='lg'>
					<AlertIcon />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Results Section */}
			{results && (
				<MotionBox
					w='full'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}>
					<VStack spacing={6}>
						{/* Main Probability Display */}
						<Box textAlign='center'>
							<Text fontSize='lg' mb={4} color='gray.600'>
								Viral Probability Analysis
							</Text>
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
										{getViralCategory(results.viralProbability).label} Potential
									</Badge>
									<VStack spacing={1}>
										<Text fontSize='sm' color='gray.600'>
											Confidence Score
										</Text>
										<Text fontSize='xl' fontWeight='bold' color='blue.600'>
											{results.confidenceScore}%
										</Text>
									</VStack>
								</VStack>
							</HStack>
						</Box>

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
									{results.expectedEngagement?.toLocaleString() || 'Variable'}
								</StatNumber>
								<StatHelpText>Projected interactions</StatHelpText>
							</Stat>

							<Stat
								bg='blue.50'
								p={4}
								borderRadius='lg'
								border='1px'
								borderColor='blue.200'>
								<StatLabel fontSize='sm'>Viral Category</StatLabel>
								<StatNumber color='blue.600'>
									{results.viralCategory ||
										getViralCategory(results.viralProbability).label}
								</StatNumber>
								<StatHelpText>Based on ML analysis</StatHelpText>
							</Stat>

							<Stat
								bg='green.50'
								p={4}
								borderRadius='lg'
								border='1px'
								borderColor='green.200'>
								<StatLabel fontSize='sm'>AI Confidence</StatLabel>
								<StatNumber color='green.600'>
									{results.confidenceScore}%
								</StatNumber>
								<StatHelpText>Model certainty</StatHelpText>
							</Stat>
						</SimpleGrid>

						{/* AI Recommendations */}
						{results.recommendations && results.recommendations.length > 0 && (
							<Box
								w='full'
								bg='yellow.50'
								p={6}
								borderRadius='lg'
								border='1px'
								borderColor='yellow.200'>
								<HStack spacing={3} mb={4}>
									<Icon as={FaLightbulb} color='yellow.600' boxSize={5} />
									<Heading size='sm' color='yellow.800'>
										AI Optimization Suggestions
									</Heading>
								</HStack>
								<VStack spacing={2} align='start'>
									{results.recommendations.map((rec, index) => (
										<Text key={index} fontSize='sm' color='yellow.800'>
											• {rec}
										</Text>
									))}
								</VStack>
							</Box>
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
								Analysis powered by Google Gemini 2.0 Flash Lite • Real-time
								LunarCrush social data • Zero mock data used • Results based on
								historical viral patterns
							</Text>
						</Box>
					</VStack>
				</MotionBox>
			)}
		</VStack>
	);
}
