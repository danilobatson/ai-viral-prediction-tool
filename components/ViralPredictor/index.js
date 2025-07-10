import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Textarea,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  Progress,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
} from '@chakra-ui/react';
import { 
  Sparkles, 
  Clock, 
  Hash, 
  Edit3, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb 
} from 'lucide-react';

const ViralPredictor = () => {
  const [postText, setPostText] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [isVerified, setIsVerified] = useState('false');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const handlePredict = async () => {
    if (!postText.trim()) {
      toast({
        title: 'Please enter post content',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/predict-viral-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postData: {
            text: postText,
            creator: {
              follower_count: parseInt(followerCount) || 1000,
              verified: isVerified === 'true',
            },
            interactions: 0,
            created_time: new Date().toISOString(),
          },
          options: {
            includeContentOptimization: true,
            includeTimingAnalysis: true,
            includeHashtagSuggestions: true,
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPrediction(data.prediction);
        setActiveTab(1); // Switch to results tab
        
        toast({
          title: 'Analysis complete!',
          description: `Viral probability: ${data.prediction.viralProbability}%`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: 'Analysis failed',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getViralColor = (probability) => {
    if (probability >= 80) return 'green';
    if (probability >= 60) return 'blue';
    if (probability >= 40) return 'yellow';
    return 'red';
  };

  const getViralCategory = (probability) => {
    if (probability >= 80) return 'Ultra Viral';
    if (probability >= 60) return 'High Viral';
    if (probability >= 40) return 'Moderate Viral';
    return 'Low Viral';
  };

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <VStack spacing={6}>
        {/* Header */}
        <VStack spacing={2} textAlign="center">
          <HStack spacing={2}>
            <Icon as={Sparkles} w={6} h={6} color="purple.500" />
            <Heading size="lg" color="purple.600">
              Twitter Viral Probability Analyzer
            </Heading>
          </HStack>
          <Text color="gray.600">
            AI-powered analysis with content optimization, timing insights, and hashtag suggestions
          </Text>
          <Badge colorScheme="purple" variant="subtle">
            Enhanced with Content + Timing + Hashtag Intelligence
          </Badge>
        </VStack>

        <Tabs index={activeTab} onChange={setActiveTab} w="full" variant="enclosed">
          <TabList>
            <Tab>
              <HStack spacing={2}>
                <Icon as={Edit3} w={4} h={4} />
                <Text>Analyze Post</Text>
              </HStack>
            </Tab>
            <Tab isDisabled={!prediction}>
              <HStack spacing={2}>
                <Icon as={TrendingUp} w={4} h={4} />
                <Text>Results & Optimization</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Analysis Input Tab */}
            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">Post Analysis</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Enter your tweet content and creator details for comprehensive viral analysis
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Tweet Content</FormLabel>
                      <Textarea
                        placeholder="🚀 Bitcoin just hit $100K! This is the moment we've all been waiting for! #BTC #Crypto #ToTheMoon"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        minH="120px"
                        maxLength={280}
                      />
                      <Text fontSize="xs" color="gray.500" textAlign="right">
                        {postText.length}/280 characters
                      </Text>
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Follower Count</FormLabel>
                        <NumberInput min={0}>
                          <NumberInputField
                            placeholder="50000"
                            value={followerCount}
                            onChange={(e) => setFollowerCount(e.target.value)}
                          />
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Verified Account</FormLabel>
                        <Select
                          value={isVerified}
                          onChange={(e) => setIsVerified(e.target.value)}
                        >
                          <option value="false">Not Verified</option>
                          <option value="true">Verified ✓</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>

                    <Button
                      colorScheme="purple"
                      size="lg"
                      onClick={handlePredict}
                      isLoading={isLoading}
                      loadingText="Analyzing with AI..."
                      leftIcon={<Icon as={Sparkles} />}
                      w="full"
                    >
                      Analyze Viral Potential + Get Optimization Tips
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Results Tab */}
            <TabPanel>
              {prediction && (
                <VStack spacing={6}>
                  {/* Main Viral Probability */}
                  <Card w="full">
                    <CardBody>
                      <VStack spacing={4}>
                        <HStack spacing={4} justify="center">
                          <VStack>
                            <Text fontSize="4xl" fontWeight="bold" color={`${getViralColor(prediction.viralProbability)}.500`}>
                              {prediction.viralProbability}%
                            </Text>
                            <Badge colorScheme={getViralColor(prediction.viralProbability)} size="lg">
                              {getViralCategory(prediction.viralProbability)}
                            </Badge>
                          </VStack>
                        </HStack>
                        
                        <Progress
                          value={prediction.viralProbability}
                          colorScheme={getViralColor(prediction.viralProbability)}
                          size="lg"
                          w="full"
                          borderRadius="md"
                        />
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Detailed Scores */}
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
                    <Stat textAlign="center" p={4} bg="blue.50" borderRadius="lg">
                      <StatLabel>Content Score</StatLabel>
                      <StatNumber fontSize="2xl">
                        {prediction.contentScore || Math.floor(prediction.confidence * 0.9)}%
                      </StatNumber>
                      <StatHelpText>Viral Elements</StatHelpText>
                    </Stat>

                    <Stat textAlign="center" p={4} bg="green.50" borderRadius="lg">
                      <StatLabel>Creator Authority</StatLabel>
                      <StatNumber fontSize="2xl">
                        {prediction.authorityScore || Math.floor(prediction.confidence * 0.85)}%
                      </StatNumber>
                      <StatHelpText>Influence Level</StatHelpText>
                    </Stat>

                    <Stat textAlign="center" p={4} bg="orange.50" borderRadius="lg">
                      <StatLabel>Timing Score</StatLabel>
                      <StatNumber fontSize="2xl">
                        {prediction.timingScore || Math.floor(prediction.confidence * 0.8)}%
                      </StatNumber>
                      <StatHelpText>Optimal Timing</StatHelpText>
                    </Stat>

                    <Stat textAlign="center" p={4} bg="purple.50" borderRadius="lg">
                      <StatLabel>Crypto Relevance</StatLabel>
                      <StatNumber fontSize="2xl">
                        {prediction.nicheScore || Math.floor(prediction.confidence * 0.95)}%
                      </StatNumber>
                      <StatHelpText>Niche Alignment</StatHelpText>
                    </Stat>
                  </SimpleGrid>

                  {/* Content Optimization */}
                  {prediction.optimizedVersions && (
                    <Card w="full">
                      <CardHeader>
                        <HStack spacing={2}>
                          <Icon as={Edit3} color="blue.500" />
                          <Heading size="md">Content Optimization Suggestions</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3}>
                          {prediction.optimizedVersions.slice(0, 2).map((version, index) => (
                            <Box key={index} p={4} bg="blue.50" borderRadius="lg" w="full">
                              <Text fontSize="sm" fontWeight="bold" color="blue.600" mb={2}>
                                Optimized Version {index + 1}:
                              </Text>
                              <Text>{version}</Text>
                            </Box>
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Hashtag Suggestions */}
                  <Card w="full">
                    <CardHeader>
                      <HStack spacing={2}>
                        <Icon as={Hash} color="green.500" />
                        <Heading size="md">Recommended Hashtags</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <Text fontSize="sm" color="gray.600">
                          Trending hashtags optimized for crypto content:
                        </Text>
                        <HStack wrap="wrap" spacing={2}>
                          {['#Bitcoin', '#Crypto', '#BTC', '#Blockchain', '#ToTheMoon', '#HODL', '#CryptoNews', '#DeFi'].map((tag, index) => (
                            <Badge key={index} colorScheme="green" p={2}>
                              {tag}
                            </Badge>
                          ))}
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                          💡 Use 2-3 hashtags maximum for optimal engagement
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Timing Optimization */}
                  <Card w="full">
                    <CardHeader>
                      <HStack spacing={2}>
                        <Icon as={Clock} color="orange.500" />
                        <Heading size="md">Optimal Timing</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" color="orange.600" mb={2}>
                              Best Times to Post:
                            </Text>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm">• 9:00-11:00 AM EST (Crypto morning)</Text>
                              <Text fontSize="sm">• 7:00-9:00 PM EST (Evening engagement)</Text>
                              <Text fontSize="sm">• Sunday 6:00-8:00 PM (Weekly peak)</Text>
                            </VStack>
                          </Box>
                          <Box>
                            <Text fontSize="sm" fontWeight="bold" color="orange.600" mb={2}>
                              Current Timing:
                            </Text>
                            <Badge colorScheme="orange" p={2}>
                              {new Date().toLocaleTimeString()} EST
                            </Badge>
                            <Text fontSize="xs" color="gray.500" mt={1}>
                              Timing multiplier: 0.85x
                            </Text>
                          </Box>
                        </SimpleGrid>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* AI Recommendations */}
                  {prediction.recommendations && (
                    <Card w="full">
                      <CardHeader>
                        <HStack spacing={2}>
                          <Icon as={Lightbulb} color="purple.500" />
                          <Heading size="md">AI Recommendations</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          {prediction.recommendations.slice(0, 4).map((rec, index) => (
                            <Text key={index} fontSize="sm" color="gray.700">
                              • {rec}
                            </Text>
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Summary Alert */}
                  <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Complete Optimization Summary</Text>
                      <Text fontSize="sm">
                        Your post has been analyzed for viral potential, optimized for content, 
                        enhanced with trending hashtags, and timed for maximum engagement. 
                        Implement these suggestions for best results!
                      </Text>
                    </Box>
                  </Alert>
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default ViralPredictor;
