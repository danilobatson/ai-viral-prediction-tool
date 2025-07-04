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
  Progress,
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
  Divider,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { 
  Upload, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Zap
} from 'lucide-react';

const BatchAnalysis = () => {
  const [posts, setPosts] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [niche, setNiche] = useState('crypto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentPost, setCurrentPost] = useState(0);
  const toast = useToast();

  const platforms = [
    { value: 'twitter', label: 'X/Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const niches = [
    { value: 'crypto', label: 'Cryptocurrency & DeFi' },
    { value: 'ai', label: 'AI & Machine Learning' },
    { value: 'tech', label: 'Technology' },
    { value: 'business', label: 'Business & Finance' },
    { value: 'marketing', label: 'Marketing & Growth' },
    { value: 'startup', label: 'Startups & Innovation' },
  ];

  const handleAnalyze = async () => {
    if (!posts.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter posts to analyze',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setCurrentPost(0);

    const postList = posts.split('\n').filter(post => post.trim());
    const analysisResults = [];

    try {
      for (let i = 0; i < postList.length; i++) {
        setCurrentPost(i + 1);
        setProgress(((i + 1) / postList.length) * 100);

        // Simulate API call - replace with actual batch API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockResult = {
          id: i + 1,
          content: postList[i].substring(0, 100) + '...',
          viralProbability: Math.floor(Math.random() * 100),
          expectedEngagement: Math.floor(Math.random() * 10000),
          category: ['Low', 'Moderate', 'High', 'Ultra'][Math.floor(Math.random() * 4)] + ' Viral',
          keyFactors: ['Trending topic', 'Optimal timing', 'Strong emotion'][Math.floor(Math.random() * 3)],
          confidence: Math.floor(Math.random() * 40) + 60,
        };

        analysisResults.push(mockResult);
      }

      setResults({
        posts: analysisResults,
        summary: {
          totalPosts: postList.length,
          avgViralProbability: Math.floor(analysisResults.reduce((sum, r) => sum + r.viralProbability, 0) / postList.length),
          highViralCount: analysisResults.filter(r => r.viralProbability >= 70).length,
          recommendedPosts: analysisResults.filter(r => r.viralProbability >= 80).slice(0, 3),
        }
      });

      toast({
        title: 'Analysis Complete!',
        description: `Successfully analyzed ${postList.length} posts`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const csvContent = [
      ['Post ID', 'Content Preview', 'Viral Probability', 'Expected Engagement', 'Category', 'Key Factor', 'Confidence'],
      ...results.posts.map(post => [
        post.id,
        `"${post.content.replace(/"/g, '""')}"`,
        post.viralProbability,
        post.expectedEngagement,
        post.category,
        post.keyFactors,
        post.confidence
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `viral-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Export Successful',
      description: 'Results exported to CSV file',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="lg" mb={2}>📊 Batch Analysis Tool</Heading>
          <Text color="gray.600">
            Analyze multiple posts simultaneously for viral potential
          </Text>
        </Box>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <HStack>
              <Icon as={Upload} />
              <Heading size="md">Input Posts</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <Textarea
                placeholder="Enter multiple posts (one per line)..."
                value={posts}
                onChange={(e) => setPosts(e.target.value)}
                rows={8}
                resize="vertical"
              />
              
              <HStack width="full" spacing={4}>
                <Select value={platform} onChange={(e) => setPlatform(e.target.value)} flex={1}>
                  {platforms.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
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
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                loadingText={`Analyzing post ${currentPost}...`}
                leftIcon={<Icon as={BarChart3} />}
                size="lg"
                width="full"
              >
                Analyze All Posts
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Progress */}
        {isAnalyzing && (
          <Card>
            <CardBody>
              <VStack spacing={3}>
                <Text fontWeight="bold">Analysis in Progress...</Text>
                <Progress value={progress} width="full" colorScheme="purple" />
                <Text fontSize="sm" color="gray.600">
                  Processing post {currentPost} - {Math.round(progress)}% complete
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Results */}
        {results && (
          <VStack spacing={6} align="stretch">
            {/* Summary */}
            <Card>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={TrendingUp} />
                    <Heading size="md">Analysis Summary</Heading>
                  </HStack>
                  <Button
                    leftIcon={<Icon as={Download} />}
                    onClick={exportResults}
                    size="sm"
                    variant="outline"
                  >
                    Export CSV
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Stat textAlign="center">
                    <StatLabel>Total Posts</StatLabel>
                    <StatNumber>{results.summary.totalPosts}</StatNumber>
                    <StatHelpText>Analyzed</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Avg Viral Score</StatLabel>
                    <StatNumber>{results.summary.avgViralProbability}%</StatNumber>
                    <StatHelpText>Overall Performance</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>High Viral Potential</StatLabel>
                    <StatNumber>{results.summary.highViralCount}</StatNumber>
                    <StatHelpText>70%+ Score</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Platform</StatLabel>
                    <StatNumber fontSize="lg">{platforms.find(p => p.value === platform)?.label}</StatNumber>
                    <StatHelpText>{niches.find(n => n.value === niche)?.label}</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Top Recommendations */}
            {results.summary.recommendedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <HStack>
                    <Icon as={Zap} />
                    <Heading size="md">Top Recommendations</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3}>
                    {results.summary.recommendedPosts.map((post, index) => (
                      <Alert key={post.id} status="success" borderRadius="md">
                        <AlertIcon />
                        <Box flex="1">
                          <AlertTitle>Post #{post.id} - {post.viralProbability}% Viral Score</AlertTitle>
                          <AlertDescription fontSize="sm">
                            {post.content}
                          </AlertDescription>
                        </Box>
                        <Badge colorScheme="green">{post.category}</Badge>
                      </Alert>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <HStack>
                  <Icon as={FileText} />
                  <Heading size="md">Detailed Results</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Post</Th>
                        <Th>Content Preview</Th>
                        <Th isNumeric>Viral Score</Th>
                        <Th isNumeric>Expected Engagement</Th>
                        <Th>Category</Th>
                        <Th>Key Factor</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {results.posts.map((post) => (
                        <Tr key={post.id}>
                          <Td fontWeight="bold">#{post.id}</Td>
                          <Td maxW="200px" overflow="hidden" textOverflow="ellipsis">
                            {post.content}
                          </Td>
                          <Td isNumeric>
                            <Badge 
                              colorScheme={
                                post.viralProbability >= 80 ? 'green' :
                                post.viralProbability >= 60 ? 'yellow' :
                                post.viralProbability >= 40 ? 'orange' : 'red'
                              }
                            >
                              {post.viralProbability}%
                            </Badge>
                          </Td>
                          <Td isNumeric>{post.expectedEngagement.toLocaleString()}</Td>
                          <Td>
                            <Badge size="sm" variant="outline">
                              {post.category}
                            </Badge>
                          </Td>
                          <Td fontSize="sm" color="gray.600">{post.keyFactors}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Analysis Metadata */}
            <Box fontSize="xs" color="gray.500" textAlign="center" bg="gray.50" p={3} borderRadius="md">
              <Text>
                Batch analysis completed at {new Date().toLocaleString()}
              </Text>
              <Text mt={1}>
                Powered by Google Gemini 2.0 Flash Lite + LunarCrush MCP Protocol
              </Text>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default BatchAnalysis;
