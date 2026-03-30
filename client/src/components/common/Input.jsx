import { forwardRef, useState } from 'react';
import { cn } from '../../utils/helpers';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(
  ({ className, label, error, type = 'text', icon: Icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? 'text' : type}
            className={cn(
              'w-full bg-navy-800 border border-navy-600 rounded-xl px-4 py-3',
              'text-white placeholder-gray-500',
              'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50',
              'transition-all duration-200',
              Icon && 'pl-10',
              isPassword && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
