import { useState, useEffect } from 'react';

interface OfflineArticle {
  id: string;
  title: { ur: string; en: string };
  content: { ur: string; en: string };
  excerpt: { ur: string; en: string };
  author: { ur: string; en: string };
  date: string;
  readTime: { ur: string; en: string };
  category: string;
  image: string;
  downloadedAt: string;
}

const OFFLINE_STORAGE_KEY = 'urdu-news-hub-offline-articles';

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageQuota, setStorageQuota] = useState<{ used: number; quota: number } | null>(null);

  // Check if service worker is available
  const isServiceWorkerSupported = 'serviceWorker' in navigator;

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check storage quota
  useEffect(() => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        setStorageQuota({
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        });
      });
    }
  }, []);

  // Save article for offline reading
  const saveArticleOffline = async (article: OfflineArticle): Promise<boolean> => {
    try {
      const offlineArticle: OfflineArticle = {
        ...article,
        downloadedAt: new Date().toISOString()
      };

      // Get existing offline articles
      const existingData = localStorage.getItem(OFFLINE_STORAGE_KEY);
      const offlineArticles: OfflineArticle[] = existingData 
        ? JSON.parse(existingData) 
        : [];

      // Check if article already exists
      const existingIndex = offlineArticles.findIndex(a => a.id === article.id);
      if (existingIndex >= 0) {
        offlineArticles[existingIndex] = offlineArticle;
      } else {
        offlineArticles.push(offlineArticle);
      }

      // Save to localStorage
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineArticles));

      // If service worker is available, cache the images
      if (isServiceWorkerSupported && 'caches' in window) {
        const cache = await caches.open('offline-articles');
        if (article.image) {
          try {
            await cache.add(article.image);
          } catch (error) {
            console.warn('Failed to cache image:', error);
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to save article offline:', error);
      return false;
    }
  };

  // Get all offline articles
  const getOfflineArticles = (): OfflineArticle[] => {
    try {
      const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline articles:', error);
      return [];
    }
  };

  // Get specific offline article
  const getOfflineArticle = (id: string): OfflineArticle | null => {
    try {
      const articles = getOfflineArticles();
      return articles.find(article => article.id === id) || null;
    } catch (error) {
      console.error('Failed to get offline article:', error);
      return null;
    }
  };

  // Remove article from offline storage
  const removeOfflineArticle = (id: string): boolean => {
    try {
      const articles = getOfflineArticles();
      const filteredArticles = articles.filter(article => article.id !== id);
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(filteredArticles));
      return true;
    } catch (error) {
      console.error('Failed to remove offline article:', error);
      return false;
    }
  };

  // Clear all offline articles
  const clearOfflineArticles = (): boolean => {
    try {
      localStorage.removeItem(OFFLINE_STORAGE_KEY);
      
      // Clear cached images
      if ('caches' in window) {
        caches.delete('offline-articles');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear offline articles:', error);
      return false;
    }
  };

  // Check if article is available offline
  const isArticleOffline = (id: string): boolean => {
    const article = getOfflineArticle(id);
    return article !== null;
  };

  // Get storage usage percentage
  const getStorageUsage = (): number => {
    if (!storageQuota || storageQuota.quota === 0) return 0;
    return (storageQuota.used / storageQuota.quota) * 100;
  };

  // Format storage size
  const formatStorageSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return {
    isOnline,
    isServiceWorkerSupported,
    storageQuota,
    storageUsage: getStorageUsage(),
    formatStorageSize,
    saveArticleOffline,
    getOfflineArticles,
    getOfflineArticle,
    removeOfflineArticle,
    clearOfflineArticles,
    isArticleOffline
  };
};
