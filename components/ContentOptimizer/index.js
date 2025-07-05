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
  Textarea,
  Select,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { Edit3, Zap, TrendingUp, CheckCircle } from 'lucide-react';

const ContentOptimizer = () => {
  const [originalContent, setOriginalContent] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [niche, setNiche] = useState('crypto');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedVersions, setOptimizedVersions] = useState(null);
  const toast = useToast();

  const platforms = [
    { value: 'twitter', label: 'X/Twitter', charLimit: 280 },

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

  const handleOptimize = async () => {
    if (!originalContent.trim()) {
      toast({
        title: 'Content Required',
        description: 'Please enter content to optimize',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsOptimizing(true);

    try {
      // Call the actual API for content optimization
      const response = await fetch('/api/optimize-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: originalContent,
          platform,
          niche,
          charLimit: getCurrentPlatform().charLimit
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Optimization failed');
      }

      setOptimizedVersions(data.optimizedVersions);

      toast({
        title: 'Content Optimized!',
        description: `Generated ${data.optimizedVersions.length} optimized versions`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Content optimization error:', error);

      // Fallback to algorithmic optimization if API fails
      const fallbackVersions = generateAlgorithmicOptimizations(originalContent);
      setOptimizedVersions(fallbackVersions);

      toast({
        title: 'Optimization Complete',
        description: 'Using algorithmic optimization (AI temporarily unavailable)',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateAlgorithmicOptimizations = (content) => {
    const charLimit = getCurrentPlatform().charLimit;

    // Algorithmic content enhancement strategies
    const strategies = [
      {
        name: 'Engagement Optimized',
        description: 'Enhanced for maximum engagement',
        transform: (text) => {
          // Add engagement elements based on content analysis
          let optimized = text;

          // Add question if none exists
          if (!text.includes('?')) {
            optimized = optimized + ' What do you think?';
          }

          // Ensure call-to-action
          if (!text.toLowerCase().includes('like') && !text.toLowerCase().includes('share') && !text.toLowerCase().includes('comment')) {
            optimized = optimized + ' 👍 Like if you agree!';
          }

          return optimized.length <= charLimit ? optimized : text;
        }
      },
      {
        name: 'Hashtag Optimized',
        description: 'Optimized hashtag placement and selection',
        transform: (text) => {
          const nicheHashtags = {
            crypto: ['#Bitcoin', '#Crypto', '#DeFi', '#Web3'],
            ai: ['#AI', '#MachineLearning', '#Tech', '#Innovation'],
            tech: ['#Technology', '#Innovation', '#StartUp', '#Tech'],
            business: ['#Business', '#Finance', '#Growth', '#Success'],
            marketing: ['#Marketing', '#Growth', '#DigitalMarketing', '#Content'],
            startup: ['#Startup', '#Entrepreneur', '#Innovation', '#Business']
          };

          const hashtags = nicheHashtags[niche] || nicheHashtags.tech;
          const selectedHashtags = hashtags.slice(0, platform === 'twitter' ? 2 : 5);

          let optimized = text;
          // Only add if no hashtags exist
          if (!text.includes('#')) {
            optimized = text + ' ' + selectedHashtags.join(' ');
          }

          return optimized.length <= charLimit ? optimized : text;
        }
      },
      {
        name: 'Concise Version',
        description: 'Shortened for maximum impact',
        transform: (text) => {
          if (text.length <= charLimit * 0.7) return text;

          // Intelligent text shortening
          const sentences = text.split('.').filter(s => s.trim());
          if (sentences.length > 1) {
            // Keep first sentence and most impactful parts
            const firstSentence = sentences[0].trim() + '.';
            if (firstSentence.length <= charLimit * 0.8) {
              return firstSentence;
            }
          }

          // Fallback: truncate smartly
          const truncated = text.substring(0, charLimit - 3) + '...';
          return truncated;
        }
      },
      {
        name: 'Platform Optimized',
        description: `Tailored specifically for ${getCurrentPlatform().label}`,
        transform: (text) => {
          let optimized = text;

          // Platform-specific optimizations
          if (text.length > 240) {
						optimized = text + ' 🧵 Thread below 👇';
					}

          return optimized.length <= charLimit ? optimized : text;
        }
      }
    ];

    return strategies.map((strategy, index) => ({
      id: index + 1,
      title: strategy.name,
      content: strategy.transform(content),
      description: strategy.description,
      score: calculateContentScore(strategy.transform(content)),
      improvements: generateImprovements(content, strategy.transform(content)),
      charCount: strategy.transform(content).length,
      charLimit: charLimit
    }));
  };

  const calculateContentScore = (content) => {
    let score = 50; // Base score

    // Content analysis factors
    if (content.includes('?')) score += 10; // Engagement question
    if (content.includes('#')) score += 10; // Hashtags
    if (content.includes('!')) score += 5;  // Excitement
    if (content.match(/\d+/)) score += 5;   // Numbers/stats
    if (content.length >= 50 && content.length <= 200) score += 10; // Optimal length

    // Platform-specific bonuses
    const charLimit = getCurrentPlatform().charLimit;
    if (content.length <= charLimit * 0.8) score += 5; // Under char limit

    return Math.min(100, score);
  };

  const generateImprovements = (original, optimized) => {
    const improvements = [];

    if (optimized.includes('?') && !original.includes('?')) {
      improvements.push('Added engagement question');
    }
    if (optimized.includes('#') && !original.includes('#')) {
      improvements.push('Added relevant hashtags');
    }
    if (optimized.length < original.length) {
      improvements.push('Reduced length for better readability');
    }
    if (optimized.includes('👍') || optimized.includes('like')) {
      improvements.push('Added call-to-action');
    }

    return improvements.length > 0 ? improvements : ['Optimized for platform requirements'];
  };

  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}>✨ Content Enhancement Tool</Heading>
          <Text color="gray.600">
            AI-powered content optimization for maximum engagement
          </Text>
        </Box>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <HStack>
              <Icon as={Edit3} />
              <Heading size="md">Original Content</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <Textarea
                placeholder="Enter your content to optimize..."
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                rows={6}
                resize="vertical"
              />

              <HStack width="full" spacing={4}>
                <Select value={platform} onChange={(e) => setPlatform(e.target.value)} flex={1}>
                  {platforms.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.label} ({p.charLimit} chars)
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
                colorScheme="purple"
                onClick={handleOptimize}
                isLoading={isOptimizing}
                loadingText="Optimizing content..."
                leftIcon={<Icon as={Zap} />}
                size="lg"
                width="full"
                isDisabled={!originalContent.trim()}
              >
                Optimize Content
              </Button>

              <Text fontSize="sm" color="gray.600" textAlign="center">
                Character limit: {getCurrentPlatform().charLimit} • Current: {originalContent.length}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Results */}
        {optimizedVersions && (
          <VStack spacing={6} align="stretch">
            {/* Summary */}
            <Card>
              <CardHeader>
                <HStack>
                  <Icon as={TrendingUp} />
                  <Heading size="md">Optimization Results</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Stat textAlign="center">
                    <StatLabel>Versions Generated</StatLabel>
                    <StatNumber>{optimizedVersions.length}</StatNumber>
                    <StatHelpText>Different optimization strategies</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Best Score</StatLabel>
                    <StatNumber>{Math.max(...optimizedVersions.map(v => v.score))}%</StatNumber>
                    <StatHelpText>Engagement potential</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Platform</StatLabel>
                    <StatNumber fontSize="lg">{getCurrentPlatform().label}</StatNumber>
                    <StatHelpText>{getCurrentPlatform().charLimit} char limit</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Optimized Versions */}
            <VStack spacing={4}>
              {optimizedVersions.map((version) => (
                <Card key={version.id} width="full">
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <HStack>
                          <Heading size="sm">{version.title}</Heading>
                          <Badge colorScheme={version.score >= 80 ? 'green' : version.score >= 60 ? 'yellow' : 'orange'}>
                            {version.score}% Score
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {version.charCount}/{version.charLimit} chars
                        </Text>
                      </HStack>

                      <Box p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                        <Text>{version.content}</Text>
                      </Box>

                      <Text fontSize="sm" color="gray.600">
                        {version.description}
                      </Text>

                      {version.improvements.length > 0 && (
                        <Box>
                          <Text fontSize="sm" fontWeight="bold" mb={2}>Improvements:</Text>
                          <VStack align="start" spacing={1}>
                            {version.improvements.map((improvement, idx) => (
                              <HStack key={idx} spacing={2}>
                                <Icon as={CheckCircle} size="sm" color="green.500" />
                                <Text fontSize="sm">{improvement}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>

            {/* Metadata */}
            <Box fontSize="xs" color="gray.500" textAlign="center" bg="gray.50" p={3} borderRadius="md">
              <Text>
                Content optimization completed at {new Date().toLocaleString()}
              </Text>
              <Text mt={1}>
                Using algorithmic optimization strategies for {getCurrentPlatform().label}
              </Text>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default ContentOptimizer;
