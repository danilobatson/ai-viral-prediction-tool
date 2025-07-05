import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardBody,
  Text,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Avatar,
  Heading,
  FormHelperText,
} from '@chakra-ui/react';

const CreatorLookup = () => {
  const [username, setUsername] = useState('');
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.700');

  const lookupCreator = async () => {
    if (!username.trim()) {
      setError('Please enter a Twitter username');
      return;
    }

    setLoading(true);
    setError('');
    setCreatorData(null);

    try {
      const response = await fetch('/api/lookup-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle: username.trim().replace('@', ''), // Remove @ if present
          platform: 'twitter', // Always Twitter
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCreatorData(data.creatorData);
      } else {
        setError(data.error || 'Failed to lookup Twitter user');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Creator lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      lookupCreator();
    }
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
		<Box maxW='4xl' mx='auto' p={6}>
			<VStack spacing={8} align='stretch'>
				{/* Header */}
				<Box textAlign='center'>
					<Badge colorScheme='blue' fontSize='sm' mb={2}>
						🐦 Twitter/X Creator Analysis
					</Badge>
					<Heading size='lg' mb={2}>
						Twitter Creator Analyzer
					</Heading>
					<Text color='gray.600' fontSize='md'>
						Get real-time Twitter creator metrics powered by LunarCrush MCP
					</Text>
					<Badge colorScheme='green' mt={2}>
						✅ Live Twitter Data via MCP
					</Badge>
				</Box>

				{/* Platform Info */}
				<Alert status='info' borderRadius='lg'>
					<AlertIcon />
					<Box>
						<Text fontWeight='bold'>Twitter Creator Intelligence</Text>
						<Text fontSize='sm'>
							Analyze any Twitter account&apos;s viral potential, engagement
							patterns, and influence metrics using real-time social data.
						</Text>
					</Box>
				</Alert>

				{/* Input Section */}
				<Card bg={cardBg} borderRadius='lg'>
					<CardBody>
						<VStack spacing={4}>
							<Heading size='md'>Twitter Account Lookup</Heading>

							<FormControl>
								<FormLabel fontWeight='bold'>Twitter Username</FormLabel>
								<HStack>
									<Input
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										onKeyPress={handleKeyPress}
										placeholder='elonmusk'
										bg={cardBg}
										size='lg'
									/>
									<Button
										colorScheme='purple'
										onClick={lookupCreator}
										isLoading={loading}
										loadingText='Analyzing...'
										size='lg'
										minW='120px'>
										🔍 Analyze
									</Button>
								</HStack>
								<FormHelperText>
									Enter any Twitter username (without the @). Example: elonmusk,
									VitalikButerin, satoshi
								</FormHelperText>
							</FormControl>
						</VStack>
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
										🔍 Analyzing Twitter Creator
									</Text>
									<Text fontSize='sm' color='gray.600' textAlign='center'>
										• Fetching real-time Twitter data via LunarCrush MCP
										<br />
										• Analyzing follower metrics and engagement patterns
										<br />• Calculating creator authority and viral potential
									</Text>
								</VStack>
							</VStack>
						</CardBody>
					</Card>
				)}

				{/* Creator Results */}
				{creatorData && (
					<Card
						bg={cardBg}
						borderRadius='lg'
						borderWidth='2px'
						borderColor='purple.200'>
						<CardBody>
							<VStack spacing={6} align='stretch'>
								{/* Creator Header */}
								<HStack spacing={4}>
									<Avatar
										size='xl'
										name={creatorData.handle}
										src={creatorData.avatar}
									/>
									<VStack align='start' spacing={1}>
										<HStack>
											<Heading size='lg'>@{creatorData.handle}</Heading>
											{creatorData.verified && (
												<Badge colorScheme='blue'>✓ Verified</Badge>
											)}
										</HStack>
										<Text color='gray.600'>Twitter Creator</Text>
										<Badge
											colorScheme={
												creatorData.mcpSupported ? 'green' : 'orange'
											}
											variant='subtle'>
											{creatorData.mcpSupported
												? '✅ Live MCP Data'
												: '📊 Analysis Mode'}
										</Badge>
									</VStack>
								</HStack>

								{/* Creator Metrics */}
								<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
									<Stat textAlign='center'>
										<StatLabel>Followers</StatLabel>
										<StatNumber fontSize='2xl'>
											{formatNumber(creatorData.followers)}
										</StatNumber>
										<StatHelpText>Twitter Reach</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Engagement Rate</StatLabel>
										<StatNumber fontSize='2xl'>
											{creatorData.engagementRate
												? `${creatorData.engagementRate}%`
												: 'N/A'}
										</StatNumber>
										<StatHelpText>Avg Interaction %</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Authority Score</StatLabel>
										<StatNumber fontSize='2xl'>
											{creatorData.authorityScore || 'N/A'}
										</StatNumber>
										<StatHelpText>Influence Rating</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Viral Potential</StatLabel>
										<StatNumber fontSize='2xl'>
											{creatorData.viralPotential || 'N/A'}%
										</StatNumber>
										<StatHelpText>Content Reach</StatHelpText>
									</Stat>
								</SimpleGrid>

								{/* Additional Creator Insights */}
								{creatorData.insights && (
									<>
										<Alert status='info' borderRadius='lg'>
											<AlertIcon />
											<Box>
												<Text fontWeight='bold'>Creator Insights</Text>
												<Text fontSize='sm'>{creatorData.insights}</Text>
											</Box>
										</Alert>
									</>
								)}

								{/* Data Source Info */}
								<Alert
									status={creatorData.mcpSupported ? 'success' : 'warning'}
									borderRadius='lg'>
									<AlertIcon />
									<Box>
										<Text fontWeight='bold'>
											{creatorData.mcpSupported
												? 'Live Data Active'
												: 'Analysis Mode'}
										</Text>
										<Text fontSize='sm'>{creatorData.message}</Text>
									</Box>
								</Alert>

								{/* Twitter-Specific Creator Tips */}
								<Alert status='info' borderRadius='lg'>
									<AlertIcon />
									<Box>
										<Text fontWeight='bold'>Twitter Creator Optimization</Text>
										<Text fontSize='sm'>
											• Post consistently during peak crypto hours (9-11 AM &
											7-9 PM EST)
											<br />
											• Engage with crypto influencers and trending topics
											<br />
											• Use threads for in-depth analysis and storytelling
											<br />• Share real-time market insights and opinions
										</Text>
									</Box>
								</Alert>
							</VStack>
						</CardBody>
					</Card>
				)}

				{/* Twitter Creator Examples */}
				{!creatorData && !loading && (
					<Card bg={cardBg} borderRadius='lg'>
						<CardBody>
							<VStack spacing={4}>
								<Heading size='md'>Popular Crypto Twitter Creators</Heading>
								<Text color='gray.600' fontSize='sm' textAlign='center'>
									Try analyzing these popular crypto Twitter accounts:
								</Text>
								<HStack wrap='wrap' justify='center' spacing={2}>
									{[
										'elonmusk',
										'VitalikButerin',
										'APompliano',
										'DocumentingBTC',
										'CryptoCobain',
									].map((handle) => (
										<Button
											key={handle}
											size='sm'
											variant='outline'
											onClick={() => {
												setUsername(handle);
												lookupCreator();
											}}>
											@{handle}
										</Button>
									))}
								</HStack>
							</VStack>
						</CardBody>
					</Card>
				)}
			</VStack>
		</Box>
	);
};

export default CreatorLookup;
