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
  Activity,
} from 'lucide-react';

// Import only the 2 core components we're keeping
import ViralPredictor from '../components/ViralPredictor';
import CreatorLookup from '../components/CreatorLookup';

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
      title: 'Twitter Viral Probability Analyzer',
      description: 'AI-powered viral prediction with content optimization, timing analysis, and hashtag suggestions',
      color: 'purple',
      component: <ViralPredictor />,
      features: ['Viral Prediction', 'AI Content Optimization', 'Enhanced Tweet Analysis'],
    },
    {
      id: 2,
      icon: Users,
      title: 'Creator Intelligence Dashboard',
      description: 'Real-time creator analysis with follower data and influence metrics',
      color: 'blue',
      component: <CreatorLookup />,
      features: ['Live Follower Data', 'Authority Scoring', 'Verification Status'],
    },
  ];

  if (selectedTool) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={6}>
          <Button
            leftIcon={<Icon as={Activity} />}
            variant="outline"
            onClick={() => setSelectedTool(null)}
            alignSelf="flex-start"
          >
            ← Back to Tools
          </Button>
          {selectedTool.component}
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="6xl" py={8}>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <HStack spacing={2}>
              <Icon as={Sparkles} w={8} h={8} color="purple.500" />
              <Heading size="xl" bgGradient="linear(to-r, purple.400, blue.400)" bgClip="text">
                AI Viral Prediction Tool
              </Heading>
            </HStack>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Predict viral potential, optimize content with AI, and analyze creators in real-time
            </Text>
            <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
              Powered by LunarCrush + Google Gemini AI
            </Badge>
          </VStack>

          {/* Tools Grid */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" maxW="4xl">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                bg={cardBg}
                shadow="lg"
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: '2xl',
                }}
                onClick={() => setSelectedTool(tool)}
              >
                <CardBody p={6}>
                  <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                      <Icon as={tool.icon} w={8} h={8} color={`${tool.color}.500`} />
                      <VStack align="start" spacing={1} flex={1}>
                        <Heading size="md">{tool.title}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {tool.description}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    {/* Feature highlights */}
                    <VStack align="start" spacing={2} w="full">
                      <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                        Key Features:
                      </Text>
                      {tool.features.map((feature, index) => (
                        <HStack key={index} spacing={2}>
                          <Badge size="sm" colorScheme={tool.color} variant="outline">
                            {feature}
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>

                    <Button
                      colorScheme={tool.color}
                      variant="ghost"
                      size="sm"
                      rightIcon={<Icon as={Activity} w={4} h={4} />}
                      alignSelf="flex-end"
                    >
                      Launch Tool
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Value Proposition */}
          <VStack spacing={4} textAlign="center" pt={8}>
            <Heading size="md" color="gray.700">
              Everything you need to create viral Twitter content
            </Heading>
            <HStack spacing={6} wrap="wrap" justify="center">
              <Badge colorScheme="blue" p={2}>📊 Real-time Data</Badge>
              <Badge colorScheme="purple" p={2}>🤖 AI-Enhanced</Badge>
              <Badge colorScheme="green" p={2}>⚡ 20-Min Build</Badge>
              <Badge colorScheme="orange" p={2}>🚀 Production Ready</Badge>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
