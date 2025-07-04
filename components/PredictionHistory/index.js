import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Icon,
  Spacer,
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Target, Clock, Download } from 'lucide-react';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalPredictions: 0,
    accuracy: 0,
    avgConfidence: 0,
    successfulPredictions: 0,
    topPerformingContent: '',
    weeklyTrend: []
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Calculate analytics from prediction history
  const calculateAnalytics = useCallback((predictionData) => {
    const total = predictionData.length;
    if (total === 0) {
      setAnalytics({
        totalPredictions: 0,
        accuracy: 0,
        avgConfidence: 0,
        successfulPredictions: 0,
        topPerformingContent: 'No data yet',
        weeklyTrend: []
      });
      return;
    }

    // Calculate accuracy (predictions with confidence > 70% that came true)
    const highConfidencePredictions = predictionData.filter(p => p.confidence >= 70);
    const successfulPredictions = highConfidencePredictions.filter(p => p.actualSuccess === true);
    const accuracy = highConfidencePredictions.length > 0 ? 
      (successfulPredictions.length / highConfidencePredictions.length) * 100 : 0;

    // Calculate average confidence
    const avgConfidence = predictionData.reduce((sum, p) => sum + p.confidence, 0) / total;

    // Find top performing content type
    const contentTypes = {};
    predictionData.forEach(p => {
      contentTypes[p.contentType] = (contentTypes[p.contentType] || 0) + 1;
    });
    const topPerformingContent = Object.keys(contentTypes).reduce((a, b) => 
      contentTypes[a] > contentTypes[b] ? a : b, 'Text'
    );

    // Generate weekly trend data
    const weeklyTrend = generateWeeklyTrend(predictionData);

    setAnalytics({
      totalPredictions: total,
      accuracy: Math.round(accuracy),
      avgConfidence: Math.round(avgConfidence),
      successfulPredictions: successfulPredictions.length,
      topPerformingContent,
      weeklyTrend
    });
  }, []);

  // Load predictions from localStorage on component mount
  useEffect(() => {
    const storedPredictions = localStorage.getItem('viral-predictions');
    if (storedPredictions) {
      const parsedPredictions = JSON.parse(storedPredictions);
      setPredictions(parsedPredictions);
      calculateAnalytics(parsedPredictions);
    }
  }, [calculateAnalytics]);

  // Save predictions to localStorage whenever predictions change
  const savePredictions = useCallback((newPredictions) => {
    localStorage.setItem('viral-predictions', JSON.stringify(newPredictions));
    setPredictions(newPredictions);
    calculateAnalytics(newPredictions);
  }, [calculateAnalytics]);

  // Generate weekly trend data for charts
  const generateWeeklyTrend = (predictionData) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayPredictions = predictionData.filter(p => {
        const predictionDate = new Date(p.timestamp);
        return predictionDate.toDateString() === date.toDateString();
      });
      
      last7Days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        predictions: dayPredictions.length,
        avgConfidence: dayPredictions.length > 0 ? 
          Math.round(dayPredictions.reduce((sum, p) => sum + p.confidence, 0) / dayPredictions.length) : 0
      });
    }
    return last7Days;
  };

  // Add a new prediction to history
  const addPrediction = useCallback((predictionData) => {
    const newPrediction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...predictionData
    };
    const updatedPredictions = [newPrediction, ...predictions].slice(0, 100); // Keep last 100
    savePredictions(updatedPredictions);
  }, [predictions, savePredictions]);

  // Mark prediction outcome (for accuracy tracking)
  const markPredictionOutcome = (predictionId, success) => {
    const updatedPredictions = predictions.map(p => 
      p.id === predictionId ? { ...p, actualSuccess: success } : p
    );
    savePredictions(updatedPredictions);
  };

  // Export predictions as CSV
  const exportPredictions = () => {
    const csvContent = [
      ['Timestamp', 'Content', 'Confidence', 'Platform', 'Content Type', 'Actual Success'],
      ...predictions.map(p => [
        new Date(p.timestamp).toLocaleDateString(),
        p.content?.substring(0, 50) + '...',
        p.confidence,
        p.platform,
        p.contentType,
        p.actualSuccess || 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Clear all prediction history
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all prediction history?')) {
      localStorage.removeItem('viral-predictions');
      setPredictions([]);
      setAnalytics({
        totalPredictions: 0,
        accuracy: 0,
        avgConfidence: 0,
        successfulPredictions: 0,
        topPerformingContent: 'No data yet',
        weeklyTrend: []
      });
    }
  };

  // Expose addPrediction function globally for other components
  useEffect(() => {
    window.addPredictionToHistory = addPrediction;
    return () => {
      delete window.addPredictionToHistory;
    };
  }, [addPrediction]);

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
      <Flex mb={6}>
        <Heading size="lg" color="blue.500">
          Prediction Analytics
        </Heading>
        <Spacer />
        <HStack>
          <Button
            size="sm"
            leftIcon={<Icon as={Download} />}
            onClick={exportPredictions}
            isDisabled={predictions.length === 0}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={clearHistory}
            isDisabled={predictions.length === 0}
          >
            Clear History
          </Button>
        </HStack>
      </Flex>

      <Tabs>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>History ({predictions.length})</Tab>
          <Tab>Trends</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Key Metrics */}
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>Total Predictions</StatLabel>
                      <StatNumber>{analytics.totalPredictions}</StatNumber>
                      <StatHelpText>
                        <Icon as={Target} /> All time
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>Accuracy Rate</StatLabel>
                      <StatNumber>{analytics.accuracy}%</StatNumber>
                      <StatHelpText>
                        <StatArrow type={analytics.accuracy >= 70 ? 'increase' : 'decrease'} />
                        High confidence predictions
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>Avg Confidence</StatLabel>
                      <StatNumber>{analytics.avgConfidence}%</StatNumber>
                      <StatHelpText>
                        <Icon as={TrendingUp} /> Prediction strength
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stat>
                      <StatLabel>Successful Predictions</StatLabel>
                      <StatNumber>{analytics.successfulPredictions}</StatNumber>
                      <StatHelpText>
                        Top content type: {analytics.topPerformingContent}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Weekly Activity Chart */}
              {analytics.weeklyTrend.length > 0 && (
                <Card>
                  <CardHeader>
                    <Heading size="md">Weekly Activity</Heading>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="predictions" fill="#3182ce" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </TabPanel>

          {/* History Tab */}
          <TabPanel>
            {predictions.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500" fontSize="lg">
                  No predictions yet. Start analyzing content to build your history!
                </Text>
              </Box>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Content Preview</Th>
                      <Th>Platform</Th>
                      <Th>Confidence</Th>
                      <Th>Type</Th>
                      <Th>Outcome</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {predictions.map((prediction) => (
                      <Tr key={prediction.id}>
                        <Td>
                          <Text fontSize="sm">
                            {new Date(prediction.timestamp).toLocaleDateString()}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(prediction.timestamp).toLocaleTimeString()}
                          </Text>
                        </Td>
                        <Td maxW="200px">
                          <Text noOfLines={2} fontSize="sm">
                            {prediction.content || 'N/A'}
                          </Text>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue">{prediction.platform}</Badge>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" color={
                              prediction.confidence >= 80 ? 'green.500' :
                              prediction.confidence >= 60 ? 'orange.500' : 'red.500'
                            }>
                              {prediction.confidence}%
                            </Text>
                            <Progress 
                              value={prediction.confidence} 
                              size="sm" 
                              w="60px"
                              colorScheme={
                                prediction.confidence >= 80 ? 'green' :
                                prediction.confidence >= 60 ? 'orange' : 'red'
                              }
                            />
                          </VStack>
                        </Td>
                        <Td>
                          <Badge variant="outline">{prediction.contentType}</Badge>
                        </Td>
                        <Td>
                          {prediction.actualSuccess === true && (
                            <Badge colorScheme="green">Success</Badge>
                          )}
                          {prediction.actualSuccess === false && (
                            <Badge colorScheme="red">Failed</Badge>
                          )}
                          {prediction.actualSuccess === undefined && (
                            <Badge colorScheme="gray">Pending</Badge>
                          )}
                        </Td>
                        <Td>
                          {prediction.actualSuccess === undefined && (
                            <HStack>
                              <Button
                                size="xs"
                                colorScheme="green"
                                onClick={() => markPredictionOutcome(prediction.id, true)}
                              >
                                ✓
                              </Button>
                              <Button
                                size="xs"
                                colorScheme="red"
                                onClick={() => markPredictionOutcome(prediction.id, false)}
                              >
                                ✗
                              </Button>
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Trends Tab */}
          <TabPanel>
            {analytics.weeklyTrend.length > 0 ? (
              <SimpleGrid columns={1} spacing={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md">Confidence Trends (7 Days)</Heading>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="avgConfidence" 
                          stroke="#3182ce" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">Daily Prediction Volume</Heading>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="predictions" fill="#38a169" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={8}>
                <Text color="gray.500" fontSize="lg">
                  Build prediction history to see trends and analytics!
                </Text>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PredictionHistory;
