import { Box, Spinner, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export const LoadingSpinner = ({ title = "Processing...", subtitle, icon }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <VStack spacing={4} p={8} textAlign="center">
        <Box position="relative">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="purple.500"
            size="xl"
          />
          {icon && (
            <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
              {icon}
            </Box>
          )}
        </Box>
        <VStack spacing={2}>
          <Text fontWeight="bold" color="purple.600" fontSize="lg">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="sm" color="gray.600" maxW="300px">
              {subtitle}
            </Text>
          )}
        </VStack>
      </VStack>
    </MotionBox>
  )
}

export default LoadingSpinner
