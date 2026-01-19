import { useState, useEffect } from 'react';

interface WebVitals {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  resources: PerformanceResourceTiming[];
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<WebVitals>({});
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Measure Web Vitals
    const measureWebVitals = () => {
      try {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as PerformanceEntry;
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-input') {
                setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
                setMetrics(prev => ({ ...prev, cls: clsValue }));
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // First Contentful Paint (FCP)
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
              }
            });
          });
          fcpObserver.observe({ entryTypes: ['paint'] });

          return () => {
            lcpObserver.disconnect();
            fidObserver.disconnect();
            clsObserver.disconnect();
            fcpObserver.disconnect();
          };
        }
      } catch (error) {
        console.warn('Failed to measure Web Vitals:', error);
      }
    };

    const measurePageLoad = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

        setPerformanceMetrics({
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstPaint,
          firstContentfulPaint,
          resources: resourceEntries
        });

        // Log performance metrics in development
        if (import.meta.env.DEV) {
          console.group('Performance Metrics');
          console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
          console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms');
          console.log('First Paint:', firstPaint, 'ms');
          console.log('First Contentful Paint:', firstContentfulPaint, 'ms');
          console.log('Resources loaded:', resourceEntries.length);
          console.log('Slow resources:', resourceEntries.filter(r => r.duration > 1000).map(r => ({ name: r.name, duration: r.duration })));
          console.groupEnd();
        }

        // Send metrics to analytics service in production
        if (import.meta.env.PROD) {
          // Example: Send to analytics service
          sendMetricsToAnalytics({
            webVitals: metrics,
            performanceMetrics: {
              loadTime: navigation.loadEventEnd - navigation.fetchStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              firstPaint,
              firstContentfulPaint
            },
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now()
          });
        }
      } catch (error) {
        console.warn('Failed to measure page performance:', error);
      }
    };

    const cleanup = measureWebVitals();

    // Measure page load after page is fully loaded
    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
      return () => {
        window.removeEventListener('load', measurePageLoad);
        cleanup?.();
      };
    }

    return cleanup;
  }, []);

  // Function to send metrics to analytics service
  const sendMetricsToAnalytics = (data: any) => {
    // This would typically send to your analytics service
    // For now, we'll just log it
    console.log('Performance Analytics Data:', data);
    
    // Example implementation:
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  };

  // Get performance grade
  const getPerformanceGrade = (): 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (!performanceMetrics) return 'F';
    
    const { loadTime, firstContentfulPaint } = performanceMetrics;
    
    if (loadTime < 2000 && firstContentfulPaint < 1000) return 'A';
    if (loadTime < 3000 && firstContentfulPaint < 1500) return 'B';
    if (loadTime < 4000 && firstContentfulPaint < 2000) return 'C';
    if (loadTime < 5000 && firstContentfulPaint < 3000) return 'D';
    return 'F';
  };

  // Get slow resources
  const getSlowResources = (threshold = 1000) => {
    if (!performanceMetrics) return [];
    return performanceMetrics.resources.filter(resource => resource.duration > threshold);
  };

  return {
    metrics,
    performanceMetrics,
    isOnline,
    performanceGrade: getPerformanceGrade(),
    slowResources: getSlowResources(),
    sendMetricsToAnalytics
  };
};
