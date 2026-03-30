import { cn } from '../../utils/helpers';

const SkeletonLine = ({ className }) => (
  <div className={cn('skeleton h-4 w-full', className)} />
);

const SkeletonCircle = ({ className, size = 'md' }) => {
  const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14', xl: 'h-20 w-20' };
  return <div className={cn('skeleton rounded-full', sizes[size], className)} />;
};

const SkeletonCard = ({ className }) => (
  <div className={cn('glass-card p-6 space-y-4', className)}>
    <div className="flex items-center gap-3">
      <SkeletonCircle />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-1/3 h-3" />
        <SkeletonLine className="w-1/4 h-2" />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-5/6" />
      <SkeletonLine className="w-3/4" />
    </div>
    <div className="skeleton h-48 w-full rounded-xl" />
    <div className="flex gap-4">
      <SkeletonLine className="w-16 h-3" />
      <SkeletonLine className="w-16 h-3" />
      <SkeletonLine className="w-16 h-3" />
    </div>
  </div>
);

const SkeletonProfile = () => (
  <div className="glass-card overflow-hidden">
    <div className="skeleton h-48 w-full" />
    <div className="p-6 space-y-4">
      <div className="flex items-end gap-4 -mt-16">
        <SkeletonCircle size="xl" />
        <div className="flex-1 space-y-2 pt-8">
          <SkeletonLine className="w-1/3 h-5" />
          <SkeletonLine className="w-1/2 h-3" />
        </div>
      </div>
      <SkeletonLine className="w-1/4 h-3" />
      <div className="flex gap-4">
        <SkeletonLine className="w-20 h-8 rounded-xl" />
        <SkeletonLine className="w-20 h-8 rounded-xl" />
      </div>
    </div>
  </div>
);

export { SkeletonLine, SkeletonCircle, SkeletonCard, SkeletonProfile };
export default SkeletonCard;
