import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -3, boxShadow: '0 16px 32px -12px rgba(15,23,42,0.14)' } : undefined}
      transition={{ duration: 0.18 }}
      className={`rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.06)] dark:shadow-none ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
