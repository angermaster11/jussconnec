import { cn, getInitials } from '../../utils/helpers';

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
  '2xl': 'h-28 w-28 text-2xl',
};

const Avatar = ({ src, firstName, lastName, size = 'md', className, showOnline, isOnline }) => {
  const initials = getInitials(firstName, lastName);

  return (
    <div className={cn('relative inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={`${firstName || ''} ${lastName || ''}`}
          className={cn(
            'rounded-full object-cover ring-2 ring-navy-700',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold',
            'bg-gradient-primary text-navy-900',
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}

      {showOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-navy-900',
            size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3',
            isOnline ? 'bg-green-400' : 'bg-gray-500'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
