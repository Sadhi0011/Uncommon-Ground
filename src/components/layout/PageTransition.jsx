import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/motion';

export default function PageTransition({ children }) {
  return (
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-[60vh]"
    >
      {children}
    </motion.main>
  );
}
