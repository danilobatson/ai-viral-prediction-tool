import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Icon,
  Circle,
  Badge,
} from '@chakra-ui/react';
import { FaCheck, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AnalysisProgress = ({ steps, currentStep, error }) => {
  const stepDefinitions = {
    'connecting': {
      label: 'Connecting to LunarCrush MCP',
      description: 'Establishing secure connection to social data source',
      order: 1
    },
    'fetching': {
      label: 'Fetching Creator Data',
      description: 'Retrieving real-time follower and engagement metrics',
      order: 2
    },
    'parsing': {
      label: 'LLM Parsing Data',
      description: 'AI extracting engagement numbers from response',
      order: 3
    },
    'analyzing': {
      label: 'Viral Analysis',
      description: 'Psychology-enhanced viral probability calculation',
      order: 4
    },
    'complete': {
      label: 'Analysis Complete',
      description: 'Real-time viral prediction ready',
      order: 5
    },
    'error': {
      label: 'Error Occurred',
      description: error || 'Something went wrong',
      order: -1
    }
  };

  const getStepStatus = (stepKey) => {
    const stepOrder = stepDefinitions[stepKey]?.order || 0;
    const currentOrder = stepDefinitions[currentStep]?.order || 0;
    
    if (currentStep === 'error') {
      return stepKey === 'error' ? 'error' : 'pending';
    }
    
    if (stepOrder < currentOrder) return 'completed';
    if (stepOrder === currentOrder) return 'active';
    return 'pending';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed': return FaCheck;
      case 'active': return FaCog;
      case 'error': return FaExclamationTriangle;
      default: return null;
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'active': return 'purple';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const progressPercentage = error ? 0 : 
    (stepDefinitions[currentStep]?.order || 0) * 20;

  const visibleSteps = Object.keys(stepDefinitions)
    .filter(key => key !== 'error')
    .sort((a, b) => stepDefinitions[a].order - stepDefinitions[b].order);

  return (
    <Box w="full" p={6}>
      <VStack spacing={6}>
        {/* Progress Header */}
        <VStack spacing={2}>
          <Text fontSize="lg" fontWeight="bold" color="purple.600">
            🧠 AI Viral Analysis Progress
          </Text>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            Real-time creator data analysis with LunarCrush MCP
          </Text>
        </VStack>

        {/* Progress Bar */}
        <Box w="full">
          <Progress
            value={progressPercentage}
            colorScheme={error ? 'red' : 'purple'}
            size="lg"
            borderRadius="lg"
            bg="gray.100"
            hasStripe={!error}
            isAnimated={!error && currentStep !== 'complete'}
          />
          <HStack justify="space-between" mt={2}>
            <Text fontSize="xs" color="gray.500">Starting</Text>
            <Text fontSize="xs" color="gray.500">{progressPercentage}%</Text>
            <Text fontSize="xs" color="gray.500">Complete</Text>
          </HStack>
        </Box>

        {/* Error Display */}
        {error && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            w="full"
            bg="red.50"
            borderColor="red.200"
            borderWidth="1px"
            borderRadius="lg"
            p={4}
          >
            <HStack spacing={3}>
              <Circle size={8} bg="red.500" color="white">
                <Icon as={FaExclamationTriangle} boxSize={3} />
              </Circle>
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" color="red.600">
                  Analysis Failed
                </Text>
                <Text fontSize="sm" color="red.600">
                  {error}
                </Text>
              </VStack>
            </HStack>
          </MotionBox>
        )}

        {/* Step List */}
        <VStack spacing={3} w="full" align="stretch">
          {visibleSteps.map((stepKey, index) => {
            const step = stepDefinitions[stepKey];
            const status = getStepStatus(stepKey);
            const StepIcon = getStepIcon(status);
            const color = getStepColor(status);

            return (
              <MotionBox
                key={stepKey}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HStack spacing={4} p={3} bg={status === 'active' ? `${color}.50` : 'transparent'} borderRadius="lg">
                  <Circle
                    size={10}
                    bg={status === 'pending' ? 'gray.200' : `${color}.500`}
                    color="white"
                  >
                    {StepIcon ? (
                      <Icon 
                        as={StepIcon} 
                        boxSize={4} 
                        className={status === 'active' ? 'animate-spin' : ''}
                      />
                    ) : (
                      <Text fontSize="sm" fontWeight="bold">
                        {index + 1}
                      </Text>
                    )}
                  </Circle>
                  
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text fontWeight="bold" color={`${color}.600`}>
                        {step.label}
                      </Text>
                      {status === 'active' && (
                        <Badge colorScheme={color} variant="solid" size="sm">
                          In Progress
                        </Badge>
                      )}
                      {status === 'completed' && (
                        <Badge colorScheme={color} variant="outline" size="sm">
                          Complete
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {step.description}
                    </Text>
                  </VStack>
                </HStack>
              </MotionBox>
            );
          })}
        </VStack>

        {/* Real-time Status */}
        <Box w="full" textAlign="center" p={3} bg="blue.50" borderRadius="lg">
          <Text fontSize="sm" color="blue.600" fontWeight="medium">
            ✅ NO MOCK DATA - Only real LunarCrush MCP + LLM analysis
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default AnalysisProgress;
