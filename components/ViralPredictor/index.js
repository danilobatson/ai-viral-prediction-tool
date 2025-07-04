import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Badge,
  Progress,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Spinner,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Link,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  SimpleGrid,
  Container,
  Heading,
  Flex,
  Spacer,
  useColorModeValue
} from '@chakra-ui/react';
import { CheckIcon, StarIcon, TrendingUpIcon, ExternalLinkIcon } from '@chakra-ui/icons';

// Analytics tracking
const trackEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
};

const ViralPredictor = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  
  const [formData, setFormData] = useState({
    platform: 'x',
    handle: '',
    niche: 'crypto',
    customNiche: '',
    postText: '',
    postDescription: '', // For videos/images
    contentType: 'text' // text, image, video
  });

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Handle form updates
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // Creator lookup with REAL MCP data
  const handleLookup = async () => {
    if (!formData.platform || !formData.handle) {
      setError('Please enter both platform and handle');
      return;
    }

    setLookupLoading(true);
    setError(null);
    
    trackEvent('creator_lookup_started', {
      platform: formData.platform,
      handle: formData.handle,
      niche: formData.niche
    });
    
    try {
      console.log('🔍 Starting REAL creator lookup...');
      
      const response = await fetch('/api/lookup-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: formData.platform,
          handle: formData.handle,
          niche: formData.niche === 'other' ? formData.customNiche : formData.niche
        }),
      });

      if (!response.ok) {
        throw new Error('Creator lookup failed');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Creator lookup failed');
      }

      setCreatorData(data.creatorData);
      setTrendingTopics(data.trendingTopics || []);
      
      toast({
        title: 'Creator Found! 🎉',
        description: `Found your profile with ${data.creatorData.followers?.toLocaleString()} followers`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      trackEvent('creator_lookup_success', {
        platform: formData.platform,
        followers: data.creatorData.followers,
        engagement_rate: data.creatorData.engagementRate,
        real_data: data.integration?.realDataReturned || false
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
      
      trackEvent('creator_lookup_error', { error: err.message });
    } finally {
      setLookupLoading(false);
    }
  };

  // AI prediction with REAL Gemini + ML
  const handlePredict = async () => {
    const postContent = formData.contentType === 'text' ? formData.postText : formData.postDescription;
    
    if (!postContent.trim()) {
      setError(`Please enter your ${formData.contentType === 'text' ? 'post content' : 'content description'}`);
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
      content_length: postContent.length,
      content_type: formData.contentType,
      niche: formData.niche
    });
    
    try {
      console.log('🤖 Starting REAL AI prediction...');
      
      const response = await fetch('/api/predict-viral-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postData: {
            text: postContent,
            platform: formData.platform,
            niche: formData.niche === 'other' ? formData.customNiche : formData.niche,
            contentType: formData.contentType
          },
          creatorData: creatorData,
          trendingTopics: trendingTopics,
          analysisType: 'hybrid' // Use hybrid Gemini + ML + MCP
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI prediction');
      }

      const data = await response.json();
      setPrediction(data);
      setActiveTab(1); // Switch to results tab
      
      toast({
        title: 'Analysis Complete! 🎯',
        description: `Viral probability: ${data.prediction.viralProbability}%`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      trackEvent('ai_prediction_completed', {
        viral_probability: data.prediction.viralProbability,
        confidence: data.prediction.confidence,
        platform: formData.platform,
        follower_count: creatorData?.followers || 0,
        analysis_method: data.analysisMethod?.type,
        real_data: data.analysisMethod?.realData
      });
      
    } catch (err) {
      setError(err.message);
      trackEvent('prediction_error', { error: err.message });
      
      toast({
        title: 'Prediction Failed',
        description: err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Platform options
  const getSupportedPlatforms = () => [
    { value: 'x', label: 'X (Twitter)', icon: '🐦' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'reddit', label: 'Reddit', icon: '🤖' },
  ];

  // EXPANDED Niche options
  const getNicheOptions = () => [
    { value: 'crypto', label: 'Cryptocurrency & DeFi' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'gaming', label: 'Gaming & Esports' },
    { value: 'nft', label: 'NFTs & Digital Art' },
    { value: 'meme', label: 'Meme & Viral Content' },
    { value: 'tech', label: 'Technology & Software' },
    { value: 'business', label: 'Business & Startups' },
    { value: 'finance', label: 'Finance & Trading' },
    { value: 'lifestyle', label: 'Lifestyle & Wellness' },
    { value: 'entertainment', label: 'Entertainment & Pop Culture' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'music', label: 'Music & Audio' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel & Adventure' },
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'education', label: 'Education & Learning' },
    { value: 'news', label: 'News & Politics' },
    { value: 'science', label: 'Science & Research' },
    { value: 'other', label: '🔧 Other (specify below)' }
  ];

  // Content type options
  const getContentTypes = () => [
    { value: 'text', label: 'Text Post', icon: '📝' },
    { value: 'image', label: 'Image/Photo', icon: '📸' },
    { value: 'video', label: 'Video/Reel', icon: '🎥' }
  ];

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="xl" mb={2} bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
            AI Viral Prediction Tool
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Real-time analysis using Google Gemini AI + LunarCrush MCP + ML Models
          </Text>
          <Badge colorScheme="green" mt={2}>Phase 3.2 - Real Data Integration</Badge>
        </Box>

        {/* Main Interface */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Tabs index={activeTab} onChange={setActiveTab} variant="soft-rounded" colorScheme="blue">
              <TabList mb={6}>
                <Tab>🔍 Creator Lookup</Tab>
                <Tab isDisabled={!prediction}>📊 AI Analysis</Tab>
                <Tab>🧠 How AI Works</Tab>
              </TabList>

              <TabPanels>
                {/* Creator Lookup Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Step 1: Lookup Your Creator Profile</Heading>
                    
                    <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                      <GridItem>
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
                        </FormControl>
                      </GridItem>
                      
                      <GridItem>
                        <FormControl>
                          <FormLabel>Handle/Username</FormLabel>
                          <Input
                            placeholder="elonmusk"
                            value={formData.handle}
                            onChange={(e) => handleInputChange('handle', e.target.value)}
                          />
                          <FormHelperText>Enter without @ symbol</FormHelperText>
                        </FormControl>
                      </GridItem>
                    </Grid>

                    <FormControl>
                      <FormLabel>Content Niche</FormLabel>
                      <Select
                        value={formData.niche}
                        onChange={(e) => handleInputChange('niche', e.target.value)}
                      >
                        {getNicheOptions().map(niche => (
                          <option key={niche.value} value={niche.value}>
                            {niche.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {formData.niche === 'other' && (
                      <FormControl>
                        <FormLabel>Custom Niche</FormLabel>
                        <Input
                          placeholder="e.g., Photography, Gardening, etc."
                          value={formData.customNiche}
                          onChange={(e) => handleInputChange('customNiche', e.target.value)}
                        />
                      </FormControl>
                    )}

                    <Button
                      colorScheme="blue"
                      size="lg"
                      onClick={handleLookup}
                      isLoading={lookupLoading}
                      loadingText="Finding Creator..."
                    >
                      🔍 Lookup Creator Profile
                    </Button>

                    {/* Creator Data Display */}
                    {creatorData && (
                      <Card bg="green.50" borderColor="green.200">
                        <CardBody>
                          <VStack align="start" spacing={4}>
                            <Flex w="full" align="center">
                              <Heading size="md">@{creatorData.handle}</Heading>
                              <Spacer />
                              {creatorData.verified && <Badge colorScheme="blue">✓ Verified</Badge>}
                              {creatorData.mcpIntegration?.usingRealData && (
                                <Badge colorScheme="green" ml={2}>🔴 Live Data</Badge>
                              )}
                            </Flex>
                            
                            <SimpleGrid columns={3} spacing={4} w="full">
                              <Stat>
                                <StatLabel>Followers</StatLabel>
                                <StatNumber>{creatorData.followers?.toLocaleString()}</StatNumber>
                                <StatHelpText>{creatorData.viralPotential} Potential</StatHelpText>
                              </Stat>
                              <Stat>
                                <StatLabel>Engagement Rate</StatLabel>
                                <StatNumber>{creatorData.engagementRate}%</StatNumber>
                                <StatHelpText>{creatorData.engagementTier} Level</StatHelpText>
                              </Stat>
                              <Stat>
                                <StatLabel>Creator Rank</StatLabel>
                                <StatNumber>#{creatorData.creatorRank}</StatNumber>
                                <StatHelpText>LunarCrush</StatHelpText>
                              </Stat>
                            </SimpleGrid>
                          </VStack>
                        </CardBody>
                      </Card>
                    )}

                    {/* Content Creation Section */}
                    {creatorData && (
                      <Box>
                        <Divider my={6} />
                        <Heading size="md" mb={4}>Step 2: Describe Your Content</Heading>
                        
                        <FormControl mb={4}>
                          <FormLabel>Content Type</FormLabel>
                          <Select
                            value={formData.contentType}
                            onChange={(e) => handleInputChange('contentType', e.target.value)}
                          >
                            {getContentTypes().map(type => (
                              <option key={type.value} value={type.value}>
                                {type.icon} {type.label}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        {formData.contentType === 'text' ? (
                          <FormControl>
                            <FormLabel>Post Content</FormLabel>
                            <Textarea
                              placeholder="What are you going to post? Include hashtags, mentions, etc."
                              value={formData.postText}
                              onChange={(e) => handleInputChange('postText', e.target.value)}
                              minH="120px"
                            />
                            <FormHelperText>
                              Characters: {formData.postText.length} | 
                              For best results, include emojis, hashtags, and mentions
                            </FormHelperText>
                          </FormControl>
                        ) : (
                          <FormControl>
                            <FormLabel>
                              {formData.contentType === 'image' ? 'Image Description & Caption' : 'Video Description & Caption'}
                            </FormLabel>
                            <Textarea
                              placeholder={
                                formData.contentType === 'image' 
                                  ? "Describe your image and the caption you'll use. What's in the image? What message will you post with it?"
                                  : "Describe your video content and caption. What happens in the video? What's your call-to-action?"
                              }
                              value={formData.postDescription}
                              onChange={(e) => handleInputChange('postDescription', e.target.value)}
                              minH="120px"
                            />
                            <FormHelperText>
                              Characters: {formData.postDescription.length} | 
                              Include both visual content description and text caption
                            </FormHelperText>
                          </FormControl>
                        )}

                        <Button
                          colorScheme="purple"
                          size="lg"
                          w="full"
                          mt={4}
                          onClick={handlePredict}
                          isLoading={loading}
                          loadingText="Analyzing with AI..."
                        >
                          🤖 Predict Viral Potential with AI
                        </Button>
                      </Box>
                    )}

                    {/* Error Display */}
                    {error && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>

                {/* AI Analysis Results Tab */}
                <TabPanel>
                  {prediction ? (
                    <VStack spacing={6} align="stretch">
                      <Heading size="md">AI Viral Prediction Results</Heading>
                      
                      {/* Main Prediction Score */}
                      <Card bg="purple.50" borderColor="purple.200">
                        <CardBody>
                          <VStack spacing={4}>
                            <Heading size="lg" color="purple.600">
                              {prediction.prediction.viralProbability}% Viral Probability
                            </Heading>
                            <Progress 
                              value={prediction.prediction.viralProbability} 
                              size="lg" 
                              colorScheme="purple" 
                              w="full"
                              borderRadius="md"
                            />
                            <HStack>
                              <Badge colorScheme="blue">
                                {prediction.prediction.confidence}% Confidence
                              </Badge>
                              <Badge colorScheme="green">
                                {prediction.prediction.category}
                              </Badge>
                              {prediction.analysisMethod?.realData && (
                                <Badge colorScheme="purple">🔴 Real AI Analysis</Badge>
                              )}
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Hybrid Analysis Details */}
                      {prediction.prediction.hybridAnalysis && (
                        <Card>
                          <CardBody>
                            <Heading size="sm" mb={3}>Hybrid Analysis Breakdown</Heading>
                            <SimpleGrid columns={2} spacing={4}>
                              <Stat>
                                <StatLabel>Gemini AI Score</StatLabel>
                                <StatNumber>{prediction.prediction.hybridAnalysis.geminiScore}%</StatNumber>
                              </Stat>
                              <Stat>
                                <StatLabel>ML Model Score</StatLabel>
                                <StatNumber>
                                  {prediction.prediction.hybridAnalysis.mlScore || 'N/A'}%
                                </StatNumber>
                              </Stat>
                            </SimpleGrid>
                            <Text fontSize="sm" color="gray.600" mt={2}>
                              Method: {prediction.prediction.hybridAnalysis.method}
                            </Text>
                          </CardBody>
                        </Card>
                      )}

                      {/* AI Explanation */}
                      <Card>
                        <CardBody>
                          <Heading size="sm" mb={3}>AI Expert Analysis</Heading>
                          <Text>{prediction.prediction.aiAnalysis?.explanation}</Text>
                          
                          {prediction.prediction.aiAnalysis?.recommendations && (
                            <Box mt={4}>
                              <Text fontWeight="bold" mb={2}>Recommendations:</Text>
                              <List spacing={2}>
                                {prediction.prediction.aiAnalysis.recommendations.map((rec, index) => (
                                  <ListItem key={index}>
                                    <ListIcon as={CheckIcon} color="green.500" />
                                    <Text as="span" fontWeight="bold">{rec.title}:</Text> {rec.description}
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          )}
                        </CardBody>
                      </Card>

                      {/* Expected Reach */}
                      <SimpleGrid columns={2} spacing={4}>
                        <Card>
                          <CardBody>
                            <Stat>
                              <StatLabel>Expected Reach</StatLabel>
                              <StatNumber>{prediction.prediction.expectedReach?.toLocaleString()}</StatNumber>
                              <StatHelpText>
                                <StatArrow type="increase" />
                                Based on viral potential
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>
                        
                        <Card>
                          <CardBody>
                            <Stat>
                              <StatLabel>Content Score</StatLabel>
                              <StatNumber>{prediction.prediction.aiAnalysis?.contentScore}/100</StatNumber>
                              <StatHelpText>Quality rating</StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </VStack>
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Text>Complete creator lookup and content analysis to see results</Text>
                    </Box>
                  )}
                </TabPanel>

                {/* How AI Works Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">How Our AI Viral Prediction Works</Heading>
                    
                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={3}>🧠 Hybrid AI Analysis System</Heading>
                        <Text mb={4}>
                          Our tool combines three powerful technologies to predict viral potential:
                        </Text>
                        
                        <List spacing={3}>
                          <ListItem>
                            <ListIcon as={StarIcon} color="blue.500" />
                            <Text as="span" fontWeight="bold">Google Gemini AI (70% weight):</Text> Advanced language model analyzes content quality, emotional triggers, and viral patterns
                          </ListItem>
                          <ListItem>
                            <ListIcon as={StarIcon} color="green.500" />
                            <Text as="span" fontWeight="bold">Enhanced ML Model (30% weight):</Text> Machine learning trained on historical viral content data
                          </ListItem>
                          <ListItem>
                            <ListIcon as={StarIcon} color="purple.500" />
                            <Text as="span" fontWeight="bold">LunarCrush MCP Data:</Text> Real-time social metrics, follower counts, and engagement rates
                          </ListItem>
                        </List>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody>
                        <Heading size="sm" mb={3}>📊 Analysis Factors</Heading>
                        <SimpleGrid columns={2} spacing={4}>
                          <Box>
                            <Text fontWeight="bold" mb={2}>Creator Metrics:</Text>
                            <List spacing={1} fontSize="sm">
                              <ListItem>• Follower count & growth</ListItem>
                              <ListItem>• Engagement rate history</ListItem>
                              <ListItem>• Creator ranking</ListItem>
                              <ListItem>• Verification status</ListItem>
                            </List>
                          </Box>
                          <Box>
                            <Text fontWeight="bold" mb={2}>Content Analysis:</Text>
                            <List spacing={1} fontSize="sm">
                              <ListItem>• Emotional triggers</ListItem>
                              <ListItem>• Trending topic alignment</ListItem>
                              <ListItem>• Platform optimization</ListItem>
                              <ListItem>• Content structure</ListItem>
                            </List>
                          </Box>
                        </SimpleGrid>
                      </CardBody>
                    </Card>

                    <Alert status="info">
                      <AlertIcon />
                      <AlertDescription>
                        <Text fontWeight="bold">Real-Time Data:</Text> This tool uses live data from LunarCrush MCP 
                        and real AI analysis from Google Gemini. No mock data or templates are used.
                      </AlertDescription>
                    </Alert>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Trending Topics Display */}
        {trendingTopics.length > 0 && (
          <Card>
            <CardBody>
              <Heading size="sm" mb={3}>📈 Current Trending Topics</Heading>
              <Wrap>
                {trendingTopics.map((topic, index) => (
                  <WrapItem key={index}>
                    <Tag size="md" colorScheme={topic.change > 0 ? 'green' : 'red'}>
                      <TagLabel>
                        {topic.name} {topic.change > 0 ? '+' : ''}{topic.change}%
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
};

export default ViralPredictor;
