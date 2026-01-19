import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  loadTime: number;
  resources: number;
}

interface WebVitalsConfig {
  onFCP?: (metric: number) => void;
  onLCP?: (metric: number) => void;
  onFID?: (metric: number) => void;
  onCLS?: (metric: number) => void;
  onTTFB?: (metric: number) => void;
  onLoadComplete?: (metrics: PerformanceMetrics) => void;
}

export const useWebVitals = (config: WebVitalsConfig = {}) => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Performance API is supported
    const supported = 'performance' in window && 'PerformanceObserver' in window;
    setIsSupported(supported);

    if (!supported) {
      console.warn('Performance API not supported in this browser');
      return;
    }

    // First Contentful Paint
    const measureFCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            const fcp = Math.round(fcpEntry.startTime);
            setMetrics(prev => ({ ...prev, fcp }));
            config.onFCP?.(fcp);
          }
        });
        observer.observe({ entryTypes: ['paint'] });
        return observer;
      } catch (error) {
        console.warn('Failed to measure FCP:', error);
      }
    };

    // Largest Contentful Paint
    const measureLCP = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const lcp = Math.round(lastEntry.startTime);
          setMetrics(prev => ({ ...prev, lcp }));
          config.onLCP?.(lcp);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        return observer;
      } catch (error) {
        console.warn('Failed to measure LCP:', error);
      }
    };

    // First Input Delay
    const measureFID = () => {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-input') {
              const fid = Math.round((entry as any).processingStart - entry.startTime);
              setMetrics(prev => ({ ...prev, fid }));
              config.onFID?.(fid);
            }
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
        return observer;
      } catch (error) {
        console.warn('Failed to measure FID:', error);
      }
    };

    // Cumulative Layout Shift
    const measureCLS = () => {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              const cls = Math.round(clsValue * 1000) / 1000;
              setMetrics(prev => ({ ...prev, cls }));
              config.onCLS?.(cls);
            }
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
        return observer;
      } catch (error) {
        console.warn('Failed to measure CLS:', error);
      }
    };

    // Time to First Byte
    const measureTTFB = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const ttfb = Math.round(navigation.responseStart - navigation.requestStart);
          setMetrics(prev => ({ ...prev, ttfb }));
          config.onTTFB?.(ttfb);
        }
      } catch (error) {
        console.warn('Failed to measure TTFB:', error);
      }
    };

    // Overall load metrics
    const measureLoadComplete = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const resources = performance.getEntriesByType('resource');
        
        if (navigation) {
          const loadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart);
          const resourceCount = resources.length;
          
          const completeMetrics: PerformanceMetrics = {
            fcp: metrics.fcp || 0,
            lcp: metrics.lcp || 0,
            fid: metrics.fid || 0,
            cls: metrics.cls || 0,
            ttfb: metrics.ttfb || 0,
            loadTime,
            resources: resourceCount
          };
          
          setMetrics(completeMetrics);
          config.onLoadComplete?.(completeMetrics);
        }
      } catch (error) {
        console.warn('Failed to measure load complete:', error);
      }
    };

    // Start measurements
    const observers: PerformanceObserver[] = [];
    
    const fcpObserver = measureFCP();
    if (fcpObserver) observers.push(fcpObserver);
    
    const lcpObserver = measureLCP();
    if (lcpObserver) observers.push(lcpObserver);
    
    const fidObserver = measureFID();
    if (fidObserver) observers.push(fidObserver);
    
    const clsObserver = measureCLS();
    if (clsObserver) observers.push(clsObserver);

    measureTTFB();

    // Measure load complete when page is fully loaded
    if (document.readyState === 'complete') {
      measureLoadComplete();
    } else {
      window.addEventListener('load', measureLoadComplete);
    }

    // Cleanup
    return () => {
      observers.forEach(observer => observer.disconnect());
      window.removeEventListener('load', measureLoadComplete);
    };
  }, []);

  // Get performance grade
  const getGrade = (): 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (!metrics.fcp || !metrics.lcp) return 'F';
    
    const fcp = metrics.fcp;
    const lcp = metrics.lcp;
    const cls = metrics.cls || 0;
    const fid = metrics.fid || 0;

    // Google's Core Web Vitals thresholds
    const fcpGood = fcp <= 1800;
    const lcpGood = lcp <= 2500;
    const clsGood = cls <= 0.1;
    const fidGood = fid <= 100;

    const goodCount = [fcpGood, lcpGood, clsGood, fidGood].filter(Boolean).length;
    
    if (goodCount === 4) return 'A';
    if (goodCount === 3) return 'B';
    if (goodCount === 2) return 'C';
    if (goodCount === 1) return 'D';
    return 'F';
  };

  // Get recommendations
  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.fcp && metrics.fcp > 1800) {
      recommendations.push('Optimize server response time and reduce render-blocking resources');
    }
    
    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('Optimize images and use modern image formats');
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Avoid layout shifts by specifying dimensions for images and ads');
    }
    
    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('Reduce JavaScript execution time and break up long tasks');
    }
    
    if (metrics.ttfb && metrics.ttfb > 800) {
      recommendations.push('Improve server performance and use CDN');
    }
    
    return recommendations;
  };

  return {
    metrics,
    isSupported,
    grade: getGrade(),
    recommendations: getRecommendations(),
    isComplete: !!(metrics.fcp && metrics.lcp && metrics.loadTime)
  };
};
