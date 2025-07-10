import { Text } from '@chakra-ui/react'

export const GradientText = ({ children, gradient = "linear(to-r, purple.400, blue.400)", ...props }) => {
  return (
    <Text
      bgGradient={gradient}
      bgClip="text"
      fontSize="transparent"
      fontWeight="bold"
      {...props}
    >
      {children}
    </Text>
  )
}

export default GradientText
