import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Modal = ({ isOpen, onClose, title, children, className, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className={cn(
                'w-full glass-card p-6 shadow-2xl',
                sizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-white">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 
                               hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Content */}
              {children}
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;
