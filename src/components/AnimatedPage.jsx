import React from 'react';
import { motion } from 'framer-motion';

// This object defines the animation states
const animations = {
  initial: { opacity: 0, y: 20 },   // Start invisible and slightly down
  animate: { opacity: 1, y: 0 },    // Animate to visible and its original position
  exit: { opacity: 0, y: -20 },     // Fade out and move slightly up
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }} // How long the animation should take
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;