import { cn } from '../../utils/helpers';

const variants = {
  default: 'bg-navy-600 text-gray-300',
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent-300',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  danger: 'bg-red-500/20 text-red-400',
};

const Badge = ({ children, variant = 'default', className, dot }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', {
          'bg-gray-400': variant === 'default',
          'bg-primary': variant === 'primary',
          'bg-accent-400': variant === 'accent',
          'bg-green-400': variant === 'success',
          'bg-yellow-400': variant === 'warning',
          'bg-red-400': variant === 'danger',
        })} />
      )}
      {children}
    </span>
  );
};

export default Badge;
