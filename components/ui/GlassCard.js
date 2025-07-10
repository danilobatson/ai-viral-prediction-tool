import {
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const GlassCard = ({ 
  children, 
  hover = true, 
  opacity = 0.25,
  borderOpacity = 0.2,
  ...props 
}) => {
  const glassBg = useColorModeValue(
    `rgba(255, 255, 255, ${opacity})`,
    `rgba(255, 255, 255, ${opacity * 0.1})`
  );
  
  const borderColor = useColorModeValue(
    `rgba(255, 255, 255, ${borderOpacity})`,
    `rgba(255, 255, 255, ${borderOpacity * 0.5})`
  );

  const boxShadow = useColorModeValue(
    '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  );

  return (
    <MotionBox
      bg={glassBg}
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow={boxShadow}
      overflow="hidden"
      whileHover={hover ? { 
        scale: 1.02,
        boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.5)"
      } : {}}
      transition="all 0.3s ease"
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export default GlassCard;
