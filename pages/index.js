/**
 * Main Page - AI Viral Prediction Tool - Professional Chakra UI
 * Phase 3.2: Frontend Interface Development
 */

import { Box, Container, VStack, Text, Link, Flex } from '@chakra-ui/react';
import ViralPredictor from '../components/ViralPredictor';
import { AnalyticsProvider } from '../components/Analytics';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Viral Prediction Tool - Predict Crypto Post Virality</title>
        <meta name="description" content="Use AI to predict the viral potential of your crypto social media posts with advanced machine learning algorithms" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content="AI Viral Prediction Tool" />
        <meta property="og:description" content="Predict the viral potential of crypto posts with AI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com" />
        
        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Viral Prediction Tool" />
        <meta name="twitter:description" content="Predict crypto post virality with AI" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <AnalyticsProvider>
        <Box minH="100vh">
          <ViralPredictor />
          
          {/* Footer */}
          <Box bg="white" borderTop="1px" borderColor="gray.200" py={8}>
            <Container maxW="5xl">
              <VStack spacing={3} textAlign="center">
                <Text color="gray.600" fontSize="md">
                  Powered by{' '}
                  <Link href="https://lunarcrush.com" color="blue.500" isExternal fontWeight="semibold">
                    LunarCrush API
                  </Link>
                  {' • '}
                  Built with{' '}
                  <Link href="https://nextjs.org" color="blue.500" isExternal fontWeight="semibold">
                    Next.js
                  </Link>
                  {' & '}
                  <Link href="https://chakra-ui.com" color="blue.500" isExternal fontWeight="semibold">
                    Chakra UI
                  </Link>
                </Text>
                <Text fontSize="sm" color="gray.500">
                  <Link href="https://lunarcrush.com" color="blue.500" isExternal>
                    Get your LunarCrush API key to unlock enhanced features →
                  </Link>
                </Text>
              </VStack>
            </Container>
          </Box>
        </Box>
      </AnalyticsProvider>
    </>
  );
}
