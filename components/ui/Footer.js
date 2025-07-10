import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  VStack,
  HStack,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaExternalLinkAlt,
  FaDatabase,
  FaBrain,
  FaRocket,
  FaCode,
} from 'react-icons/fa';

const Footer = () => {
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const textColor = useColorModeValue('gray.300', 'gray.300');
  const headingColor = useColorModeValue('white', 'white');
  const linkColor = useColorModeValue('gray.300', 'gray.300');

  const currentYear = new Date().getFullYear();

  return (
    <Box bg={bgColor} color={textColor}>
      <Container maxW="6xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {/* Brand & Description */}
          <VStack align="start" spacing={4}>
            <Text fontSize="xl" fontWeight="bold" color={headingColor}>
              𝕏 Viral Predictor
            </Text>
            <Text fontSize="sm" lineHeight="tall">
              AI-powered viral prediction tool for Twitter/X. Get instant insights on your tweet's potential reach and engagement before you post.
            </Text>
            <HStack spacing={4}>
              <Link href="https://twitter.com" isExternal>
                <Icon as={FaTwitter} boxSize={5} _hover={{ color: '#1DA1F2' }} />
              </Link>
              <Link href="https://github.com" isExternal>
                <Icon as={FaGithub} boxSize={5} _hover={{ color: 'white' }} />
              </Link>
              <Link href="https://linkedin.com" isExternal>
                <Icon as={FaLinkedin} boxSize={5} _hover={{ color: '#0077B5' }} />
              </Link>
            </HStack>
          </VStack>

          {/* Product */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" color={headingColor}>
              Product
            </Text>
            <Stack spacing={2}>
              <Link href="#features" color={linkColor} _hover={{ color: 'white' }}>
                Features
              </Link>
              <Link href="#how-it-works" color={linkColor} _hover={{ color: 'white' }}>
                How It Works
              </Link>
              <Link href="#pricing" color={linkColor} _hover={{ color: 'white' }}>
                Pricing
              </Link>
              <Link href="#api" color={linkColor} _hover={{ color: 'white' }}>
                API Access
              </Link>
            </Stack>
          </VStack>

          {/* Resources */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" color={headingColor}>
              Resources
            </Text>
            <Stack spacing={2}>
              <Link href="#documentation" color={linkColor} _hover={{ color: 'white' }}>
                Documentation
              </Link>
              <Link href="#blog" color={linkColor} _hover={{ color: 'white' }}>
                Blog
              </Link>
              <Link href="#case-studies" color={linkColor} _hover={{ color: 'white' }}>
                Case Studies
              </Link>
              <Link 
                href="https://lunarcrush.com/developers/api/endpoints" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                LunarCrush API <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
            </Stack>
          </VStack>

          {/* Company */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" color={headingColor}>
              Company
            </Text>
            <Stack spacing={2}>
              <Link href="#about" color={linkColor} _hover={{ color: 'white' }}>
                About Us
              </Link>
              <Link href="#careers" color={linkColor} _hover={{ color: 'white' }}>
                Careers
              </Link>
              <Link href="#contact" color={linkColor} _hover={{ color: 'white' }}>
                Contact
              </Link>
              <Link href="#privacy" color={linkColor} _hover={{ color: 'white' }}>
                Privacy Policy
              </Link>
              <Link href="#terms" color={linkColor} _hover={{ color: 'white' }}>
                Terms of Service
              </Link>
            </Stack>
          </VStack>
        </SimpleGrid>

        <Divider my={8} borderColor="gray.700" />

        {/* Tech Stack & Credits */}
        <VStack spacing={6}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} w="full">
            <VStack spacing={2}>
              <HStack>
                <Icon as={FaBrain} color="purple.400" />
                <Text fontSize="sm" fontWeight="medium">AI Powered</Text>
              </HStack>
              <Text fontSize="xs" textAlign="center">Google Gemini</Text>
            </VStack>
            
            <VStack spacing={2}>
              <HStack>
                <Icon as={FaDatabase} color="blue.400" />
                <Text fontSize="sm" fontWeight="medium">Real Data</Text>
              </HStack>
              <Text fontSize="xs" textAlign="center">LunarCrush MCP</Text>
            </VStack>
            
            <VStack spacing={2}>
              <HStack>
                <Icon as={FaCode} color="green.400" />
                <Text fontSize="sm" fontWeight="medium">Modern Stack</Text>
              </HStack>
              <Text fontSize="xs" textAlign="center">Next.js + React</Text>
            </VStack>
            
            <VStack spacing={2}>
              <HStack>
                <Icon as={FaRocket} color="orange.400" />
                <Text fontSize="sm" fontWeight="medium">Fast Deploy</Text>
              </HStack>
              <Text fontSize="xs" textAlign="center">Vercel Platform</Text>
            </VStack>
          </SimpleGrid>

          <Divider borderColor="gray.700" />

          {/* Bottom Section */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            w="full"
            spacing={4}
          >
            <Text fontSize="sm">
              © {currentYear} 𝕏 Viral Predictor. Built by{' '}
              <Link 
                href="https://danilobatson.github.io" 
                isExternal 
                color="blue.400" 
                fontWeight="medium"
                _hover={{ color: 'blue.300' }}
              >
                Danilo Batson
              </Link>
            </Text>

            <HStack spacing={4} wrap="wrap">
              <Badge colorScheme="blue" variant="outline">
                Next.js 14
              </Badge>
              <Badge colorScheme="purple" variant="outline">
                Google Gemini
              </Badge>
              <Badge colorScheme="green" variant="outline">
                LunarCrush MCP
              </Badge>
              <Badge colorScheme="orange" variant="outline">
                Real-time Data
              </Badge>
            </HStack>
          </Stack>

          {/* Built for Portfolio */}
          <Box textAlign="center" pt={4}>
            <Text fontSize="xs" color="gray.500">
              🚀 Built as a portfolio project showcasing modern AI integration, real-time data processing, and production-ready development practices.
            </Text>
            <HStack justify="center" spacing={6} mt={2} fontSize="xs" color="gray.500">
              <Text>✅ Model Context Protocol</Text>
              <Text>🤖 AI-Enhanced Analysis</Text>
              <Text>📊 Real Social Data</Text>
              <Text>⚡ Production Ready</Text>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
