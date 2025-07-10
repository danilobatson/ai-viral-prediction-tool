import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const HydrationSafeConfetti = ({ trigger, viralProbability }) => {
  const [particles, setParticles] = useState([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && trigger && viralProbability >= 70) {
      const newParticles = [];
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFDAB9'];
      
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * screenWidth,
          y: screenHeight + 50,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          velocity: {
            x: (Math.random() - 0.5) * 10,
            y: -(Math.random() * 15 + 10),
          },
          rotation: Math.random() * 360,
          shape: Math.random() > 0.5 ? 'circle' : 'square',
        });
      }
      
      setParticles(newParticles);
      
      // Clear particles after animation
      setTimeout(() => setParticles([]), 3000);
    }
  }, [trigger, viralProbability, mounted]);

  if (!mounted || particles.length === 0) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      pointerEvents="none"
      zIndex="9999"
    >
      {particles.map((particle) => (
        <MotionBox
          key={particle.id}
          position="absolute"
          width={`${particle.size}px`}
          height={`${particle.size}px`}
          bg={particle.color}
          borderRadius={particle.shape === 'circle' ? '50%' : '0'}
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            x: particle.x + particle.velocity.x * 100,
            y: particle.y + particle.velocity.y * 100,
            rotate: particle.rotation,
            opacity: 0,
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        />
      ))}
    </Box>
  );
};

export default HydrationSafeConfetti;
