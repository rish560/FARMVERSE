import { motion } from 'framer-motion';

const variantClasses = {
  primary:
    'bg-green-600 text-white hover:bg-green-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
};

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
