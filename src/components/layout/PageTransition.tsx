
import { ReactNode, memo } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

// Define animation variants outside component for better performance
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut"
};

// Memoize the component to prevent unnecessary re-renders
export const PageTransition = memo(function PageTransition({ 
  children 
}: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = 'PageTransition';
