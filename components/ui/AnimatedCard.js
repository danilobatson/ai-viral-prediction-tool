import { Box, Card, CardBody } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionCard = motion(Card)

export const AnimatedCard = ({ children, delay = 0, variant = 'gradient', ...props }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      variant={variant}
      {...props}
    >
      <CardBody>
        {children}
      </CardBody>
    </MotionCard>
  )
}

export default AnimatedCard
