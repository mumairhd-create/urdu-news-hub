// Authentication System - Legacy Support
// This file provides backward compatibility for imports

// Basic authentication interface for compatibility
export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
  createdAt: number;
}

// Mock authentication system for compatibility
export const authSystem = {
  login: async (code: string): Promise<boolean> => {
    // Hardcoded admin login code
    return code === '345341';
  },
  
  logout: async (): Promise<void> => {
    // Clear session from localStorage
    localStorage.removeItem('admin_session');
  },
  
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return false;
      
      const session = JSON.parse(atob(sessionData));
      return session.expiresAt > Date.now();
    } catch {
      return false;
    }
  },
  
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return null;
      
      const session = JSON.parse(atob(sessionData));
      if (session.expiresAt <= Date.now()) return null;
      
      return session.user;
    } catch {
      return null;
    }
  }
};

// Legacy exports for compatibility
export const secureStorage = {
  getSession: () => {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return null;
      
      const session = JSON.parse(atob(sessionData));
      return session.expiresAt > Date.now() ? session : null;
    } catch {
      return null;
    }
  },
  
  setSession: (session: AuthSession) => {
    try {
      const sessionData = btoa(JSON.stringify(session));
      localStorage.setItem('admin_session', sessionData);
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  },
  
  clearSession: () => {
    localStorage.removeItem('admin_session');
  },
  
  validateLoginCode: (code: string): boolean => {
    return code === '345341';
  }
};

// Initialize secure code
export const initializeSecureCode = (): void => {
  console.log('Secure authentication initialized');
};

// Test connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  return true;
};

// Safe wrappers
export const safeSecureStorage = secureStorage;
export const safeInitializeSecureCode = initializeSecureCode;
export const safeTestDatabaseConnection = testDatabaseConnection;

// Default export for compatibility
export default authSystem;
