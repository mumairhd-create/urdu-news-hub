import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  crop?: 'attention' | 'center' | 'entropy';
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Enhanced image optimization with CDN support
export const getOptimizedImageUrl = (
  src: string, 
  options: ImageOptimizationOptions = {}
): string => {
  const {
    quality = 80,
    format = 'webp',
    width,
    height,
    crop = 'attention'
  } = options;

  // If it's already an optimized URL or external URL, return as is
  if (src.includes('unsplash.com') || src.startsWith('data:')) {
    // Unsplash provides built-in optimization
    const url = new URL(src);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (quality !== 80) url.searchParams.set('q', quality.toString());
    if (format !== 'webp') url.searchParams.set('fm', format);
    if (crop !== 'attention') url.searchParams.set('crop', crop);
    
    return url.toString();
  }

  // For local images, we'll simulate CDN optimization
  // In production, this would point to your CDN service
  const baseUrl = src.startsWith('/') ? src : `/${src}`;
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality !== 80) params.set('q', quality.toString());
  params.set('fm', format);
  params.set('fit', 'crop');
  params.set('crop', crop);

  const paramString = params.toString();
  return paramString ? `${baseUrl}?${paramString}` : baseUrl;
};

// Generate blur placeholder
export const generateBlurPlaceholder = (width: number = 400, height: number = 300): string => {
  // Simple SVG placeholder with blur effect
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#e5e7eb" filter="url(#blur)" />
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
        Loading...
      </text>
    </svg>
  `.trim().replace(/\s+/g, ' ');

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Preload critical images
export const preloadImage = (src: string, options: ImageOptimizationOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const optimizedSrc = getOptimizedImageUrl(src, options);
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${optimizedSrc}`));
    img.src = optimizedSrc;
  });
};

// Batch preload multiple images
export const preloadImages = async (
  images: Array<{ src: string; options?: ImageOptimizationOptions }>
): Promise<void> => {
  const promises = images.map(({ src, options }) => preloadImage(src, options));
  await Promise.allSettled(promises);
};

// Enhanced LazyImage component with optimization
const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(
    placeholder === 'blur' ? (blurDataURL || generateBlurPlaceholder(width, height)) : ''
  );
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized URL
  const optimizedSrc = getOptimizedImageUrl(src, { width, height });

  useEffect(() => {
    if (priority) {
      // Load immediately for priority images
      loadOptimizedImage();
    } else {
      // Use Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }
  }, [priority]);

  useEffect(() => {
    if (isInView || priority) {
      loadOptimizedImage();
    }
  }, [isInView, priority]);

  const loadOptimizedImage = async () => {
    try {
      // Start loading the optimized image
      const img = new Image();
      img.src = optimizedSrc;
      
      img.onload = () => {
        setCurrentSrc(optimizedSrc);
        setIsLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        setHasError(true);
        onError?.();
      };
    } catch (error) {
      setHasError(true);
      onError?.();
    }
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'hidden'
        )}
      />
      
      {!isLoaded && !hasError && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <span className="text-gray-500 text-sm">Failed to load image</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
