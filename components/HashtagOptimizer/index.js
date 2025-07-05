import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Icon,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import { Hash, TrendingUp, Target, Info } from 'lucide-react';

const HashtagOptimizer = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [niche, setNiche] = useState('crypto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hashtagData, setHashtagData] = useState(null);
  const toast = useToast();

  const platforms = [
    { value: 'twitter', label: 'X/Twitter', limit: 10, optimal: '2-3' },
    { value: 'instagram', label: 'Instagram', limit: 30, optimal: '11-20' },
    { value: 'linkedin', label: 'LinkedIn', limit: 5, optimal: '3-5' },
    { value: 'tiktok', label: 'TikTok', limit: 100, optimal: '3-5' },
    { value: 'youtube', label: 'YouTube', limit: 15, optimal: '10-15' },
  ];

  const niches = [
    { value: 'crypto', label: 'Cryptocurrency & DeFi' },
    { value: 'ai', label: 'AI & Machine Learning' },
    { value: 'tech', label: 'Technology' },
    { value: 'business', label: 'Business & Finance' },
    { value: 'marketing', label: 'Marketing & Growth' },
    { value: 'startup', label: 'Startups & Innovation' },
  ];

  const getCurrentPlatform = () => platforms.find(p => p.value === platform);

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic to analyze hashtags for',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call trending topics API for real hashtag data
      const response = await fetch(`/api/trending-topics?niche=${niche}`);
      const trendingData = await response.json();

      if (!trendingData.success) {
        throw new Error('Failed to fetch trending data');
      }

      // Generate hashtag analysis based on real trending data and topic
      const analysis = generateHashtagAnalysis(topic, trendingData.trending, platform, niche);
      setHashtagData(analysis);

      toast({
        title: 'Analysis Complete!',
        description: `Generated ${analysis.recommendations.length} hashtag recommendations`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Hashtag analysis error:', error);
      
      // Fallback to algorithmic analysis
      const fallbackAnalysis = generateAlgorithmicHashtagAnalysis(topic, platform, niche);
      setHashtagData(fallbackAnalysis);

      toast({
        title: 'Analysis Complete',
        description: 'Using algorithmic analysis (trending data unavailable)',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateHashtagAnalysis = (topic, trendingTopics, platform, niche) => {
    // Base hashtags by niche
    const baseHashtags = {
      crypto: ['Bitcoin', 'Crypto', 'DeFi', 'Web3', 'Blockchain', 'NFT', 'Ethereum', 'BTC'],
      ai: ['AI', 'MachineLearning', 'Tech', 'Innovation', 'Automation', 'ChatGPT', 'ML', 'TechTrends'],
      tech: ['Technology', 'Innovation', 'StartUp', 'Tech', 'Digital', 'Future', 'TechNews', 'Programming'],
      business: ['Business', 'Finance', 'Growth', 'Success', 'Entrepreneur', 'Leadership', 'Strategy', 'Marketing'],
      marketing: ['Marketing', 'Growth', 'DigitalMarketing', 'Content', 'SocialMedia', 'Branding', 'SEO', 'ContentMarketing'],
      startup: ['Startup', 'Entrepreneur', 'Innovation', 'Business', 'Funding', 'TechStartup', 'Venture', 'Growth']
    };

    const nicheHashtags = baseHashtags[niche] || baseHashtags.tech;
    const trendingNames = trendingTopics.map(t => t.name.replace(/\s+/g, ''));

    // Combine base hashtags with trending topics
    const allHashtags = [...new Set([...nicheHashtags, ...trendingNames])];

    // Generate recommendations based on topic relevance
    const recommendations = allHashtags
      .map(hashtag => {
        const relevanceScore = calculateRelevanceScore(topic, hashtag, niche);
        const popularityScore = calculatePopularityScore(hashtag, trendingTopics);
        const competitionScore = calculateCompetitionScore(hashtag);
        
        return {
          hashtag: `#${hashtag}`,
          relevance: relevanceScore,
          popularity: popularityScore,
          competition: competitionScore,
          overallScore: Math.round((relevanceScore + popularityScore + (100 - competitionScore)) / 3),
          volume: estimateVolume(hashtag, popularityScore),
          reason: generateReason(hashtag, relevanceScore, popularityScore, competitionScore)
        };
      })
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, getCurrentPlatform().limit);

    return {
      topic,
      platform: getCurrentPlatform().label,
      niche: niches.find(n => n.value === niche)?.label,
      recommendations,
      summary: {
        totalAnalyzed: allHashtags.length,
        recommended: recommendations.length,
        avgScore: Math.round(recommendations.reduce((sum, r) => sum + r.overallScore, 0) / recommendations.length),
        platformLimit: getCurrentPlatform().limit,
        optimalRange: getCurrentPlatform().optimal
      }
    };
  };

  const generateAlgorithmicHashtagAnalysis = (topic, platform, niche) => {
    // Fallback when trending API is unavailable
    const mockTrending = [
      { name: 'Bitcoin', sentiment: 0.8, mentions: 45000, change: 12.5 },
      { name: 'AI', sentiment: 0.9, mentions: 67000, change: 22.1 },
      { name: 'Technology', sentiment: 0.7, mentions: 34000, change: 5.8 }
    ];

    return generateHashtagAnalysis(topic, mockTrending, platform, niche);
  };

  const calculateRelevanceScore = (topic, hashtag, niche) => {
    let score = 30; // Base relevance
    
    // Direct topic match
    if (topic.toLowerCase().includes(hashtag.toLowerCase()) || 
        hashtag.toLowerCase().includes(topic.toLowerCase())) {
      score += 40;
    }
    
    // Niche relevance
    const nicheKeywords = {
      crypto: ['bitcoin', 'crypto', 'defi', 'blockchain', 'eth', 'btc'],
      ai: ['ai', 'ml', 'tech', 'automation', 'chatgpt', 'machine'],
      tech: ['tech', 'digital', 'innovation', 'programming', 'software'],
      business: ['business', 'finance', 'growth', 'success', 'entrepreneur'],
      marketing: ['marketing', 'content', 'social', 'brand', 'seo'],
      startup: ['startup', 'entrepreneur', 'funding', 'venture', 'innovation']
    };

    const keywords = nicheKeywords[niche] || [];
    if (keywords.some(keyword => hashtag.toLowerCase().includes(keyword))) {
      score += 20;
    }
    
    return Math.min(100, score);
  };

  const calculatePopularityScore = (hashtag, trendingTopics) => {
    // Check if hashtag matches trending topics
    const trendingMatch = trendingTopics.find(t => 
      t.name.toLowerCase().includes(hashtag.toLowerCase()) ||
      hashtag.toLowerCase().includes(t.name.toLowerCase())
    );
    
    if (trendingMatch) {
      return Math.round(trendingMatch.sentiment * 100);
    }
    
    // Base popularity estimation
    const popularityMap = {
      'bitcoin': 90, 'crypto': 85, 'ai': 88, 'tech': 75, 'business': 70,
      'marketing': 65, 'startup': 68, 'innovation': 72, 'defi': 80, 'web3': 78
    };
    
    return popularityMap[hashtag.toLowerCase()] || 50;
  };

  const calculateCompetitionScore = (hashtag) => {
    // Estimate competition based on hashtag popularity
    const highCompetition = ['bitcoin', 'crypto', 'ai', 'tech', 'business', 'marketing'];
    const mediumCompetition = ['defi', 'web3', 'startup', 'innovation', 'blockchain'];
    
    if (highCompetition.includes(hashtag.toLowerCase())) return 85;
    if (mediumCompetition.includes(hashtag.toLowerCase())) return 60;
    return 40;
  };

  const estimateVolume = (hashtag, popularityScore) => {
    const baseVolume = popularityScore * 1000;
    return baseVolume > 50000 ? '50K+' : baseVolume > 10000 ? '10K+' : '1K+';
  };

  const generateReason = (hashtag, relevance, popularity, competition) => {
    if (relevance >= 80) return 'Highly relevant to your topic';
    if (popularity >= 80) return 'Currently trending with high engagement';
    if (competition <= 50) return 'Low competition, good visibility potential';
    if (relevance >= 60 && popularity >= 60) return 'Good balance of relevance and popularity';
    return 'Niche-specific with moderate potential';
  };

  return (
    <Box maxW="5xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}># Hashtag Optimizer</Heading>
          <Text color="gray.600">
            Analyze and optimize hashtags for maximum reach and engagement
          </Text>
        </Box>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <HStack>
              <Icon as={Hash} />
              <Heading size="md">Hashtag Analysis</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <Input
                placeholder="Enter your topic or content theme..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                size="lg"
              />
              
              <HStack width="full" spacing={4}>
                <Select value={platform} onChange={(e) => setPlatform(e.target.value)} flex={1}>
                  {platforms.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.label} (limit: {p.limit})
                    </option>
                  ))}
                </Select>
                
                <Select value={niche} onChange={(e) => setNiche(e.target.value)} flex={1}>
                  {niches.map(n => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </Select>
              </HStack>

              <Button
                colorScheme="orange"
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                loadingText="Analyzing hashtags..."
                leftIcon={<Icon as={Target} />}
                size="lg"
                width="full"
                isDisabled={!topic.trim()}
              >
                Analyze Hashtags
              </Button>

              <Text fontSize="sm" color="gray.600" textAlign="center">
                Platform: {getCurrentPlatform().label} • Optimal: {getCurrentPlatform().optimal} hashtags
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Results */}
        {hashtagData && (
          <VStack spacing={6} align="stretch">
            {/* Summary */}
            <Card>
              <CardHeader>
                <HStack>
                  <Icon as={TrendingUp} />
                  <Heading size="md">Analysis Summary</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Stat textAlign="center">
                    <StatLabel>Recommendations</StatLabel>
                    <StatNumber>{hashtagData.summary.recommended}</StatNumber>
                    <StatHelpText>Optimized hashtags</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Average Score</StatLabel>
                    <StatNumber>{hashtagData.summary.avgScore}%</StatNumber>
                    <StatHelpText>Quality rating</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Platform</StatLabel>
                    <StatNumber fontSize="lg">{hashtagData.platform}</StatNumber>
                    <StatHelpText>Limit: {hashtagData.summary.platformLimit}</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Niche</StatLabel>
                    <StatNumber fontSize="lg">{hashtagData.niche}</StatNumber>
                    <StatHelpText>Topic relevance</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Hashtag Recommendations */}
            <Card>
              <CardHeader>
                <HStack>
                  <Icon as={Hash} />
                  <Heading size="md">Recommended Hashtags</Heading>
                  <Tooltip label="Higher scores indicate better potential for reach and engagement">
                    <Icon as={Info} color="gray.400" />
                  </Tooltip>
                </HStack>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Hashtag</Th>
                        <Th>Score</Th>
                        <Th>Relevance</Th>
                        <Th>Popularity</Th>
                        <Th>Competition</Th>
                        <Th>Volume</Th>
                        <Th>Reason</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {hashtagData.recommendations.map((rec, index) => (
                        <Tr key={index}>
                          <Td fontWeight="bold" color="blue.600">{rec.hashtag}</Td>
                          <Td>
                            <Badge 
                              colorScheme={
                                rec.overallScore >= 80 ? 'green' :
                                rec.overallScore >= 60 ? 'yellow' : 'orange'
                              }
                            >
                              {rec.overallScore}%
                            </Badge>
                          </Td>
                          <Td>
                            <Progress value={rec.relevance} size="sm" colorScheme="blue" />
                          </Td>
                          <Td>
                            <Progress value={rec.popularity} size="sm" colorScheme="green" />
                          </Td>
                          <Td>
                            <Progress value={rec.competition} size="sm" colorScheme="red" />
                          </Td>
                          <Td fontSize="xs">{rec.volume}</Td>
                          <Td fontSize="xs" maxW="200px">{rec.reason}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Copy-paste section */}
            <Card>
              <CardHeader>
                <Heading size="sm">📋 Copy & Paste</Heading>
              </CardHeader>
              <CardBody>
                <Box p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                  <Text fontSize="sm" fontFamily="mono">
                    {hashtagData.recommendations.slice(0, getCurrentPlatform().limit).map(r => r.hashtag).join(' ')}
                  </Text>
                </Box>
              </CardBody>
            </Card>

            {/* Metadata */}
            <Box fontSize="xs" color="gray.500" textAlign="center" bg="gray.50" p={3} borderRadius="md">
              <Text>
                Hashtag analysis completed at {new Date().toLocaleString()}
              </Text>
              <Text mt={1}>
                Based on trending data and algorithmic relevance scoring
              </Text>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default HashtagOptimizer;
