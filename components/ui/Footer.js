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
  FaBook,
  FaPlay,
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
              AI-powered viral prediction tool for Twitter/X. Built with real-time social data and advanced language models.
            </Text>
            <HStack spacing={4}>
              <Link href="https://twitter.com/danilobatson" isExternal>
                <Icon as={FaTwitter} boxSize={5} _hover={{ color: '#1DA1F2' }} />
              </Link>
              <Link href="https://github.com/danilobatson" isExternal>
                <Icon as={FaGithub} boxSize={5} _hover={{ color: 'white' }} />
              </Link>
              <Link href="https://linkedin.com/in/danilo-batson" isExternal>
                <Icon as={FaLinkedin} boxSize={5} _hover={{ color: '#0077B5' }} />
              </Link>
            </HStack>
          </VStack>

          {/* AI & Data Sources */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" color={headingColor}>
              AI & Data
            </Text>
            <Stack spacing={2}>
              <Link 
                href="https://ai.google.dev/gemini-api" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Google Gemini API <Icon as={FaExternalLinkAlt} boxSize={3} />
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
                LunarCrush MCP <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://modelcontextprotocol.io" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Model Context Protocol <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://anthropic.com/claude" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Anthropic Claude <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
            </Stack>
          </VStack>

          {/* Tech Stack */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" color={headingColor}>
              Tech Stack
            </Text>
            <Stack spacing={2}>
              <Link 
                href="https://nextjs.org" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Next.js 14 <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://react.dev" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                React 18 <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://chakra-ui.com" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Chakra UI <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://framer.com/motion" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Framer Motion <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://vercel.com" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Vercel Deployment <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
            </Stack>
          </VStack>

          {/* Developer */}
          <VStack align="start" spacing={4}>
            <Text fontWeight="bold" color={headingColor}>
              Developer
            </Text>
            <Stack spacing={2}>
              <Link 
                href="https://danilobatson.github.io" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Portfolio <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://rxresu.me/danilobatson/danilo-batson-resume" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Resume <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://github.com/danilobatson" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                GitHub Projects <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="https://linkedin.com/in/danilo-batson" 
                isExternal 
                color={linkColor} 
                _hover={{ color: 'white' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                LinkedIn <Icon as={FaExternalLinkAlt} boxSize={3} />
              </Link>
              <Link 
                href="mailto:djbatson19@gmail.com" 
                color={linkColor} 
                _hover={{ color: 'white' }}
              >
                Contact
              </Link>
            </Stack>
          </VStack>
        </SimpleGrid>

        <Divider my={8} borderColor="gray.700" />

        {/* Tech Stack Icons & Credits */}
        <VStack spacing={6}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} w="full">
            <VStack spacing={2}>
              <HStack>
                <Icon as={FaBrain} color="purple.400" />
                <Text fontSize="sm" fontWeight="medium">AI Powered</Text>
              </HStack>
              <Text fontSize="xs" textAlign="center">Google Gemini 2.0</Text>
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
                <Text fontSize="sm" fontWeight="medium">Production</Text>
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
                Gemini 2.0
              </Badge>
              <Badge colorScheme="green" variant="outline">
                LunarCrush MCP
              </Badge>
              <Badge colorScheme="orange" variant="outline">
                Real-time
              </Badge>
            </HStack>
          </Stack>

          {/* Portfolio Statement */}
          <Box textAlign="center" pt={4}>
            <Text fontSize="xs" color="gray.500">
              🚀 Portfolio project showcasing AI integration, real-time data processing, and modern web development.
            </Text>
            <HStack justify="center" spacing={6} mt={2} fontSize="xs" color="gray.500">
              <Text>✅ Model Context Protocol</Text>
              <Text>🤖 AI-Enhanced Analysis</Text>
              <Text>📊 Real Social Data</Text>
              <Text>⚡ Production Ready</Text>
            </HStack>
          </Box>

          {/* Documentation Links */}
          <HStack justify="center" spacing={8} pt={4} fontSize="sm">
            <Link 
              href="https://ai.google.dev/gemini-api/docs" 
              isExternal 
              color="gray.400" 
              _hover={{ color: 'white' }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FaBook} boxSize={3} />
              Gemini Docs
            </Link>
            <Link 
              href="https://modelcontextprotocol.io/introduction" 
              isExternal 
              color="gray.400" 
              _hover={{ color: 'white' }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FaBook} boxSize={3} />
              MCP Docs
            </Link>
            <Link 
              href="https://lunarcrush.com/developers" 
              isExternal 
              color="gray.400" 
              _hover={{ color: 'white' }}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FaPlay} boxSize={3} />
              API Demo
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Footer;
