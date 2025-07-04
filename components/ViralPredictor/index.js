/**
 * Intelligent Viral Prediction Tool - Real Data + AI Analysis
 * Phase 3.2: Frontend Interface Development - Enhanced Version
 */

import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Button,
  Textarea,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Badge,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Spinner,
  Divider,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
} from '@chakra-ui/react';
import { trackEvent } from '../Analytics';

export default function ViralPredictor() {
  const [formData, setFormData] = useState({
    postText: '',
    platform: 'x',
    socialHandle: '',
    niche: 'crypto',
  });
  
  const [creatorData, setCreatorData] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.700');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const lookupCreatorData = async () => {
    if (!formData.socialHandle.trim()) {
      setError('Please enter your social media handle');
      return;
    }

    setLookupLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/lookup-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: formData.platform,
          handle: formData.socialHandle.replace('@', ''), // Remove @ if present
          niche: formData.niche
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to lookup creator data');
      }

      const data = await response.json();
      setCreatorData(data.creatorData);
      setTrendingTopics(data.trendingTopics);
      
      toast({
        title: 'Creator Data Found! 🎉',
        description: `Found your profile with ${data.creatorData.followers?.toLocaleString()} followers`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lookup Failed',
        description: 'Could not find your profile. Check your handle and platform.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const handlePredict = async () => {
    if (!formData.postText.trim()) {
      setError('Please enter your post content');
      return;
    }

    if (!creatorData) {
      setError('Please lookup your creator data first');
      return;
    }

    setLoading(true);
    setError(null);
    
    trackEvent('ai_prediction_started', {
      platform: formData.platform,
      has_creator_data: !!creatorData,
      follower_count: creatorData?.followers || 0,
      text_length: formData.postText.length,
      niche: formData.niche
    });
    
    try {
      const response = await fetch('/api/predict-viral-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postData: {
            text: formData.postText,
            platform: formData.platform,
            niche: formData.niche
          },
          creatorData: creatorData,
          trendingTopics: trendingTopics,
          analysisType: 'comprehensive' // Tell the API to use AI analysis
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI prediction');
      }

      const data = await response.json();
      setPrediction(data);
      setActiveTab(1); // Switch to results tab
      
      trackEvent('ai_prediction_completed', {
        viral_probability: data.prediction.viralProbability,
        confidence: data.prediction.confidence,
        platform: formData.platform,
        follower_count: creatorData?.followers || 0
      });
      
    } catch (err) {
      setError(err.message);
      trackEvent('prediction_error', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getSupportedPlatforms = () => [
    { value: 'x', label: 'X (Twitter)', icon: '🐦' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'reddit', label: 'Reddit', icon: '🤖' },
  ];

  const getPlatformInfo = (platform) => {
    const info = {
      x: {
        tips: ['Use trending hashtags', 'Post during peak hours', 'Engage with replies quickly'],
        peakTimes: '12-3 PM, 5-6 PM EST',
        avgEngagement: '1-3%',
      },
      tiktok: {
        tips: ['Use trending sounds', 'Hook viewers in first 3 seconds', 'Post consistently'],
        peakTimes: '6-10 AM, 7-9 PM EST',
        avgEngagement: '5-18%',
      },
      youtube: {
        tips: ['Optimize thumbnails', 'Use compelling titles', 'Encourage early engagement'],
        peakTimes: '2-4 PM, 8-11 PM EST',
        avgEngagement: '2-5%',
      },
      reddit: {
        tips: ['Post to relevant subreddits', 'Engage authentically', 'Follow community rules'],
        peakTimes: '9-11 AM, 7-9 PM EST',
        avgEngagement: '5-15%',
      },
    };
    return info[platform] || info.x;
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="6xl" py={8}>
        <VStack spacing={8}>
          {/* Header */}
          <Box textAlign="center">
            <Heading size="2xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text" mb={4}>
              🤖 AI Viral Prediction Tool
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="4xl" lineHeight="tall">
              Get real-time AI predictions powered by your actual social media data and trending topics
            </Text>
            <HStack justify="center" mt={4} spacing={4}>
              {getSupportedPlatforms().map(platform => (
                <Badge key={platform.value} colorScheme="blue" p={2} borderRadius="md">
                  {platform.icon} {platform.label}
                </Badge>
              ))}
            </HStack>
          </Box>

          {/* Main Tabs */}
          <Tabs index={activeTab} onChange={setActiveTab} w="full" colorScheme="blue">
            <TabList>
              <Tab>🔍 Creator Lookup</Tab>
              <Tab isDisabled={!creatorData}>📝 Content Analysis</Tab>
              <Tab isDisabled={!prediction}>📊 AI Insights</Tab>
              <Tab>🧠 How AI Works</Tab>
            </TabList>

            <TabPanels>
              {/* Creator Lookup Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  <Card w="full" bg={cardBg} shadow="lg">
                    <CardHeader>
                      <Heading size="md">🔍 Find Your Real Creator Data</Heading>
                      <Text fontSize="sm" color="gray.600">
                        We'll analyze your actual follower count, engagement rate, and posting history
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <FormControl>
                          <FormLabel>Platform</FormLabel>
                          <Select
                            value={formData.platform}
                            onChange={(e) => handleInputChange('platform', e.target.value)}
                          >
                            {getSupportedPlatforms().map(platform => (
                              <option key={platform.value} value={platform.value}>
                                {platform.icon} {platform.label}
                              </option>
                            ))}
                          </Select>
                          <FormHelperText>
                            Powered by LunarCrush - real social media data
                          </FormHelperText>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Your Handle (without @)</FormLabel>
                          <Input
                            value={formData.socialHandle}
                            onChange={(e) => handleInputChange('socialHandle', e.target.value)}
                            placeholder="username"
                          />
                          <FormHelperText>
                            We'll fetch your real follower count and engagement data
                          </FormHelperText>
                        </FormControl>

                        <FormControl gridColumn={{ base: '1', md: '1 / -1' }}>
                          <FormLabel>Content Niche</FormLabel>
                          <Select
                            value={formData.niche}
                            onChange={(e) => handleInputChange('niche', e.target.value)}
                          >
                            <option value="crypto">Cryptocurrency</option>
                            <option value="tech">Technology</option>
                            <option value="business">Business</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="education">Education</option>
                          </Select>
                          <FormHelperText>
                            This helps us analyze relevant trending topics for your niche
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Button
                        onClick={lookupCreatorData}
                        isLoading={lookupLoading}
                        loadingText="Finding your data..."
                        isDisabled={!formData.socialHandle.trim()}
                        colorScheme="blue"
                        size="lg"
                        w="full"
                        mt={6}
                        h="60px"
                        fontSize="lg"
                        borderRadius="xl"
                      >
                        🔍 Lookup My Real Creator Data
                      </Button>
                    </CardBody>
                  </Card>

                  {/* Platform Insights */}
                  <Card w="full" bg="blue.50" shadow="lg">
                    <CardBody>
                      <Heading size="sm" mb={3}>
                        📈 {getSupportedPlatforms().find(p => p.value === formData.platform)?.label} Best Practices
                      </Heading>
                      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <Box>
                          <Text fontWeight="semibold" fontSize="sm">Peak Times</Text>
                          <Text fontSize="sm" color="gray.600">{getPlatformInfo(formData.platform).peakTimes}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="semibold" fontSize="sm">Avg Engagement</Text>
                          <Text fontSize="sm" color="gray.600">{getPlatformInfo(formData.platform).avgEngagement}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="semibold" fontSize="sm">Tips</Text>
                          <Text fontSize="sm" color="gray.600">{getPlatformInfo(formData.platform).tips[0]}</Text>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>

                  {/* Creator Data Display */}
                  {creatorData && (
                    <Card w="full" bg="green.50" shadow="lg">
                      <CardHeader>
                        <Heading size="md">✅ Your Creator Profile Found!</Heading>
                      </CardHeader>
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
                          <Stat textAlign="center">
                            <StatLabel>Followers</StatLabel>
                            <StatNumber color="blue.500">{creatorData.followers?.toLocaleString()}</StatNumber>
                          </Stat>
                          <Stat textAlign="center">
                            <StatLabel>Engagement Rate</StatLabel>
                            <StatNumber color="green.500">{creatorData.engagementRate?.toFixed(2)}%</StatNumber>
                          </Stat>
                          <Stat textAlign="center">
                            <StatLabel>Creator Rank</StatLabel>
                            <StatNumber color="purple.500">#{creatorData.rank || 'N/A'}</StatNumber>
                          </Stat>
                          <Stat textAlign="center">
                            <StatLabel>Viral Potential</StatLabel>
                            <StatNumber color="orange.500">{creatorData.viralPotential || 'Medium'}</StatNumber>
                          </Stat>
                        </SimpleGrid>
                        <Button
                          onClick={() => setActiveTab(1)}
                          colorScheme="green"
                          w="full"
                          mt={4}
                        >
                          ➡️ Continue to Content Analysis
                        </Button>
                      </CardBody>
                    </Card>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Alert status="error" borderRadius="lg">
                      <AlertIcon />
                      <AlertTitle>Error:</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </VStack>
              </TabPanel>

              {/* Content Analysis Tab */}
              <TabPanel>
                {creatorData ? (
                  <VStack spacing={6}>
                    <Card w="full" bg={cardBg} shadow="lg">
                      <CardHeader>
                        <Heading size="md">✍️ Your Post Content</Heading>
                        <Text fontSize="sm" color="gray.600">
                          AI will analyze this against trending topics and your creator profile
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <FormControl>
                          <FormLabel>Post Text</FormLabel>
                          <Textarea
                            value={formData.postText}
                            onChange={(e) => handleInputChange('postText', e.target.value)}
                            placeholder="🚀 Enter your post content here..."
                            size="lg"
                            minH="150px"
                            resize="vertical"
                            focusBorderColor="blue.400"
                          />
                          <Flex justify="space-between" mt={3}>
                            <Text fontSize="sm" color="gray.500">
                              {formData.postText.length} characters
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              💡 AI will analyze sentiment, timing, and trending relevance
                            </Text>
                          </Flex>
                        </FormControl>

                        <Button
                          onClick={handlePredict}
                          isLoading={loading}
                          loadingText="AI is analyzing..."
                          isDisabled={!formData.postText.trim()}
                          colorScheme="purple"
                          size="lg"
                          w="full"
                          mt={6}
                          h="60px"
                          fontSize="lg"
                          borderRadius="xl"
                        >
                          🤖 Get AI Viral Prediction
                        </Button>
                      </CardBody>
                    </Card>

                    {/* Trending Topics */}
                    {trendingTopics && (
                      <Card w="full" bg="purple.50" shadow="lg">
                        <CardHeader>
                          <Heading size="sm">📈 Current Trending Topics in {formData.niche}</Heading>
                        </CardHeader>
                        <CardBody>
                          <HStack wrap="wrap" spacing={2}>
                            {trendingTopics.slice(0, 10).map((topic, index) => (
                              <Badge key={index} colorScheme="purple" fontSize="xs">
                                {topic.name} (+{topic.change}%)
                              </Badge>
                            ))}
                          </HStack>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                ) : (
                  <Alert status="warning">
                    <AlertIcon />
                    Please complete the Creator Lookup first to analyze your content.
                  </Alert>
                )}
              </TabPanel>

              {/* AI Insights Tab */}
              <TabPanel>
                {prediction && (
                  <VStack spacing={8}>
                    {/* AI Analysis Results */}
                    <Card w="full" bg={cardBg} shadow="xl">
                      <CardHeader>
                        <Heading size="lg">🤖 AI Marketing Expert Analysis</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={6}>
                          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="full">
                            <Box textAlign="center" p={6} bg="blue.50" borderRadius="xl">
                              <Text fontSize="sm" color="gray.600" mb={2}>AI Viral Score</Text>
                              <Text fontSize="4xl" fontWeight="bold" color="blue.500">
                                {prediction.prediction.viralProbability}%
                              </Text>
                              <Badge colorScheme="blue" fontSize="sm">
                                {prediction.prediction.category}
                              </Badge>
                            </Box>

                            <Box textAlign="center" p={6} bg="green.50" borderRadius="xl">
                              <Text fontSize="sm" color="gray.600" mb={2}>AI Confidence</Text>
                              <Text fontSize="4xl" fontWeight="bold" color="green.500">
                                {prediction.prediction.confidence}%
                              </Text>
                              <Badge colorScheme="green" fontSize="sm">Expert Analysis</Badge>
                            </Box>

                            <Box textAlign="center" p={6} bg="purple.50" borderRadius="xl">
                              <Text fontSize="sm" color="gray.600" mb={2}>Expected Reach</Text>
                              <Text fontSize="4xl" fontWeight="bold" color="purple.500">
                                {prediction.prediction.expectedReach?.toLocaleString() || 'N/A'}
                              </Text>
                              <Badge colorScheme="purple" fontSize="sm">People</Badge>
                            </Box>
                          </SimpleGrid>

                          {/* AI Explanation */}
                          {prediction.aiAnalysis && (
                            <Box w="full" bg="gray.50" p={6} borderRadius="lg">
                              <Heading size="sm" mb={3}>🧠 AI Marketing Expert Explanation</Heading>
                              <Text fontSize="sm" lineHeight="tall">
                                {prediction.aiAnalysis.explanation}
                              </Text>
                            </Box>
                          )}

                          {/* AI Recommendations */}
                          {prediction.aiAnalysis?.recommendations && (
                            <Box w="full">
                              <Heading size="sm" mb={3}>💡 AI-Powered Recommendations</Heading>
                              <VStack spacing={3} align="stretch">
                                {prediction.aiAnalysis.recommendations.map((rec, index) => (
                                  <Box key={index} p={4} bg="yellow.50" borderRadius="lg" borderLeft="4px" borderColor="yellow.400">
                                    <Text fontWeight="semibold" fontSize="sm">{rec.title}</Text>
                                    <Text fontSize="sm" color="gray.600" mt={1}>{rec.description}</Text>
                                  </Box>
                                ))}
                              </VStack>
                            </Box>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                )}
              </TabPanel>

              {/* How AI Works Tab */}
              <TabPanel>
                <VStack spacing={6}>
                  <Card w="full" bg={cardBg} shadow="lg">
                    <CardHeader>
                      <Heading size="md">🧠 How Our AI Marketing Expert Works</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Box p={4} bg="blue.50" borderRadius="lg">
                          <Text fontWeight="semibold" mb={2}>1. Real Creator Data Analysis</Text>
                          <Text fontSize="sm" color="gray.600">
                            Uses LunarCrush API to fetch your actual followers, engagement rate, and posting history
                          </Text>
                        </Box>
                        <Box p={4} bg="green.50" borderRadius="lg">
                          <Text fontWeight="semibold" mb={2}>2. Trending Topic Intelligence</Text>
                          <Text fontSize="sm" color="gray.600">
                            Analyzes current trending topics in your niche and how your content aligns with them
                          </Text>
                        </Box>
                        <Box p={4} bg="purple.50" borderRadius="lg">
                          <Text fontWeight="semibold" mb={2}>3. AI Marketing Expert</Text>
                          <Text fontSize="sm" color="gray.600">
                            Google Gemini acts as a social media marketing guru, analyzing all data to provide expert insights
                          </Text>
                        </Box>
                        <Box p={4} bg="orange.50" borderRadius="lg">
                          <Text fontWeight="semibold" mb={2}>4. Contextual Predictions</Text>
                          <Text fontSize="sm" color="gray.600">
                            Combines your real data, trending topics, and AI analysis for accurate, personalized predictions
                          </Text>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card w="full" bg="yellow.50" shadow="lg">
                    <CardBody>
                      <Heading size="sm" mb={3}>🎯 Why This Approach Works</Heading>
                      <List spacing={2}>
                        <ListItem>
                          <Text fontSize="sm">✅ <strong>Real Data:</strong> Uses your actual social media metrics, not estimates</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontSize="sm">✅ <strong>Current Trends:</strong> Analyzes what's actually trending right now</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontSize="sm">✅ <strong>AI Expertise:</strong> Marketing expert AI with deep social media knowledge</Text>
                        </ListItem>
                        <ListItem>
                          <Text fontSize="sm">✅ <strong>Platform-Specific:</strong> Tailored advice for each platform's algorithm</Text>
                        </ListItem>
                      </List>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
}
