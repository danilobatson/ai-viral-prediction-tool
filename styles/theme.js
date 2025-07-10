import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      },
    }),
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    viral: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    },
    ai: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    }
  },
  components: {
    Button: {
      variants: {
        viral: {
          bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
            bg: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        },
        ai: {
          bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'xl',
            bg: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s',
        }
      }
    },
    Card: {
      variants: {
        glass: {
          container: {
            backdropFilter: 'blur(10px)',
            bg: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 'xl',
            boxShadow: 'xl',
          }
        },
        gradient: {
          container: {
            bg: 'linear-gradient(135deg, rgba(103, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid',
            borderColor: 'purple.200',
            borderRadius: 'xl',
            boxShadow: 'xl',
          }
        }
      }
    }
  }
})

export default theme
