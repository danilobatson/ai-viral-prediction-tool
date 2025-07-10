import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  Container,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTwitter, FaHeart, FaShare } from 'react-icons/fa';

const MotionBox = motion(Box);

const ModernHero = ({ onScrollToPredictor }) => {
  const glassBg = 'rgba(255, 255, 255, 0.25)';
  const glassBoxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bgGradient="linear(45deg, gray.800, black, gray.900, gray.700)"
      backgroundSize="400% 400%"
      css={{
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      {/* Animated background elements */}
      <MotionBox
        position="absolute"
        top="10%"
        left="10%"
        width="100px"
        height="100px"
        borderRadius="50%"
        bg="rgba(255, 255, 255, 0.1)"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <MotionBox
        position="absolute"
        top="60%"
        right="15%"
        width="60px"
        height="60px"
        borderRadius="50%"
        bg="rgba(255, 255, 255, 0.15)"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container maxW="6xl" py={20}>
        <VStack spacing={8} textAlign="center" color="white">
          {/* Main Hero Content */}
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge
              bg={glassBg}
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderRadius="full"
              px={6}
              py={2}
              fontSize="lg"
              fontWeight="medium"
              mb={6}
              boxShadow={glassBoxShadow}
            >
              𝕏 Tweet Viral Prediction
            </Badge>
            
            <Heading
              size="3xl"
              fontWeight="black"
              mb={6}
              bgGradient="linear(to-r, white, rgba(255,255,255,0.8))"
              bgClip="text"
              lineHeight="1.2"
            >
              Will Your Original Tweet Go Viral?
              <br />
              <Text as="span" color="rgba(255,255,255,0.9)">
                Find Out Before You Post
              </Text>
            </Heading>
            
            <Text
              fontSize="xl"
              maxW="600px"
              mx="auto"
              opacity="0.9"
              lineHeight="1.6"
              mb={8}
            >
              Get instant viral predictions for your original tweets. Analyze engagement potential, 
              optimize for likes and replies, and maximize your reach on 𝕏.
            </Text>
          </MotionBox>

          {/* X-Focused Benefits - SAME SIZE CARDS */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HStack spacing={6} justify="center" wrap="wrap">
              {[
                { 
                  icon: FaTwitter, 
                  title: 'Original Tweets', 
                  description: 'Analyze your own tweet content',
                  color: '#000000'
                },
                { 
                  icon: FaHeart, 
                  title: 'Engagement Prediction', 
                  description: 'Predict likes and replies',
                  color: '#E1306C'
                },
                { 
                  icon: FaShare, 
                  title: 'Viral Optimization', 
                  description: 'Tips to maximize reach',
                  color: '#1877F2'
                },
              ].map((benefit, index) => (
                <MotionBox
                  key={benefit.title}
                  bg={glassBg}
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  borderRadius="xl"
                  p={6}
                  w="200px"  // FIXED WIDTH - SAME SIZE
                  h="140px"  // FIXED HEIGHT - SAME SIZE
                  boxShadow={glassBoxShadow}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.5)"
                  }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Box as={benefit.icon} size="32px" opacity="0.9" mb={2} />
                  <Text fontSize="md" fontWeight="bold" mb={1}>
                    {benefit.title}
                  </Text>
                  <Text fontSize="xs" opacity="0.8" lineHeight="1.3">
                    {benefit.description}
                  </Text>
                </MotionBox>
              ))}
            </HStack>
          </MotionBox>

          {/* CTA Button */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              bg={glassBg}
              backdropFilter="blur(10px)"
              border="2px solid rgba(255, 255, 255, 0.3)"
              color="white"
              fontWeight="bold"
              fontSize="lg"
              px={8}
              py={6}
              borderRadius="full"
              boxShadow={glassBoxShadow}
              onClick={onScrollToPredictor}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 50px 0 rgba(31, 38, 135, 0.6)',
                bg: 'rgba(255, 255, 255, 0.2)',
              }}
              _active={{
                transform: 'translateY(0px)',
              }}
              transition="all 0.3s ease"
            >
              𝕏 Analyze My Tweet
            </Button>
          </MotionBox>

          {/* Scroll Indicator */}
          <MotionBox
            position="absolute"
            bottom="20px"
            left="50%"
            transform="translateX(-50%)"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Text fontSize="sm" opacity="0.7">
              ↓ Scroll to analyze your original tweet
            </Text>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default ModernHero;
