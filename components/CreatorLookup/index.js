import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardBody,
  Text,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Avatar,
  Heading,
  Select,
} from '@chakra-ui/react';

const CreatorLookup = () => {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('x');
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.700');

  // Only MCP-supported platforms
  const supportedPlatforms = [
    { value: 'x', label: 'X (Twitter)', supported: true },
    { value: 'reddit', label: 'Reddit', supported: true },
    { value: 'youtube', label: 'YouTube', supported: true },
  ];

  const lookupCreator = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setCreatorData(null);

    try {
      const response = await fetch('/api/lookup-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle: username.trim(), // Changed from 'username' to 'handle'
          platform,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCreatorData(data.creator);
      } else {
        setError(data.error || 'Failed to lookup creator');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Creator lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toLocaleString() || '0';
  };

  return (
    <Box maxW="4xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Card bg={cardBg} borderRadius="lg">
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="bold">Platform</FormLabel>
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    {supportedPlatforms.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="bold">Creator Username</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (e.g., elonmusk)"
                    onKeyPress={(e) => e.key === 'Enter' && lookupCreator()}
                  />
                </FormControl>
              </HStack>
              <Button
                colorScheme="blue"
                onClick={lookupCreator}
                isLoading={loading}
                loadingText="Looking up via MCP..."
                isDisabled={!username.trim()}
                size="lg"
              >
                🔍 Lookup Creator via MCP
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
                <Spinner size="xl" color="blue.500" />
                <Text>Accessing LunarCrush MCP data...</Text>
              </VStack>
            </CardBody>
          </Card>
        )}

        {creatorData && (
          <Card bg={cardBg} borderRadius="lg">
            <CardBody>
              <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                  <Avatar 
                    size="lg" 
                    name={creatorData.name || username}
                    src={creatorData.avatar}
                  />
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">{creatorData.name || username}</Heading>
                    <Text color="gray.600">@{username}</Text>
                    <Badge colorScheme="blue">{platform.toUpperCase()}</Badge>
                  </VStack>
                </HStack>

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Stat textAlign="center">
                    <StatLabel>Followers</StatLabel>
                    <StatNumber color="blue.500">
                      {formatNumber(creatorData.followers || 0)}
                    </StatNumber>
                    <StatHelpText>Total audience</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Following</StatLabel>
                    <StatNumber color="green.500">
                      {formatNumber(creatorData.following || 0)}
                    </StatNumber>
                    <StatHelpText>Accounts followed</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Posts</StatLabel>
                    <StatNumber color="purple.500">
                      {formatNumber(creatorData.posts || 0)}
                    </StatNumber>
                    <StatHelpText>Total content</StatHelpText>
                  </Stat>

                  <Stat textAlign="center">
                    <StatLabel>Engagement</StatLabel>
                    <StatNumber color="orange.500">
                      {creatorData.engagementRate || 'N/A'}%
                    </StatNumber>
                    <StatHelpText>Avg interaction rate</StatHelpText>
                  </Stat>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default CreatorLookup;
