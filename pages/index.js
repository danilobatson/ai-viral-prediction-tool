import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import the main component
const ViralPredictor = dynamic(
  () => import('../components/ViralPredictor'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f7fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2d3748' }}>🚀 AI Viral Predictor</h1>
          <p style={{ color: '#718096' }}>Loading social media analyzer...</p>
        </div>
      </div>
    )
  }
);

// Light theme only - no toggle
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f7fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2d3748' }}>🚀 AI Viral Predictor</h1>
          <p style={{ color: '#718096' }}>Preparing social media analyzer...</p>
        </div>
      </div>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <ViralPredictor />
    </ChakraProvider>
  );
}
