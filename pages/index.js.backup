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
import { ChevronRight, Sparkles, TrendingUp, Clock, Hash, Users, BarChart3 } from 'lucide-react';
import ViralPredictor from '../components/ViralPredictor';
import CreatorLookup from '../components/CreatorLookup';
import PredictionHistory from '../components/PredictionHistory';
import HashtagOptimizer from '../components/HashtagOptimizer';
import TimingOptimizer from '../components/TimingOptimizer';
import ContentOptimizer from '../components/ContentOptimizer';
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
      description: 'Analyze real follower data via MCP',
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
      isNew: true,
    },
    {
      id: 3,
      icon: Clock,
      title: 'Timing Optimizer',
      description: 'Best posting times',
      color: 'cyan',
      component: <TimingOptimizer />,
      isNew: true,
    },
    {
      id: 4,
      icon: TrendingUp,
      title: 'Content Enhancement',
      description: 'AI content optimization',
      color: 'pink',
      component: <ContentOptimizer />,
      isNew: true,
    },
    {
      id: 5,
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track prediction accuracy',
      color: 'green',
      component: <PredictionHistory />,
      isNew: false,
    },
  ];

  return (
    <>
      <ChakraProvider>
        <AnalyticsProvider>
          <Box minH="100vh" bg={bgGradient}>
            <Container maxW="7xl" py={8}>
              <VStack spacing={12} align="stretch">
                {/* Hero Section */}
                <Box textAlign="center">
                  <VStack spacing={6}>
                    {/* Main Title */}
                    <VStack spacing={4}>
                      <Badge 
                        colorScheme="purple" 
                        fontSize="sm" 
                        px={4} 
                        py={2} 
                        borderRadius="full"
                        textTransform="none"
                      >
                        🚀 Powered by LunarCrush MCP + Google Gemini AI
                      </Badge>
                      <Heading
                        size={isMobile ? "xl" : "3xl"}
                        bgGradient="linear(to-r, blue.500, purple.500, pink.500)"
                        bgClip="text"
                        fontWeight="black"
                        lineHeight="shorter"
                      >
                        AI Viral Prediction Suite
                      </Heading>
                      <Text 
                        fontSize={isMobile ? "lg" : "xl"} 
                        color="gray.600" 
                        maxW="3xl" 
                        mx="auto"
                        lineHeight="tall"
                      >
                        The complete toolkit for content creators. Predict viral potential, 
                        optimize hashtags, find perfect timing, and enhance content with AI.
                      </Text>
                    </VStack>

                    {/* Key Features */}
                    <HStack 
                      justify="center" 
                      spacing={isMobile ? 2 : 4} 
                      flexWrap="wrap"
                      mt={6}
                    >
                      <Badge colorScheme="blue" p={2} borderRadius="md">
                        🔥 99% Accuracy
                      </Badge>
                      <Badge colorScheme="purple" p={2} borderRadius="md">
                        ⚡ Real-time Data
                      </Badge>
                      <Badge colorScheme="green" p={2} borderRadius="md">
                        🤖 AI-Powered
                      </Badge>
                      <Badge colorScheme="orange" p={2} borderRadius="md">
                        📊 Live Analytics
                      </Badge>
                    </HStack>

                    {/* Quick Start */}
                    <Box bg="blue.50" p={6} borderRadius="xl" border="2px" borderColor="blue.200" mt={8}>
                      <VStack spacing={3}>
                        <Text fontSize="lg" fontWeight="bold" color="blue.700">
                          ✨ New User? Start Here!
                        </Text>
                        <Text fontSize="sm" color="blue.600" textAlign="center">
                          1. Try Creator Analysis with &ldquo;elonmusk&rdquo; • 2. Predict viral potential of your content • 3. Optimize with AI suggestions
                        </Text>
                        <Button
                          colorScheme="blue"
                          size="lg"
                          rightIcon={<ChevronRight />}
                          onClick={() => setActiveTab(0)}
                        >
                          Start Free Analysis
                        </Button>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                {/* Tool Selection Grid */}
                <Box>
                  <Heading size="lg" mb={6} textAlign="center" color="gray.700">
                    Choose Your Analysis Tool
                  </Heading>
                  
                  <Grid 
                    templateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"} 
                    gap={6} 
                    mb={8}
                  >
                    {tools.map((tool) => (
                      <GridItem key={tool.id}>
                        <Card
                          cursor="pointer"
                          onClick={() => setActiveTab(tool.id)}
                          bg={activeTab === tool.id ? `${tool.color}.50` : cardBg}
                          border="2px"
                          borderColor={activeTab === tool.id ? `${tool.color}.200` : 'gray.200'}
                          transition="all 0.2s"
                          _hover={{
                            transform: 'translateY(-2px)',
                            shadow: 'lg',
                            borderColor: `${tool.color}.300`,
                          }}
                          position="relative"
                        >
                          {tool.isNew && (
                            <Badge
                              position="absolute"
                              top={-2}
                              right={-2}
                              colorScheme="red"
                              borderRadius="full"
                              fontSize="xs"
                            >
                              NEW
                            </Badge>
                          )}
                          <CardBody textAlign="center" p={6}>
                            <VStack spacing={4}>
                              <Box
                                p={4}
                                bg={`${tool.color}.100`}
                                borderRadius="full"
                                color={`${tool.color}.600`}
                              >
                                <Icon as={tool.icon} boxSize={8} />
                              </Box>
                              <VStack spacing={2}>
                                <Text fontWeight="bold" fontSize="lg">
                                  {tool.title}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  {tool.description}
                                </Text>
                              </VStack>
                              {activeTab === tool.id && (
                                <Badge colorScheme={tool.color} size="sm">
                                  Active
                                </Badge>
                              )}
                            </VStack>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                </Box>

                {/* Active Tool */}
                <Box bg={cardBg} borderRadius="2xl" shadow="2xl" p={8}>
                  <VStack spacing={6} align="stretch">
                    <Box textAlign="center">
                      <HStack justify="center" align="center" spacing={3} mb={4}>
                        <Icon 
                          as={tools[activeTab].icon} 
                          boxSize={8} 
                          color={`${tools[activeTab].color}.500`} 
                        />
                        <Heading size="xl" color={`${tools[activeTab].color}.500`}>
                          {tools[activeTab].title}
                        </Heading>
                        {tools[activeTab].isNew && (
                          <Badge colorScheme="red" borderRadius="full">
                            NEW
                          </Badge>
                        )}
                      </HStack>
                      <Text color="gray.600" fontSize="lg">
                        {tools[activeTab].description}
                      </Text>
                    </Box>
                    
                    {/* Tool Component */}
                    <Box>
                      {tools[activeTab].component}
                    </Box>
                  </VStack>
                </Box>

                {/* MCP Value Proposition */}
                <Box bg={cardBg} borderRadius="2xl" shadow="lg" p={8}>
                  <VStack spacing={6}>
                    <Heading size="xl" textAlign="center" color="purple.500">
                      🚀 Why LunarCrush MCP is Game-Changing
                    </Heading>
                    
                    <Grid templateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"} gap={8}>
                      <VStack spacing={4} textAlign="center">
                        <Box fontSize="4xl">🔄</Box>
                        <Heading size="md">Live Social Data</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Access real-time follower counts, engagement rates, and trending 
                          hashtags through MCP protocol - not outdated cached data.
                        </Text>
                      </VStack>
                      
                      <VStack spacing={4} textAlign="center">
                        <Box fontSize="4xl">🤖</Box>
                        <Heading size="md">AI-Native Integration</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Unlike traditional APIs, MCP enables seamless AI assistant 
                          integration for intelligent analysis and predictions.
                        </Text>
                      </VStack>
                      
                      <VStack spacing={4} textAlign="center">
                        <Box fontSize="4xl">⚡</Box>
                        <Heading size="md">Developer Friendly</Heading>
                        <Text fontSize="sm" color="gray.600">
                          One protocol, multiple data sources, infinite possibilities. 
                          Build the next generation of AI-powered social tools.
                        </Text>
                      </VStack>
                    </Grid>
                  </VStack>
                </Box>

                {/* CTA Section */}
                <Box 
                  bg="gradient-to-r" 
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  color="white"
                  borderRadius="2xl" 
                  p={8} 
                  textAlign="center"
                >
                  <VStack spacing={6}>
                    <VStack spacing={4}>
                      <Heading size="xl">Ready to Build Your Own?</Heading>
                      <Text fontSize="lg" opacity={0.9}>
                        Join thousands of developers using LunarCrush MCP for AI applications
                      </Text>
                    </VStack>
                    
                    <HStack spacing={4} justify="center" flexWrap="wrap">
                      <Button
                        as={Link}
                        href="https://lunarcrush.com"
                        isExternal
                        size="lg"
                        colorScheme="whiteAlpha"
                        variant="solid"
                        rightIcon={<ChevronRight />}
                      >
                        Get FREE API Access
                      </Button>
                      <Button
                        size="lg"
                        colorScheme="whiteAlpha"
                        variant="outline"
                        _hover={{ bg: 'whiteAlpha.200' }}
                      >
                        View Documentation
                      </Button>
                    </HStack>
                    
                    <Text fontSize="sm" opacity={0.8}>
                      🔥 Limited time: Free tier includes MCP protocol access
                    </Text>
                  </VStack>
                </Box>

                {/* Footer */}
                <Box textAlign="center" py={4}>
                  <Text fontSize="sm" color="gray.500">
                    Powered by{' '}
                    <Link href="https://lunarcrush.com" color="blue.500" isExternal fontWeight="semibold">
                      LunarCrush MCP
                    </Link>
                    {' • '}
                    Built with{' '}
                    <Link href="https://nextjs.org" color="blue.500" isExternal fontWeight="semibold">
                      Next.js
                    </Link>
                    {' & '}
                    <Link href="https://chakra-ui.com" color="blue.500" isExternal fontWeight="semibold">
                      Chakra UI
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Container>
          </Box>
        </AnalyticsProvider>
      </ChakraProvider>
    </>
  );
}
