import {
  Box,
  Text,
  VStack,
  Circle,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);

const ViralMeter = ({ probability, category, isAnimating = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (probability && isAnimating) {
      let start = 0;
      const end = probability;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 50);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setDisplayValue(Math.round(start));
      }, 50);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(probability);
    }
  }, [probability, isAnimating]);

  const getColor = (category) => {
    switch (category) {
      case 'Ultra High': return '#E53E3E'; // red.500
      case 'High': return '#FF8500'; // orange.500  
      case 'Moderate': return '#FFD700'; // yellow.500
      case 'Low': return '#718096'; // gray.500
      default: return '#718096';
    }
  };

  const color = getColor(category);
  const circumference = 2 * Math.PI * 90; // radius 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayValue / 85) * circumference;

  return (
    <Box position="relative" width="200px" height="200px">
      {/* Background Circle */}
      <svg
        width="200"
        height="200"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="8"
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <MotionCircle
          cx="100"
          cy="100"
          r="90"
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
          transform="rotate(-90 100 100)"
          filter="drop-shadow(0 0 10px rgba(0,0,0,0.3))"
        />
      </svg>

      {/* Center Content */}
      <VStack
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        spacing={1}
      >
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Text
            fontSize="3xl"
            fontWeight="black"
            color={color}
            lineHeight="1"
          >
            {displayValue}%
          </Text>
        </MotionBox>
        
        <Text
          fontSize="sm"
          color="gray.600"
          fontWeight="medium"
          textAlign="center"
        >
          Viral
          <br />
          Probability
        </Text>
      </VStack>

      {/* Floating Particles for High Scores */}
      {displayValue >= 70 && (
        <>
          {[...Array(6)].map((_, i) => (
            <MotionBox
              key={i}
              position="absolute"
              width="4px"
              height="4px"
              bg={color}
              borderRadius="50%"
              animate={{
                y: [0, -50, -100],
                x: [0, Math.random() * 40 - 20],
                opacity: [1, 0.8, 0],
                scale: [1, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
              style={{
                top: `${80 + Math.random() * 40}%`,
                left: `${40 + Math.random() * 20}%`,
              }}
            />
          ))}
        </>
      )}
    </Box>
  );
};

export default ViralMeter;
