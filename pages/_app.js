/**
 * App Component with Chakra UI Provider
 * Phase 3.2: Frontend Interface Development - Chakra UI
 */

import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
