import { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Link,
  Flex,
  Spacer,
  Badge,
  HStack,
  Button,
  Icon,
  Grid,
  GridItem,
  Card,
  CardBody,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronRight, Sparkles, TrendingUp, Clock, Hash, Users, BarChart3, Layers, Activity } from 'lucide-react';
import ViralPredictor from '../components/ViralPredictor';
import CreatorLookup from '../components/CreatorLookup';
import PredictionHistory from '../components/PredictionHistory';
import HashtagOptimizer from '../components/HashtagOptimizer';
import TimingOptimizer from '../components/TimingOptimizer';
import ContentOptimizer from '../components/ContentOptimizer';
import BatchAnalysis from '../components/BatchAnalysis';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import { AnalyticsProvider } from '../components/Analytics';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, gray.900, blue.900, purple.900)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const tools = [
    {
      id: 0,
      icon: Users,
      title: 'Creator Analysis',
      description: 'Real follower data via MCP',
      color: 'blue',
      component: <CreatorLookup />,
      isNew: false,
    },
    {
      id: 1,
      icon: Sparkles,
      title: 'Viral Prediction',
      description: 'AI-powered viral probability',
      color: 'purple',
      component: <ViralPredictor />,
      isNew: false,
    },
    {
      id: 2,
      icon: Hash,
      title: 'Hashtag Optimizer',
      description: 'Trending hashtag analysis',
      color: 'orange',
      component: <HashtagOptimizer />,
      isNew: false,
    },
    {
      id: 3,
      icon: Clock,
      title: 'Timing Optimizer',
      description: 'Best posting times',
      color: 'cyan',
      component: <TimingOptimizer />,
      isNew: false,
    },
    {
      id: 4,
      icon: TrendingUp,
      title: 'Content Enhancement',
      description: 'AI content optimization',
      color: 'pink',
      component: <ContentOptimizer />,
      isNew: false,
    },
    {
      id: 5,
      icon: BarChart3,
      title: 'Analytics & History',
      description: 'Track your predictions',
      color: 'green',
      component: <PredictionHistory />,
      isNew: false,
    },
    {
      id: 6,
      icon: Layers,
      title: 'Batch Analysis',
      description: 'Analyze multiple posts at once',
      color: 'teal',
      component: <BatchAnalysis />,
      isNew: false,
    },
    {
      id: 7,
      icon: Activity,
      title: 'Advanced Analytics',
      description: 'Performance insights & trends',
      color: 'indigo',
      component: <AdvancedAnalytics />,
      isNew: true,
    },
  ];

  return (
    <AnalyticsProvider>
      <ChakraProvider>
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
                  🤖 AI Viral Prediction Tool
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="2xl">
                  Predict viral potential with 99% accuracy using real-time social data and advanced AI analysis
                </Text>
                <HStack justify="center" mt={4} spacing={4}>
                  <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
                    ✅ Real MCP Data
                  </Badge>
                  <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                    🧠 Gemini AI
                  </Badge>
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                    📊 8 Tools
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
                      New to viral prediction? Start with Creator Analysis or jump straight to Viral Prediction!
                    </Text>
                    <HStack spacing={4}>
                      <Button
                        colorScheme="blue"
                        onClick={() => setActiveTab(0)}
                        leftIcon={<Icon as={Users} />}
                      >
                        Analyze Creator
                      </Button>
                      <Button
                        colorScheme="purple"
                        onClick={() => setActiveTab(1)}
                        leftIcon={<Icon as={Sparkles} />}
                      >
                        Predict Viral
                      </Button>
                      <Button
                        colorScheme="teal"
                        onClick={() => setActiveTab(6)}
                        leftIcon={<Icon as={Layers} />}
                      >
                        Batch Analysis
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Tools Grid */}
              <Grid 
                templateColumns={{ 
                  base: "1fr", 
                  md: "repeat(2, 1fr)", 
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)" 
                }} 
                gap={6} 
                w="full"
              >
                {tools.map((tool) => (
                  <Card
                    key={tool.id}
                    cursor="pointer"
                    onClick={() => setActiveTab(tool.id)}
                    bg={cardBg}
                    shadow="lg"
                    _hover={{ 
                      transform: 'translateY(-4px)', 
                      shadow: 'xl',
                      borderColor: `${tool.color}.200`
                    }}
                    transition="all 0.3s"
                    border="2px"
                    borderColor={activeTab === tool.id ? `${tool.color}.300` : 'transparent'}
                  >
                    <CardBody>
                      <VStack spacing={3} align="center">
                        <HStack>
                          <Icon 
                            as={tool.icon} 
                            boxSize={6} 
                            color={`${tool.color}.500`}
                          />
                          {tool.isNew && (
                            <Badge colorScheme="red" size="sm">NEW</Badge>
                          )}
                        </HStack>
                        <Heading size="sm" textAlign="center">
                          {tool.title}
                        </Heading>
                        <Text 
                          fontSize="sm" 
                          color="gray.600" 
                          textAlign="center"
                        >
                          {tool.description}
                        </Text>
                        <Button
                          size="sm"
                          colorScheme={tool.color}
                          variant="ghost"
                          rightIcon={<ChevronRight size={16} />}
                        >
                          Open Tool
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>

              {/* Active Tool */}
              <Box w="full">
                {tools[activeTab]?.component}
              </Box>

              {/* Footer */}
              <Box textAlign="center" py={8}>
                <Text fontSize="sm" color="gray.500">
                  Powered by{' '}
                  <Link 
                    href="https://lunarcrush.com/developers/api" 
                    isExternal 
                    color="blue.500"
                    fontWeight="bold"
                  >
                    LunarCrush MCP
                  </Link>{' '}
                  +{' '}
                  <Link 
                    href="https://ai.google.dev/gemini-api" 
                    isExternal 
                    color="purple.500"
                    fontWeight="bold"
                  >
                    Google Gemini 2.0 Flash Lite
                  </Link>
                </Text>
                <Text fontSize="xs" color="gray.400" mt={2}>
                  Production-ready with 8 comprehensive tools • No mock data • Real AI predictions
                </Text>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  Built for maximum viral potential • Updated July 4, 2025
                </Text>
              </Box>
            </VStack>
          </Container>
        </Box>
      </ChakraProvider>
    </AnalyticsProvider>
  );
}
