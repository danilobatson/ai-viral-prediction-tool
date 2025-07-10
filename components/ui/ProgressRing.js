import { Box, Text, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export const ProgressRing = ({ 
  value, 
  size = 120, 
  strokeWidth = 8, 
  label, 
  color = "purple.500",
  showValue = true 
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <VStack spacing={2}>
      <Box position="relative" width={size} height={size}>
        <svg width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="gray.200"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <MotionBox
            as="circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {showValue && (
          <Box
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl" fontWeight="bold" color={color}>
              {Math.round(value)}%
            </Text>
          </Box>
        )}
      </Box>
      {label && (
        <Text fontSize="sm" fontWeight="medium" textAlign="center">
          {label}
        </Text>
      )}
    </VStack>
  )
}

export default ProgressRing
