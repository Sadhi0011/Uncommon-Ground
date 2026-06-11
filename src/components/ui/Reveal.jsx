import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '../../utils/motion';

// Lightweight scroll-reveal wrapper used across all sections.
export default function Reveal({
  children,
  variants = fadeUp,
  className = '',
  as = 'div',
  delay = 0,
  amount,
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...viewportOnce, ...(amount ? { amount } : {}) }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
