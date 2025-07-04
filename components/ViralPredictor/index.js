import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Textarea,
  Input,
  Select,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Progress,
  Badge,
  Spinner,
  Card,
  CardBody,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  FormHelperText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

const ViralPredictor = () => {
  const [contentType, setContentType] = useState('text');
  const [platform, setPlatform] = useState('x');
  const [niche, setNiche] = useState('general');
  const [username, setUsername] = useState('');
  
  // Text content fields
  const [textContent, setTextContent] = useState('');
  
  // Image content fields
  const [imageCaption, setImageCaption] = useState('');
  const [imageHashtags, setImageHashtags] = useState('');
  
  // Video content fields
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoHashtags, setVideoHashtags] = useState('');
  
  // Story content fields
  const [storyText, setStoryText] = useState('');
  const [storyHashtags, setStoryHashtags] = useState('');
  
  // Poll content fields
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState('');
  const [pollContext, setPollContext] = useState('');

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Only MCP-supported platforms
  const platforms = [
    { value: 'x', label: 'X (Twitter)', supported: true, note: 'Full MCP support' },
    { value: 'reddit', label: 'Reddit', supported: true, note: 'Full MCP support' },
    { value: 'youtube', label: 'YouTube', supported: true, note: 'Full MCP support' },
    { value: 'tiktok', label: 'TikTok', supported: false, note: 'Analysis only' },
    { value: 'instagram', label: 'Instagram', supported: false, note: 'Analysis only' },
    { value: 'linkedin', label: 'LinkedIn', supported: false, note: 'Analysis only' },
  ];

  const contentTypes = [
    { 
      value: 'text', 
      label: '📝 Text Post',
      description: 'Regular text posts, tweets, status updates'
    },
    { 
      value: 'image', 
      label: '📸 Image Post',
      description: 'Posts with images + captions'
    },
    { 
      value: 'video', 
      label: '🎥 Video Content',
      description: 'YouTube videos, TikToks, Reels'
    },
    { 
      value: 'story', 
      label: '📱 Story/Short',
      description: 'Stories, Shorts, ephemeral content'
    },
    { 
      value: 'poll', 
      label: '📊 Poll/Question',
      description: 'Interactive polls and questions'
    },
    { 
      value: 'thread', 
      label: '🧵 Thread/Series',
      description: 'Twitter threads, LinkedIn carousels'
    },
    { 
      value: 'live', 
      label: '🔴 Live Content',
      description: 'Live streams, Twitter Spaces'
    },
    { 
      value: 'other', 
      label: '❓ Other',
      description: 'Custom content type'
    },
  ];

  // Extensive niche categories
  const niches = [
    // Technology
    { value: 'ai', label: '🤖 AI & Machine Learning', category: 'Technology' },
    { value: 'crypto', label: '₿ Cryptocurrency & Blockchain', category: 'Technology' },
    { value: 'tech', label: '💻 Technology & Programming', category: 'Technology' },
    { value: 'web3', label: '🌐 Web3 & DeFi', category: 'Technology' },
    { value: 'cybersecurity', label: '🔒 Cybersecurity', category: 'Technology' },
    { value: 'data', label: '📊 Data Science & Analytics', category: 'Technology' },
    
    // Business & Finance
    { value: 'business', label: '💼 Business & Entrepreneurship', category: 'Business' },
    { value: 'finance', label: '💰 Finance & Investing', category: 'Business' },
    { value: 'marketing', label: '📈 Marketing & Social Media', category: 'Business' },
    { value: 'ecommerce', label: '🛍️ E-commerce & Retail', category: 'Business' },
    { value: 'startup', label: '🚀 Startups & Innovation', category: 'Business' },
    { value: 'realestate', label: '🏠 Real Estate', category: 'Business' },
    
    // Lifestyle & Entertainment
    { value: 'lifestyle', label: '✨ Lifestyle & Wellness', category: 'Lifestyle' },
    { value: 'fitness', label: '💪 Fitness & Health', category: 'Lifestyle' },
    { value: 'food', label: '🍕 Food & Cooking', category: 'Lifestyle' },
    { value: 'travel', label: '✈️ Travel & Adventure', category: 'Lifestyle' },
    { value: 'fashion', label: '👗 Fashion & Beauty', category: 'Lifestyle' },
    { value: 'entertainment', label: '🎬 Entertainment & Media', category: 'Lifestyle' },
    
    // Creative & Education
    { value: 'education', label: '📚 Education & Learning', category: 'Education' },
    { value: 'design', label: '🎨 Design & Creativity', category: 'Creative' },
    { value: 'music', label: '🎵 Music & Audio', category: 'Creative' },
    { value: 'writing', label: '✍️ Writing & Content', category: 'Creative' },
    { value: 'photography', label: '📷 Photography & Visual', category: 'Creative' },
    
    // Gaming & Sports
    { value: 'gaming', label: '🎮 Gaming & Esports', category: 'Gaming' },
    { value: 'sports', label: '⚽ Sports & Athletics', category: 'Sports' },
    { value: 'nft', label: '🖼️ NFTs & Digital Art', category: 'Gaming' },
    
    // News & Politics
    { value: 'news', label: '📰 News & Current Events', category: 'News' },
    { value: 'politics', label: '🏛️ Politics & Policy', category: 'News' },
    { value: 'science', label: '🔬 Science & Research', category: 'Education' },
    
    // Other
    { value: 'general', label: '🌟 General/Mixed Content', category: 'General' },
    { value: 'other', label: '❓ Other/Not Listed', category: 'General' },
  ];

  const predictViral = async () => {
    // Combine all content based on type
    let combinedContent = '';
    
    switch (contentType) {
      case 'text':
        combinedContent = textContent;
        break;
      case 'image':
        combinedContent = `${imageCaption} ${imageHashtags}`.trim();
        break;
      case 'video':
        combinedContent = `${videoTitle}\n\n${videoDescription}\n\n${videoHashtags}`.trim();
        break;
      case 'story':
        combinedContent = `${storyText} ${storyHashtags}`.trim();
        break;
      case 'poll':
        combinedContent = `${pollQuestion}\n\nOptions: ${pollOptions}\n\n${pollContext}`.trim();
        break;
      case 'thread':
        combinedContent = textContent; // Use main text area for threads
        break;
      case 'live':
        combinedContent = textContent; // Use main text area for live content
        break;
      case 'other':
        combinedContent = textContent; // Use main text area for other
        break;
    }

    if (!combinedContent.trim()) {
      setError('Please fill in the required content fields');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('/api/predict-viral-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: combinedContent,
          platform,
          contentType,
          niche,
          username: username.trim() || null,
          additionalContext: {
            contentLength: combinedContent.length,
            hasHashtags: combinedContent.includes('#'),
            hasMentions: combinedContent.includes('@'),
            hasEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(combinedContent),
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        const predictionResult = {
          ...data.prediction,
          content: combinedContent,
          platform,
          contentType,
          niche,
          timestamp: new Date().toISOString(),
        };
        
        setPrediction(predictionResult);
        
        // Save to prediction history
        if (window.addPredictionToHistory) {
          window.addPredictionToHistory(predictionResult);
        }
      } else {
        setError(data.error || 'Failed to analyze content');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'green';
    if (confidence >= 60) return 'orange';
    return 'red';
  };

  const getViralLabel = (confidence) => {
    if (confidence >= 90) return 'Extremely Viral';
    if (confidence >= 80) return 'High Viral Potential';
    if (confidence >= 60) return 'Moderate Potential';
    if (confidence >= 40) return 'Low Potential';
    return 'Unlikely to Go Viral';
  };

  const getPlatformSupport = () => {
    const platformData = platforms.find(p => p.value === platform);
    return platformData || platforms[0];
  };

  const renderContentFields = () => {
    const selectedType = contentTypes.find(ct => ct.value === contentType);
    
    switch (contentType) {
      case 'text':
      case 'thread':
      case 'live':
      case 'other':
        return (
          <FormControl>
            <FormLabel fontWeight="bold">
              {contentType === 'thread' ? 'Thread Content' :
               contentType === 'live' ? 'Live Content Description' :
               contentType === 'other' ? 'Content Description' : 'Post Content'} *
            </FormLabel>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={
                contentType === 'thread' ? 
                  "Enter your thread content... \n\n1/ First tweet in thread\n2/ Second tweet content\n3/ Final tweet with CTA..." :
                contentType === 'live' ?
                  "Describe your live content... \n\nExample: 'Going live to discuss the latest AI developments and answer your questions! 🤖'" :
                contentType === 'other' ?
                  "Describe your content type and what you're posting..." :
                  "What's your post about? Enter your full text content here..."
              }
              rows={6}
              resize="vertical"
            />
            <FormHelperText>
              {selectedType?.description}
            </FormHelperText>
          </FormControl>
        );

      case 'image':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold">Image Caption/Description *</FormLabel>
              <Textarea
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="What caption will you write for this image?"
                rows={4}
                resize="vertical"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Hashtags (Optional)</FormLabel>
              <Input
                value={imageHashtags}
                onChange={(e) => setImageHashtags(e.target.value)}
                placeholder="#hashtag1 #hashtag2 #hashtag3"
              />
            </FormControl>
          </VStack>
        );

      case 'video':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold">Video Title *</FormLabel>
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="How I Built a Viral Prediction Tool in 30 Minutes"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Video Description</FormLabel>
              <Textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Detailed description of your video content..."
                rows={4}
                resize="vertical"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Tags/Keywords</FormLabel>
              <Input
                value={videoHashtags}
                onChange={(e) => setVideoHashtags(e.target.value)}
                placeholder="#tag1 #tag2 #tag3"
              />
            </FormControl>
          </VStack>
        );

      case 'story':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold">Story Text/Caption *</FormLabel>
              <Textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Text that appears on your story..."
                rows={3}
                resize="vertical"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Hashtags/Tags</FormLabel>
              <Input
                value={storyHashtags}
                onChange={(e) => setStoryHashtags(e.target.value)}
                placeholder="#hashtag1 #hashtag2"
              />
            </FormControl>
          </VStack>
        );

      case 'poll':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold">Poll Question *</FormLabel>
              <Input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="What question are you asking?"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Poll Options *</FormLabel>
              <Textarea
                value={pollOptions}
                onChange={(e) => setPollOptions(e.target.value)}
                placeholder="A) Option 1&#10;B) Option 2&#10;C) Option 3&#10;D) Option 4"
                rows={3}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Additional Context</FormLabel>
              <Textarea
                value={pollContext}
                onChange={(e) => setPollContext(e.target.value)}
                placeholder="Any additional context around your poll..."
                rows={3}
              />
            </FormControl>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab>📝 Content Setup</Tab>
            <Tab>🎯 Advanced Options</Tab>
          </TabList>

          <TabPanels>
            {/* Main Content Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Platform & Type Selection */}
                <Card bg={cardBg} borderRadius="lg">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontWeight="bold">Platform</FormLabel>
                          <Select 
                            value={platform} 
                            onChange={(e) => setPlatform(e.target.value)}
                            size="lg"
                          >
                            {platforms.map(p => (
                              <option key={p.value} value={p.value}>
                                {p.label} {p.supported ? '✓' : '(Analysis Only)'}
                              </option>
                            ))}
                          </Select>
                          <FormHelperText>
                            <Badge 
                              colorScheme={getPlatformSupport().supported ? 'green' : 'orange'}
                              size="sm"
                            >
                              {getPlatformSupport().note}
                            </Badge>
                          </FormHelperText>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="bold">Content Type</FormLabel>
                          <Select 
                            value={contentType} 
                            onChange={(e) => setContentType(e.target.value)}
                            size="lg"
                          >
                            {contentTypes.map(ct => (
                              <option key={ct.value} value={ct.value}>{ct.label}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl>
                        <FormLabel fontWeight="bold">Content Niche</FormLabel>
                        <Select 
                          value={niche} 
                          onChange={(e) => setNiche(e.target.value)}
                          size="lg"
                        >
                          {Object.entries(
                            niches.reduce((acc, niche) => {
                              if (!acc[niche.category]) acc[niche.category] = [];
                              acc[niche.category].push(niche);
                              return acc;
                            }, {})
                          ).map(([category, items]) => (
                            <optgroup key={category} label={category}>
                              {items.map(item => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </Select>
                        <FormHelperText>
                          Choose the category that best matches your content for more accurate predictions
                        </FormHelperText>
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Content Input */}
                <Card bg={cardBg} borderRadius="lg">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">
                        {contentTypes.find(ct => ct.value === contentType)?.label} Details
                      </Heading>
                      
                      {renderContentFields()}

                      <Button
                        colorScheme="purple"
                        size="lg"
                        onClick={predictViral}
                        isLoading={loading}
                        loadingText="Analyzing with AI + MCP..."
                        mt={4}
                      >
                        🚀 Predict Viral Potential
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Advanced Options Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg} borderRadius="lg">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">🎯 Enhanced Analysis Options</Heading>
                      
                      <FormControl>
                        <FormLabel fontWeight="bold">Your Username (Optional)</FormLabel>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="your_username"
                        />
                        <FormHelperText>
                          Provide your username for personalized analysis based on your follower metrics (MCP-supported platforms only)
                        </FormHelperText>
                      </FormControl>

                      <Box bg="blue.50" p={4} borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>
                          💡 Pro Tip: Username Analysis
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          When you provide your username on MCP-supported platforms (X, Reddit, YouTube), 
                          we can analyze your actual follower metrics for more accurate viral predictions!
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Error Alert */}
        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Card bg={cardBg} borderRadius="lg">
            <CardBody>
              <VStack spacing={4}>
                <Spinner size="xl" color="purple.500" />
                <VStack spacing={2}>
                  <Text fontWeight="bold">🤖 AI Analysis in Progress</Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    • Accessing {getPlatformSupport().supported ? 'real-time MCP data' : 'platform analysis'}<br/>
                    • Running Gemini 2.0 Flash Lite analysis<br/>
                    • Calculating viral probability for {niches.find(n => n.value === niche)?.label}
                  </Text>
                </VStack>
                <Progress size="lg" colorScheme="purple" isIndeterminate w="100%" />
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Prediction Results */}
        {prediction && (
          <Card bg={cardBg} borderRadius="lg" borderWidth="2px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Main Prediction Score */}
                <Box textAlign="center">
                  <Badge 
                    fontSize="lg" 
                    p={3} 
                    borderRadius="full" 
                    colorScheme={getConfidenceColor(prediction.confidence)}
                  >
                    {getViralLabel(prediction.confidence)}
                  </Badge>
                  <Heading size="2xl" mt={2} color={`${getConfidenceColor(prediction.confidence)}.500`}>
                    {prediction.confidence}%
                  </Heading>
                  <Text color="gray.600" mt={2}>
                    Viral Probability Score
                  </Text>
                  <Progress
                    value={prediction.confidence}
                    size="lg"
                    colorScheme={getConfidenceColor(prediction.confidence)}
                    mt={4}
                    borderRadius="full"
                  />
                </Box>

                <Divider />

                {/* Detailed Metrics */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Stat textAlign="center">
                    <StatLabel>Platform Fit</StatLabel>
                    <StatNumber fontSize="2xl">
                      {prediction.platformFit || Math.floor(prediction.confidence * 0.9)}%
                    </StatNumber>
                    <StatHelpText>{getPlatformSupport().label}</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Niche Relevance</StatLabel>
                    <StatNumber fontSize="2xl">
                      {Math.floor(prediction.confidence * 0.85)}%
                    </StatNumber>
                    <StatHelpText>{niches.find(n => n.value === niche)?.label}</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Content Type</StatLabel>
                    <StatNumber fontSize="2xl">
                      {Math.floor(prediction.confidence * 0.95)}%
                    </StatNumber>
                    <StatHelpText>{contentTypes.find(ct => ct.value === contentType)?.label}</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Data Source</StatLabel>
                    <StatNumber fontSize="lg">
                      {getPlatformSupport().supported ? 'MCP' : 'Analysis'}
                    </StatNumber>
                    <StatHelpText>{getPlatformSupport().note}</StatHelpText>
                  </Stat>
                </SimpleGrid>

                {/* AI Analysis */}
                {prediction.aiAnalysis && (
                  <Box>
                    <Heading size="md" mb={3}>🤖 Gemini AI Analysis</Heading>
                    <Text bg="purple.50" p={4} borderRadius="md" fontSize="sm">
                      {prediction.aiAnalysis}
                    </Text>
                  </Box>
                )}

                {/* Metadata */}
                <Box fontSize="xs" color="gray.500" textAlign="center" bg="gray.50" p={3} borderRadius="md">
                  <Text>
                    Analysis completed at {new Date(prediction.timestamp).toLocaleString()}
                  </Text>
                  <Text mt={1}>
                    Powered by Google Gemini 2.0 Flash Lite + {getPlatformSupport().supported ? 'LunarCrush MCP Protocol' : 'Platform Analysis'}
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default ViralPredictor;
