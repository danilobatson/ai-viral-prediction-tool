import {
  IconButton,
  useColorMode,
  useColorModeValue,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  const bg = useColorModeValue(
    'rgba(255, 255, 255, 0.8)',
    'rgba(0, 0, 0, 0.8)'
  );
  
  const iconColor = useColorModeValue('yellow.500', 'blue.300');

  return (
    <Tooltip
      label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      placement="left"
      hasArrow
    >
      <MotionIconButton
        aria-label="Toggle color mode"
        icon={
          <MotionBox
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <FaMoon /> : <FaSun />}
          </MotionBox>
        }
        onClick={toggleColorMode}
        position="fixed"
        top="20px"
        right="20px"
        size="lg"
        borderRadius="full"
        bg={bg}
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        color={iconColor}
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        zIndex="1000"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
        }}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
