import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  Button,
  Icon,
  Badge,
  Progress,
  Tooltip,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, RefreshCw } from 'lucide-react';

const AdvancedAnalytics = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [niche, setNiche] = useState('crypto');
  const [analytics, setAnalytics] = useState(null);
  const [trending, setTrending] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasHistoricalData, setHasHistoricalData] = useState(false);
  const toast = useToast();

  const timeframes = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const niches = [
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'ai', label: 'AI & Tech' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' }
  ];

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Check if user has prediction history
      const historyData = localStorage.getItem('predictionHistory');
      const predictions = historyData ? JSON.parse(historyData) : [];

      if (predictions.length === 0) {
        setHasHistoricalData(false);
        setAnalytics(null);
        toast({
          title: 'No Historical Data',
          description: 'Start making predictions to see analytics',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      setHasHistoricalData(true);

      // Load trending topics
      const trendingResponse = await fetch(`/api/trending-topics?niche=${niche}`);
      const trendingData = await trendingResponse.json();

      if (trendingData.success) {
        setTrending(trendingData.trending);
      }

      // Generate analytics from real prediction history
      const analyticsData = generateAnalyticsFromHistory(predictions, timeframe);
      setAnalytics(analyticsData);

      toast({
        title: 'Analytics Updated',
        description: `Loaded ${timeframe} data for ${niche}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Analytics loading error:', error);
      toast({
        title: 'Loading Failed',
        description: 'Unable to load analytics data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeframe, niche]);

  const generateAnalyticsFromHistory = (predictions, timeframe) => {
    const now = new Date();
    const timeframeDays = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000);

    // Filter predictions by timeframe
    const filteredPredictions = predictions.filter(p => {
      const predDate = new Date(p.timestamp);
      return predDate >= cutoffDate;
    });

    if (filteredPredictions.length === 0) {
      return generateEmptyAnalytics(timeframeDays);
    }

    // Generate performance data by grouping predictions by date
    const performanceMap = new Map();
    filteredPredictions.forEach(prediction => {
      const date = new Date(prediction.timestamp).toLocaleDateString();
      if (!performanceMap.has(date)) {
        performanceMap.set(date, {
          date,
          predictions: 0,
          totalScore: 0,
          viralHits: 0
        });
      }

      const dayData = performanceMap.get(date);
      dayData.predictions += 1;
      dayData.totalScore += prediction.viralProbability;
      if (prediction.viralProbability >= 80) dayData.viralHits += 1;
    });

    const performanceData = Array.from(performanceMap.values())
      .map(day => ({
        ...day,
        accuracy: Math.round(day.totalScore / day.predictions)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Generate category distribution from real data
    const categoryMap = new Map();
    filteredPredictions.forEach(prediction => {
      const category = prediction.category || categorizeScore(prediction.viralProbability);
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: getCategoryColor(name)
    }));

    // Generate platform performance from real data
    const platformMap = new Map();
    filteredPredictions.forEach(prediction => {
      const platform = prediction.platform || 'Unknown';
      if (!platformMap.has(platform)) {
        platformMap.set(platform, { predictions: 0, totalScore: 0 });
      }
      const platformData = platformMap.get(platform);
      platformData.predictions += 1;
      platformData.totalScore += prediction.viralProbability;
    });

    const platformData = Array.from(platformMap.entries()).map(([platform, data]) => ({
      platform: formatPlatformName(platform),
      score: Math.round(data.totalScore / data.predictions),
      predictions: data.predictions
    }));

    return {
      summary: {
        totalPredictions: filteredPredictions.length,
        avgAccuracy: Math.round(filteredPredictions.reduce((sum, p) => sum + p.viralProbability, 0) / filteredPredictions.length),
        totalViralHits: filteredPredictions.filter(p => p.viralProbability >= 80).length,
        successRate: Math.round((filteredPredictions.filter(p => p.viralProbability >= 70).length / filteredPredictions.length) * 100)
      },
      performance: performanceData,
      categories: categoryData,
      platforms: platformData,
      timeRange: timeframe,
      dataSource: 'real_predictions'
    };
  };

  const generateEmptyAnalytics = (days) => {
    return {
      summary: {
        totalPredictions: 0,
        avgAccuracy: 0,
        totalViralHits: 0,
        successRate: 0
      },
      performance: [],
      categories: [],
      platforms: [],
      timeRange: `${days} days`,
      dataSource: 'no_data'
    };
  };

  const categorizeScore = (score) => {
    if (score >= 85) return 'Ultra Viral';
    if (score >= 70) return 'High Viral';
    if (score >= 50) return 'Moderate Viral';
    return 'Low Viral';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Ultra Viral': '#22C55E',
      'High Viral': '#3B82F6',
      'Moderate Viral': '#F59E0B',
      'Low Viral': '#EF4444'
    };
    return colors[category] || '#6B7280';
  };

  const formatPlatformName = (platform) => {
    const names = {
      'twitter': 'Twitter/X',
      'x': 'Twitter/X',
      'instagram': 'Instagram',
      'linkedin': 'LinkedIn',
      'tiktok': 'TikTok',
      'youtube': 'YouTube',
      'reddit': 'Reddit'
    };
    return names[platform.toLowerCase()] || platform;
  };

  if (!hasHistoricalData) {
    return (
      <Box maxW="4xl" mx="auto" p={6}>
        <VStack spacing={6}>
          <Box textAlign="center">
            <Heading size="lg" mb={4}>📊 Advanced Analytics</Heading>
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">No prediction history found</Text>
                <Text fontSize="sm">
                  Start using the Viral Prediction tool to generate analytics data.
                  Your prediction history will appear here once you have made some predictions.
                </Text>
              </Box>
            </Alert>
          </Box>

          <Button
            colorScheme="purple"
            onClick={() => window.location.hash = '#viral-prediction'}
            size="lg"
          >
            Start Making Predictions
          </Button>
        </VStack>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box textAlign="center" py={10}>
        <Icon as={Activity} boxSize={8} color="gray.400" mb={4} />
        <Text color="gray.500">Loading analytics...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg">📊 Advanced Analytics</Heading>
            <Text color="gray.600">
              Performance insights based on your prediction history
            </Text>
          </Box>
          <HStack spacing={3}>
            <Select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} w="150px">
              {timeframes.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </Select>
            <Select value={niche} onChange={(e) => setNiche(e.target.value)} w="150px">
              {niches.map(n => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </Select>
            <Button
              leftIcon={<Icon as={RefreshCw} />}
              onClick={loadAnalytics}
              isLoading={loading}
              size="sm"
            >
              Refresh
            </Button>
          </HStack>
        </HStack>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <Heading size="md">Performance Summary</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <Stat textAlign="center">
                <StatLabel>Total Predictions</StatLabel>
                <StatNumber>{analytics.summary.totalPredictions}</StatNumber>
                <StatHelpText>{timeframes.find(tf => tf.value === timeframe)?.label}</StatHelpText>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Average Score</StatLabel>
                <StatNumber>{analytics.summary.avgAccuracy}%</StatNumber>
                <StatHelpText>
                  <Badge colorScheme={analytics.summary.avgAccuracy >= 70 ? 'green' : 'yellow'}>
                    {analytics.summary.avgAccuracy >= 70 ? 'Good' : 'Moderate'}
                  </Badge>
                </StatHelpText>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Viral Hits</StatLabel>
                <StatNumber>{analytics.summary.totalViralHits}</StatNumber>
                <StatHelpText>80%+ Score</StatHelpText>
              </Stat>

              <Stat textAlign="center">
                <StatLabel>Success Rate</StatLabel>
                <StatNumber>{analytics.summary.successRate}%</StatNumber>
                <StatHelpText>70%+ Predictions</StatHelpText>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>

        {analytics.performance.length > 0 && (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <HStack>
                  <Icon as={TrendingUp} />
                  <Heading size="md">Performance Trends</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#3B82F6" strokeWidth={2} name="Accuracy" />
                    <Line type="monotone" dataKey="predictions" stroke="#10B981" strokeWidth={2} name="Predictions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Category Distribution */}
            {analytics.categories.length > 0 && (
              <Card>
                <CardHeader>
                  <HStack>
                    <Icon as={PieChartIcon} />
                    <Heading size="md">Prediction Categories</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            )}
          </SimpleGrid>
        )}

        {/* Platform Performance */}
        {analytics.platforms.length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={BarChart3} />
                <Heading size="md">Platform Performance</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.platforms}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="score" fill="#3B82F6" name="Avg Score" />
                  <Bar dataKey="predictions" fill="#10B981" name="Predictions" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {/* Trending Topics */}
        {trending && (
          <Card>
            <CardHeader>
              <HStack>
                <Icon as={Activity} />
                <Heading size="md">Trending Topics - {niches.find(n => n.value === niche)?.label}</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {trending.map((topic, index) => (
                  <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">{topic.name}</Text>
                      <Badge colorScheme={topic.change >= 0 ? 'green' : 'red'}>
                        {topic.change >= 0 ? '+' : ''}{topic.change.toFixed(1)}%
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      {topic.mentions.toLocaleString()} mentions
                    </Text>
                    <Progress
                      value={topic.sentiment * 100}
                      colorScheme={topic.sentiment > 0.7 ? 'green' : topic.sentiment > 0.4 ? 'yellow' : 'red'}
                      size="sm"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Sentiment: {(topic.sentiment * 100).toFixed(0)}%
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Data Source Info */}
        <Box fontSize="xs" color="gray.500" textAlign="center" bg="gray.50" p={3} borderRadius="md">
          <Text>
            Analytics based on {analytics.summary.totalPredictions} predictions • Data source: {analytics.dataSource === 'real_predictions' ? 'Your prediction history' : 'No data available'}
          </Text>
          <Text mt={1}>
            Last updated: {new Date().toLocaleString()}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default AdvancedAnalytics;
