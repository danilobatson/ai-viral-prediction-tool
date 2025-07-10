import {
  Tooltip,
  Box,
  VStack,
  Text,
  Badge,
  Divider,
  HStack,
} from '@chakra-ui/react';

const CategoryTooltip = ({ children, category }) => {
  const categoryDefinitions = {
    'Ultra High': {
      range: '75%+',
      color: 'red',
      emoji: '🔥',
      description: 'Global trending potential',
      characteristics: [
        'Major news or celebrity moments',
        'Mass media pickup likely',
        'Cultural moment potential',
        'Cross-platform viral spread'
      ],
      examples: 'Breaking news, major announcements, viral memes',
      engagementThreshold: '1M+ engagements expected'
    },
    'High': {
      range: '60-74%',
      color: 'orange',
      emoji: '⭐',
      description: 'Strong viral potential',
      characteristics: [
        'Category/niche trending',
        'Significant community impact',
        'High engagement rate',
        'Strong sharing potential'
      ],
      examples: 'Industry insights, trending topics, influencer content',
      engagementThreshold: '100K-999K engagements'
    },
    'Moderate': {
      range: '40-59%',
      color: 'yellow',
      emoji: '📈',
      description: 'Good organic reach',
      characteristics: [
        'Solid organic performance',
        'Niche audience appeal',
        'Quality engagement',
        'Community building potential'
      ],
      examples: 'Educational content, thought leadership, niche discussions',
      engagementThreshold: '10K-99K engagements'
    },
    'Low': {
      range: '0-39%',
      color: 'gray',
      emoji: '📊',
      description: 'Standard performance',
      characteristics: [
        'Regular audience reach',
        'Baseline engagement',
        'Personal/brand updates',
        'Steady but limited spread'
      ],
      examples: 'Personal updates, regular posts, basic announcements',
      engagementThreshold: 'Under 10K engagements'
    }
  };

  const categoryData = categoryDefinitions[category];
  if (!categoryData) return children;

  return (
    <Tooltip
      label={
        <Box p={3} maxW="300px">
          <VStack align="start" spacing={3}>
            <HStack spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                {categoryData.emoji} {category}
              </Text>
              <Badge colorScheme={categoryData.color} variant="solid">
                {categoryData.range}
              </Badge>
            </HStack>

            <Text fontSize="sm" color="gray.200">
              {categoryData.description}
            </Text>

            <Divider />

            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="gray.300">
                CHARACTERISTICS:
              </Text>
              {categoryData.characteristics.map((char, index) => (
                <Text key={index} fontSize="xs" color="gray.200">
                  • {char}
                </Text>
              ))}
            </VStack>

            <Divider />

            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="gray.300">
                EXAMPLES:
              </Text>
              <Text fontSize="xs" color="gray.200">
                {categoryData.examples}
              </Text>
            </VStack>

            <Divider />

            <Text fontSize="xs" fontWeight="bold" color={`${categoryData.color}.200`}>
              {categoryData.engagementThreshold}
            </Text>
          </VStack>
        </Box>
      }
      bg="gray.800"
      color="white"
      borderRadius="lg"
      placement="top"
      hasArrow
    >
      {children}
    </Tooltip>
  );
};

export default CategoryTooltip;
