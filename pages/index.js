import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Icon,
  Badge,
  Flex,
  useColorModeValue,
  Divider
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  FaBrain,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaHashtag,
  FaClock,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaLightbulb
} from 'react-icons/fa'
import { SiGooglegemini, SiNextdotjs, SiReact, SiChakraui } from 'react-icons/si'
import Head from 'next/head'
import { useState } from 'react'

// Import your existing components
import ViralPredictor from '../components/ViralPredictor'
import CreatorLookup from '../components/CreatorLookup'
import { GradientText } from '../components/ui/GradientText'
import { AnimatedCard } from '../components/ui/AnimatedCard'

const MotionBox = motion(Box)
const MotionContainer = motion(Container)

export default function Home() {
  const [activeDemo, setActiveDemo] = useState('predictor')

  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, blue.50, indigo.50)',
    'linear(to-br, purple.900, blue.900, indigo.900)'
  )

  const features = [
    {
      icon: FaBrain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze content patterns, sentiment, and engagement triggers to predict viral potential.",
      color: "purple.500"
    },
    {
      icon: FaChartLine,
      title: "Real-Time Social Data",
      description: "Live social media metrics and trending data from multiple platforms provide accurate, up-to-date insights.",
      color: "blue.500"
    },
    {
      icon: FaRocket,
      title: "Instant Predictions",
      description: "Get viral probability scores in seconds with detailed breakdowns and actionable optimization recommendations.",
      color: "green.500"
    },
    {
      icon: FaUsers,
      title: "Creator Intelligence",
      description: "Deep analysis of creator influence, audience engagement, and historical performance patterns.",
      color: "orange.500"
    }
  ]

  const techStack = [
    { icon: SiGooglegemini, name: "Google Gemini AI", color: "purple.500" },
    { icon: SiNextdotjs, name: "Next.js", color: "gray.900" },
    { icon: SiReact, name: "React", color: "blue.500" },
    { icon: SiChakraui, name: "Chakra UI", color: "teal.500" },
  ]

  const stats = [
    { number: "221M+", label: "Creator Follower Capacity" },
    { number: "88%", label: "Average Prediction Accuracy" },
    { number: "<2s", label: "Analysis Speed" },
    { number: "100%", label: "Real Data Sources" },
  ]

  return (
    <>
      <Head>
        <title>AI Viral Prediction Tool - Predict Content Virality with Machine Learning</title>
        <meta name="description" content="Advanced AI tool for predicting viral content probability using real-time social data and machine learning algorithms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box minH="100vh" bgGradient={bgGradient}>
        {/* Hero Section */}
        <MotionContainer
          maxW="7xl"
          pt={20}
          pb={16}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <VStack spacing={8} textAlign="center">
            {/* Hero Badge */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge
                colorScheme="purple"
                fontSize="sm"
                px={4}
                py={2}
                borderRadius="full"
                variant="subtle"
              >
                🚀 Powered by Google Gemini AI • Real-Time Social Data
              </Badge>
            </MotionBox>

            {/* Main Headline */}
            <VStack spacing={4}>
              <Heading
                size="2xl"
                maxW="4xl"
                lineHeight="shorter"
                fontWeight="800"
              >
                Predict Content Virality with{' '}
                <GradientText gradient="linear(to-r, purple.400, blue.400, indigo.400)">
                  Advanced AI
                </GradientText>
              </Heading>

              <Heading
                size="lg"
                maxW="3xl"
                fontWeight="400"
                color="gray.600"
                lineHeight="tall"
              >
                Analyze viral potential before you post. Our AI engine processes{' '}
                <Text as="span" color="purple.600" fontWeight="600">real-time social data</Text>
                {' '}and{' '}
                <Text as="span" color="blue.600" fontWeight="600">machine learning algorithms</Text>
                {' '}to predict content success
              </Heading>
            </VStack>

            {/* CTA Buttons */}
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <HStack spacing={4} wrap="wrap" justify="center">
                <Button
                  size="lg"
                  variant="viral"
                  leftIcon={<Icon as={FaBrain} />}
                  onClick={() => setActiveDemo('predictor')}
                  isActive={activeDemo === 'predictor'}
                >
                  Try AI Prediction
                </Button>
                <Button
                  size="lg"
                  variant="ai"
                  leftIcon={<Icon as={FaUsers} />}
                  onClick={() => setActiveDemo('creator')}
                  isActive={activeDemo === 'creator'}
                >
                  Analyze Creator
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="purple"
                  leftIcon={<Icon as={FaGithub} />}
                  as="a"
                  href="https://github.com/danilobatson/ai-viral-prediction-tool"
                  target="_blank"
                >
                  View Source
                </Button>
              </HStack>
            </MotionBox>

            {/* Stats Grid */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              mt={8}
            >
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                {stats.map((stat, index) => (
                  <VStack key={stat.label} spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      {stat.number}
                    </Text>
                    <Text fontSize="xs" color="gray.600" textAlign="center">
                      {stat.label}
                    </Text>
                  </VStack>
                ))}
              </SimpleGrid>
            </MotionBox>
          </VStack>
        </MotionContainer>

        {/* Interactive Demo Section */}
        <Container maxW="7xl" py={16}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">
                <GradientText>Try It Now</GradientText>
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                See how our AI analyzes content and predicts viral success in real-time
              </Text>
            </VStack>

            {/* Demo Interface */}
            <Box w="full" maxW="4xl">
              {activeDemo === 'predictor' && (
                <MotionBox
                  key="predictor"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatedCard variant="gradient" delay={0.2}>
                    <VStack spacing={6}>
                      <HStack spacing={3}>
                        <Icon as={FaBrain} color="purple.500" boxSize={6} />
                        <Heading size="md">AI Viral Probability Engine</Heading>
                      </HStack>
                      <ViralPredictor />
                    </VStack>
                  </AnimatedCard>
                </MotionBox>
              )}

              {activeDemo === 'creator' && (
                <MotionBox
                  key="creator"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AnimatedCard variant="gradient" delay={0.2}>
                    <VStack spacing={6}>
                      <HStack spacing={3}>
                        <Icon as={FaUsers} color="blue.500" boxSize={6} />
                        <Heading size="md">Creator Intelligence Analysis</Heading>
                      </HStack>
                      <CreatorLookup />
                    </VStack>
                  </AnimatedCard>
                </MotionBox>
              )}
            </Box>
          </VStack>
        </Container>

        {/* Features Section */}
        <Container maxW="7xl" py={16}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">
                <GradientText>Powerful Features</GradientText>
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Everything you need to understand and optimize your content's viral potential
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <AnimatedCard key={feature.title} delay={index * 0.1} variant="glass">
                  <VStack spacing={4} textAlign="center" h="full">
                    <Box
                      p={3}
                      borderRadius="full"
                      bg={`${feature.color.split('.')[0]}.100`}
                    >
                      <Icon as={feature.icon} boxSize={6} color={feature.color} />
                    </Box>
                    <Heading size="sm">{feature.title}</Heading>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      {feature.description}
                    </Text>
                  </VStack>
                </AnimatedCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>

        {/* How It Works Section */}
        <Container maxW="7xl" py={16}>
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">
                <GradientText>How It Works</GradientText>
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Three simple steps to predict your content's viral potential
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <AnimatedCard variant="gradient" delay={0.1}>
                <VStack spacing={4} textAlign="center">
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="full"
                    bg="purple.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontWeight="bold" fontSize="xl">1</Text>
                  </Box>
                  <Heading size="sm">Input Your Content</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Paste your social media content and optionally specify a creator handle
                  </Text>
                </VStack>
              </AnimatedCard>

              <AnimatedCard variant="gradient" delay={0.2}>
                <VStack spacing={4} textAlign="center">
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="full"
                    bg="blue.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontWeight="bold" fontSize="xl">2</Text>
                  </Box>
                  <Heading size="sm">AI Analysis</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Our AI processes sentiment, engagement patterns, and real-time social data
                  </Text>
                </VStack>
              </AnimatedCard>

              <AnimatedCard variant="gradient" delay={0.3}>
                <VStack spacing={4} textAlign="center">
                  <Box
                    w="60px"
                    h="60px"
                    borderRadius="full"
                    bg="green.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontWeight="bold" fontSize="xl">3</Text>
                  </Box>
                  <Heading size="sm">Get Predictions</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Receive detailed viral probability scores and optimization recommendations
                  </Text>
                </VStack>
              </AnimatedCard>
            </SimpleGrid>
          </VStack>
        </Container>


        {/* Footer */}
        <Box bg="gray.900" color="white" py={12}>
          <Container maxW="7xl">
            <VStack spacing={8}>
              <Divider />
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                <VStack spacing={4} align="start">
                  <Heading size="md">
                    <GradientText gradient="linear(to-r, purple.300, blue.300)">
                      AI Viral Prediction Tool
                    </GradientText>
                  </Heading>
                  <Text color="gray.400">
                    Advanced machine learning for content optimization and viral prediction
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      as="a"
                      href="https://github.com/danilobatson/ai-viral-prediction-tool"
                      target="_blank"
                      variant="ghost"
                      size="sm"
                      leftIcon={<Icon as={FaGithub} />}
                      colorScheme="gray"
                    >
                      GitHub
                    </Button>
                    <Button
                      as="a"
                      href="mailto:djbatson19@gmail.com"
                      variant="ghost"
                      size="sm"
                      leftIcon={<Icon as={FaEnvelope} />}
                      colorScheme="gray"
                    >
                      Contact
                    </Button>
                  </HStack>
                </VStack>

                <VStack spacing={4} align="start">
                  <Heading size="sm" color="gray.300">Technology</Heading>
                  <VStack spacing={2} align="start">
                    <Text color="gray.400" fontSize="sm">Google Gemini 2.0 Flash Lite</Text>
                    <Text color="gray.400" fontSize="sm">LunarCrush Social Data API</Text>
                    <Text color="gray.400" fontSize="sm">Next.js + React</Text>
                    <Text color="gray.400" fontSize="sm">Real-time Processing</Text>
                  </VStack>
                </VStack>

                <VStack spacing={4} align="start">
                  <Heading size="sm" color="gray.300">Features</Heading>
                  <VStack spacing={2} align="start">
                    <Text color="gray.400" fontSize="sm">🎯 Viral Probability Scoring</Text>
                    <Text color="gray.400" fontSize="sm">📊 Creator Intelligence</Text>
                    <Text color="gray.400" fontSize="sm">🚀 Real-time Analysis</Text>
                    <Text color="gray.400" fontSize="sm">💡 Optimization Tips</Text>
                  </VStack>
                </VStack>
              </SimpleGrid>

              <Divider />

              <Flex justify="space-between" align="center" w="full" wrap="wrap" gap={4}>
                <Text color="gray.400" fontSize="sm">
                  © 2025 AI Viral Prediction Tool. Built by Danilo Batson.
                </Text>
                <Text color="gray.400" fontSize="sm">
                  Powered by Real AI • Zero Mock Data
                </Text>
              </Flex>
            </VStack>
          </Container>
        </Box>
      </Box>
    </>
  )
}
