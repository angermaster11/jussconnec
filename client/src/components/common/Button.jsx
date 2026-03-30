import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary hover:bg-primary-600 text-navy-900 font-semibold',
  secondary: 'bg-navy-700 hover:bg-navy-600 text-white border border-navy-600',
  ghost: 'hover:bg-white/5 text-gray-300 hover:text-white',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  outline: 'border border-primary text-primary hover:bg-primary/10',
  gradient: 'bg-gradient-primary text-navy-900 font-semibold hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3 text-base rounded-xl',
  xl: 'px-10 py-4 text-lg rounded-2xl',
  icon: 'p-2.5 rounded-xl',
};

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
