import { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  Badge,
  Icon,
  Button,
} from '@chakra-ui/react';
import {
  Sparkles,
  Users,
  Hash,
  Clock,
  TrendingUp,
  BarChart3,
  Layers,
  Activity,
} from 'lucide-react';

// Import components
import ViralPredictor from '../components/ViralPredictor';
import CreatorLookup from '../components/CreatorLookup';
import HashtagOptimizer from '../components/HashtagOptimizer';
import TimingOptimizer from '../components/TimingOptimizer';
import ContentOptimizer from '../components/ContentOptimizer';
import PredictionHistory from '../components/PredictionHistory';
import BatchAnalysis from '../components/BatchAnalysis';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import { AnalyticsProvider } from '../components/Analytics';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null);

  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, purple.900, blue.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.700');

  const tools = [
    {
      id: 1,
      icon: Sparkles,
      title: 'Twitter Viral Probability',
      description: 'AI-powered viral likelihood estimation',
      color: 'purple',
      component: <ViralPredictor />,
      isNew: false,
    },
    {
      id: 2,
      icon: Users,
      title: 'Twitter Creator Analysis',
      description: 'Real-time follower data and influence metrics',
      color: 'blue',
      component: <CreatorLookup />,
      isNew: false,
    },
    {
      id: 3,
      icon: Hash,
      title: 'Hashtag Optimizer',
      description: 'Trending hashtag analysis',
      color: 'orange',
      component: <HashtagOptimizer />,
      isNew: false,
    },
    {
      id: 4,
      icon: Clock,
      title: 'Timing Optimizer',
      description: 'Best posting times',
      color: 'cyan',
      component: <TimingOptimizer />,
      isNew: false,
    },
    {
      id: 5,
      icon: TrendingUp,
      title: 'Content Enhancement',
      description: 'AI content optimization',
      color: 'pink',
      component: <ContentOptimizer />,
      isNew: false,
    },
    {
      id: 6,
      icon: BarChart3,
      title: 'Analytics & History',
      description: 'Track your predictions',
      color: 'green',
      component: <PredictionHistory />,
      isNew: false,
    },
    {
      id: 7,
      icon: Layers,
      title: 'Twitter Batch Analysis',
      description: 'Analyze multiple tweets at once',
      color: 'teal',
      component: <BatchAnalysis />,
      isNew: false,
    },
    {
      id: 8,
      icon: Activity,
      title: 'Advanced Analytics',
      description: 'Performance insights & trends',
      color: 'indigo',
      component: <AdvancedAnalytics />,
      isNew: true,
    },
  ];

  if (selectedTool) {
    return (
      <AnalyticsProvider>
        <Box minH="100vh" bg={bgGradient}>
          <Container maxW="7xl" py={8}>
            <VStack spacing={8}>
              <HStack w="full" justify="space-between">
                <Button
                  onClick={() => setSelectedTool(null)}
                  variant="outline"
                  size="sm"
                >
                  ← Back to Tools
                </Button>
                <Badge colorScheme="blue">🐦 Twitter/X Optimized</Badge>
              </HStack>
              {selectedTool.component}
            </VStack>
          </Container>
        </Box>
      </AnalyticsProvider>
    );
  }

  return (
    <AnalyticsProvider>
      <Box minH="100vh" bg={bgGradient}>
        <Container maxW="7xl" py={8}>
          <VStack spacing={8}>
            {/* Header */}
            <Box textAlign="center">
              <Heading
                size="2xl"
                bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
                bgClip="text"
                mb={4}
              >
                🤖 AI Twitter Viral Analyzer
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Analyze viral probability patterns on Twitter using real-time LunarCrush social data and advanced AI to optimize your content strategy
              </Text>
              <HStack justify="center" mt={4} spacing={4}>
                <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                  ✅ Real MCP Data
                </Badge>
                <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                  🧠 Gemini AI
                </Badge>
                <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                  🐦 Twitter Optimized
                </Badge>
                <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
                  🚀 Production Ready
                </Badge>
              </HStack>
            </Box>

            {/* Start Here Section */}
            <Card w="full" bg={cardBg} shadow="lg">
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md" color="purple.500">🚀 Start Here</Heading>
                  <Text textAlign="center" color="gray.600">
                    New to Twitter viral analysis? Start with Creator Analysis or jump straight to Viral Probability Analysis!
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    All tools are optimized for Twitter/X using real-time crypto social data from LunarCrush MCP
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Tools Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
              {tools.map((tool) => (
                <Card
                  key={tool.id}
                  bg={cardBg}
                  borderRadius="lg"
                  shadow="md"
                  transition="all 0.2s"
                  _hover={{
                    shadow: "xl",
                    transform: "translateY(-4px)",
                    borderColor: `${tool.color}.200`,
                  }}
                  cursor="pointer"
                  onClick={() => setSelectedTool(tool)}
                  position="relative"
                >
                  {tool.isNew && (
                    <Badge
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      colorScheme="red"
                      variant="solid"
                      fontSize="xs"
                    >
                      NEW
                    </Badge>
                  )}
                  <CardBody textAlign="center">
                    <VStack spacing={4}>
                      <Box
                        p={4}
                        borderRadius="full"
                        bg={`${tool.color}.100`}
                        color={`${tool.color}.500`}
                      >
                        <Icon as={tool.icon} size={24} />
                      </Box>
                      <VStack spacing={2}>
                        <Heading size="sm" color={`${tool.color}.600`}>
                          {tool.title}
                        </Heading>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {tool.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {/* Platform Focus */}
            <Card w="full" bg={cardBg} shadow="lg">
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md" color="blue.500">🐦 Twitter/X Platform Focus</Heading>
                  <Text textAlign="center" color="gray.600">
                    All tools are specifically optimized for Twitter/X where crypto content goes viral most frequently.
                    Powered by LunarCrush MCP for real-time social data and Google Gemini AI for advanced analysis.
                  </Text>
                  <HStack spacing={6} justify="center">
                    <VStack>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.500">95%</Text>
                      <Text fontSize="sm" color="gray.600">Crypto viral content on Twitter</Text>
                    </VStack>
                    <VStack>
                      <Text fontSize="2xl" fontWeight="bold" color="green.500">221M+</Text>
                      <Text fontSize="sm" color="gray.600">Follower accounts trackable</Text>
                    </VStack>
                    <VStack>
                      <Text fontSize="2xl" fontWeight="bold" color="purple.500">Real-time</Text>
                      <Text fontSize="sm" color="gray.600">MCP social data</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Footer */}
            <Box textAlign="center" pt={8}>
              <Text fontSize="sm" color="gray.500">
                Built with ❤️ using LunarCrush MCP • Google Gemini AI • Next.js • Chakra UI
              </Text>
              <Text fontSize="xs" color="gray.400" mt={2}>
                Optimized for crypto Twitter analysis and viral content strategy
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </AnalyticsProvider>
  );
}
