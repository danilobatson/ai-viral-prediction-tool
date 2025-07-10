import { ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import theme from '../styles/theme'


function MyApp({ Component, pageProps, router }) {
  return (
    <ChakraProvider theme={theme}>
      <AnimatePresence mode="wait" initial={false}>
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </ChakraProvider>
  )
}

export default MyApp
