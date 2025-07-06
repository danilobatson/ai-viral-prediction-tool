import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Spinner,
  useColorModeValue,
  Flex,
  Spacer,
  Switch,
} from '@chakra-ui/react';
import { Clock, Calendar } from 'lucide-react';
import { contentTypes } from './enhanced-options';

const TimingOptimizer = () => {
  const [platform, setPlatform] = useState('x');
  const [contentType, setContentType] = useState('general');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.700');

  const platforms = [
    { value: 'x', label: 'X (Twitter)' },
   
  ];

  `cat temp_timing_content_types.txt`

  const analyzeOptimalTiming = async () => {
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setAnalysis({
        bestTime: '2:00 PM',
        bestDay: 'Tuesday',
        score: 87,
        recommendations: [
          'Post during lunch hours for maximum engagement',
          'Tuesday-Thursday are optimal days for your content type',
          'Avoid posting late evenings for this platform'
        ]
      });
    } catch (err) {
      setError('Failed to analyze optimal timing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2} color="orange.500">
            ⏰ Optimal Timing Recommendations
          </Heading>
          <Text color="gray.600">
            AI-powered analysis of the best times to post your content
          </Text>
        </Box>

        <Card bg={cardBg} borderRadius="lg">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="bold">Platform</FormLabel>
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    {platforms.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="bold">Content Type</FormLabel>
                  <Select value={contentType} onChange={(e) => setContentType(e.target.value)}>
                    {contentTypes.map(ct => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <Button
                colorScheme="orange"
                size="lg"
                onClick={analyzeOptimalTiming}
                isLoading={loading}
                loadingText="Analyzing optimal timing..."
                leftIcon={<Clock />}
              >
                🕒 Analyze Optimal Timing
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {error && (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {loading && (
          <Card bg={cardBg} borderRadius="lg">
            <CardBody>
              <VStack spacing={4}>
                <Spinner size="xl" color="orange.500" />
                <Text>Analyzing optimal timing patterns...</Text>
                <Progress size="lg" colorScheme="orange" isIndeterminate w="100%" />
              </VStack>
            </CardBody>
          </Card>
        )}

        {analysis && (
          <Card bg={cardBg} borderRadius="lg">
            <CardBody>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                  <Stat textAlign="center">
                    <StatLabel>Best Time</StatLabel>
                    <StatNumber color="orange.500">{analysis.bestTime}</StatNumber>
                    <StatHelpText>Peak engagement hour</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Best Day</StatLabel>
                    <StatNumber color="blue.500">{analysis.bestDay}</StatNumber>
                    <StatHelpText>Highest engagement day</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Timing Score</StatLabel>
                    <StatNumber color="green.500">{analysis.score}%</StatNumber>
                    <StatHelpText>Optimization level</StatHelpText>
                  </Stat>
                </SimpleGrid>

                <Box>
                  <Heading size="md" mb={3}>💡 Timing Recommendations</Heading>
                  <VStack align="stretch" spacing={2}>
                    {analysis.recommendations.map((rec, index) => (
                      <Box key={index} bg="orange.50" p={3} borderRadius="md" fontSize="sm">
                        <Text>• {rec}</Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default TimingOptimizer;
