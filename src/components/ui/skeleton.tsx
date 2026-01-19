import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  lines?: number;
}

function Skeleton({ className, variant = 'rectangular', lines = 1, ...props }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-md'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn("animate-pulse bg-muted", variantClasses[variant])}
            style={{
              width: i === lines - 1 ? '70%' : '100%' // Last line shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse bg-muted", variantClasses[variant], className)} {...props} />
  );
}

// Card Skeleton
export const CardSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-4 space-y-4">
    <Skeleton variant="rectangular" className="w-full h-[200px]" />
    <Skeleton variant="text" lines={2} />
    <div className="flex items-center gap-2">
      <Skeleton variant="circular" className="w-4 h-4" />
      <Skeleton variant="text" className="w-[60px]" />
    </div>
  </div>
);

// Article Card Skeleton
export const ArticleCardSkeleton = ({ variant = 'medium' }: { variant?: 'featured' | 'large' | 'medium' | 'small' | 'list' }) => {
  if (variant === 'featured') {
    return (
      <div className="relative h-[450px] lg:h-[500px] bg-muted rounded-lg overflow-hidden">
        <Skeleton variant="rectangular" className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 lg:p-10">
          <div className="space-y-3 max-w-2xl">
            <Skeleton variant="text" className="w-[100px] h-5 bg-primary/30" />
            <Skeleton variant="text" lines={2} className="bg-white/20" />
            <Skeleton variant="text" lines={2} className="bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div className="flex gap-3 p-3 border-b border-border">
        <Skeleton variant="rectangular" className="w-24 h-20 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" lines={2} />
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" className="w-3 h-3" />
            <Skeleton variant="text" className="w-[40px]" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="py-3 border-b border-border space-y-2">
        <Skeleton variant="text" lines={1} />
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="w-3 h-3" />
          <Skeleton variant="text" className="w-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <Skeleton variant="rectangular" className="w-full h-[180px]" />
      <Skeleton variant="text" className="w-[80px] h-4" />
      <Skeleton variant="text" lines={2} />
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" className="w-4 h-4" />
        <Skeleton variant="text" className="w-[60px]" />
      </div>
    </div>
  );
};

// Category Skeleton
export const CategorySkeleton = () => (
  <div className="flex items-center gap-4 overflow-x-auto pb-2">
    {Array.from({ length: 6 }, (_, i) => (
      <Skeleton
        key={i}
        variant="rounded"
        className="w-[100px] h-10 shrink-0"
      />
    ))}
  </div>
);

// Loading Spinner
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]}`} />
  );
};

// Page Loading
export const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

export { Skeleton };
