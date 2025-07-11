import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTwitter,
  FaUser,
  FaBrain,
  FaCheckCircle,
  FaRetweet,
  FaHeart,
  FaExclamationTriangle,
} from 'react-icons/fa';

const MotionBox = motion(Box);

const TwitterProgress = ({ currentStep, currentMessage, error }) => {
  const [progress, setProgress] = useState(0);

  // Real step definitions based on actual API flow
  const stepConfig = {
    'connecting': {
      icon: FaTwitter,
      title: 'Analyzing Your Tweet',
      color: 'blue.500',
      progress: 15,
    },
    'fetching': {
      icon: FaUser,
      title: 'Getting Twitter Account Data',
      color: 'cyan.500',
      progress: 40,
    },
    'analyzing': {
      icon: FaBrain,
      title: 'AI Tweet Analysis',
      color: 'purple.500',
      progress: 85,
    },
    'complete': {
      icon: FaCheckCircle,
      title: 'Analysis Complete!',
      color: 'green.500',
      progress: 100,
    },
    'error': {
      icon: FaExclamationTriangle,
      title: 'Analysis Failed',
      color: 'red.500',
      progress: 0,
    },
  };

  const currentStepData = stepConfig[currentStep] || stepConfig['connecting'];

  // Smooth progress animation to target
  useEffect(() => {
    const targetProgress = currentStepData.progress;

    // Don't animate backwards
    if (targetProgress < progress && currentStep !== 'error') {
      return;
    }

    let animationFrame;
    const animateProgress = () => {
      setProgress(current => {
        const diff = targetProgress - current;
        if (Math.abs(diff) < 0.1) {
          return targetProgress;
        }
        return current + (diff * 0.1); // Smooth easing
      });

      if (Math.abs(progress - targetProgress) > 0.1) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentStep, currentStepData.progress]);

  if (error) {
    return (
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderRadius="xl"
        p={6}
      >
        <VStack spacing={4}>
          <Icon as={FaExclamationTriangle} color="red.500" boxSize={8} />
          <VStack spacing={2} textAlign="center">
            <Text fontWeight="bold" color="red.600">
              Tweet Analysis Failed
            </Text>
            <Text fontSize="sm" color="red.500">
              {error}
            </Text>
            <Text fontSize="xs" color="gray.600">
              Try refreshing or check your internet connection
            </Text>
          </VStack>
        </VStack>
      </MotionBox>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      bg="white"
      border="2px solid"
      borderColor="blue.200"
      borderRadius="xl"
      p={6}
      boxShadow="lg"
    >
      <VStack spacing={6}>
        {/* Header with Real-Time Updates */}
        <HStack spacing={3}>
          <MotionBox
            animate={{
              rotate: currentStep === 'analyzing' ? 360 : 0,
              scale: currentStep === 'complete' ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: currentStep === 'analyzing' ? 2 : 0.5,
              repeat: currentStep === 'analyzing' ? Infinity : 0
            }}
          >
            <Icon as={currentStepData.icon} color={currentStepData.color} boxSize={6} />
          </MotionBox>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color="gray.800">
              {currentStepData.title}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {currentMessage || 'Processing...'}
            </Text>
          </VStack>
        </HStack>

        {/* Real-Time Progress Bar */}
        <Box w="full">
          <Progress
            value={progress}
            colorScheme="blue"
            borderRadius="full"
            size="lg"
            bg="gray.100"
            transition="all 0.3s ease-out"
          />
          <HStack justify="space-between" mt={2}>
            <Text fontSize="xs" color="gray.500">
              {Math.round(progress)}% Complete
            </Text>
            <Text fontSize="xs" color="gray.500">
              {currentStep === 'complete' ? 'Done!' : 'Analyzing tweet...'}
            </Text>
          </HStack>
        </Box>

        {/* Real-Time Step Indicators */}
        <HStack spacing={4} justify="center">
          {Object.entries(stepConfig).slice(0, -2).map(([stepKey, stepData], index) => {
            const isActive = stepKey === currentStep;
            const isCompleted = stepConfig[currentStep]?.progress > stepData.progress;

            return (
              <VStack key={stepKey} spacing={1} align="center">
                <Box
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg={isCompleted || isActive ? stepData.color : 'gray.200'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.3s ease"
                >
                  {isCompleted ? (
                    <Icon as={FaCheckCircle} color="white" boxSize={4} />
                  ) : isActive ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <Icon as={stepData.icon} color="gray.400" boxSize={4} />
                  )}
                </Box>
                <Text fontSize="xs" color={isCompleted || isActive ? stepData.color : 'gray.400'}>
                  {stepData.title.split(' ')[0]}
                </Text>
              </VStack>
            );
          })}
        </HStack>

        {/* Live Status Updates */}
        <HStack spacing={2} justify="center">
          <Badge
            colorScheme={currentStep === 'connecting' || currentStep === 'analyzing' ? 'blue' : 'gray'}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Icon as={FaTwitter} boxSize={3} />
            Twitter
          </Badge>
          <Badge
            colorScheme={currentStep === 'analyzing' ? 'green' : 'gray'}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Icon as={FaRetweet} boxSize={3} />
            Retweets
          </Badge>
          <Badge
            colorScheme={currentStep === 'analyzing' ? 'red' : 'gray'}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Icon as={FaHeart} boxSize={3} />
            Likes
          </Badge>
        </HStack>

        {/* Real-Time Messages */}
        {currentMessage && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentMessage} // Re-animate on message change
            transition={{ duration: 0.3 }}
          >
            <Text fontSize="sm" color="blue.600" textAlign="center" fontStyle="italic">
              &quot;{currentMessage}&quot;
            </Text>
          </MotionBox>
        )}
      </VStack>
    </MotionBox>
  );
};

export default TwitterProgress;
