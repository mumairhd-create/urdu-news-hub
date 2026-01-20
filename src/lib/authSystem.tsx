// 6-Digit Code System with Route Protection
// Secure authentication system with route guards

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string;
  attempts: number;
  isLocked: boolean;
  lockTimeRemaining: number;
}

// Security configuration
const SECURITY_CONFIG = {
  CODE_LENGTH: 6,
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_DURATION: 2 * 60 * 60 * 1000, // 2 hours
};

// Hardcoded admin code (can be changed in settings)
const ADMIN_CODE = '345341';

// Session management
class SessionManager {
  private static instance: SessionManager;
  private sessionTimer: NodeJS.Timeout | null = null;

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  createSession(user: AuthUser): void {
    const session = {
      user,
      expiresAt: Date.now() + SECURITY_CONFIG.SESSION_DURATION,
      createdAt: Date.now()
    };
    localStorage.setItem('admin_session', JSON.stringify(session));
    this.startSessionTimer();
  }

  getSession(): { user: AuthUser | null; expiresAt: number } | null {
    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData);
      
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      
      return session;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem('admin_session');
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  isSessionValid(): boolean {
    const session = this.getSession();
    return session !== null && Date.now() < session.expiresAt;
  }

  private startSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    const session = this.getSession();
    if (!session) return;

    const timeRemaining = session.expiresAt - Date.now();
    if (timeRemaining > 0) {
      this.sessionTimer = setTimeout(() => {
        this.clearSession();
        window.location.reload(); // Force logout
      }, timeRemaining);
    }
  }
}

// Attempt tracking
class AttemptTracker {
  private static instance: AttemptTracker;

  static getInstance(): AttemptTracker {
    if (!AttemptTracker.instance) {
      AttemptTracker.instance = new AttemptTracker();
    }
    return AttemptTracker.instance;
  }

  recordAttempt(success: boolean): void {
    const attempts = this.getAttempts();
    attempts.push({
      timestamp: Date.now(),
      success,
      ip: 'client', // In production, get real IP
      userAgent: navigator.userAgent
    });

    // Keep only last 50 attempts
    const recentAttempts = attempts.slice(-50);
    localStorage.setItem('login_attempts', JSON.stringify(recentAttempts));
  }

  getAttempts(): Array<{ timestamp: number; success: boolean; ip: string; userAgent: string }> {
    try {
      const stored = localStorage.getItem('login_attempts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getFailedAttemptsCount(): number {
    const attempts = this.getAttempts();
    const recentFailed = attempts.filter(a => 
      !a.success && 
      (Date.now() - a.timestamp) < SECURITY_CONFIG.LOCKOUT_DURATION
    );
    return recentFailed.length;
  }

  isLockedOut(): boolean {
    return this.getFailedAttemptsCount() >= SECURITY_CONFIG.MAX_ATTEMPTS;
  }

  getLockTimeRemaining(): number {
    const attempts = this.getAttempts();
    const failedAttempts = attempts.filter(a => 
      !a.success && 
      (Date.now() - a.timestamp) < SECURITY_CONFIG.LOCKOUT_DURATION
    );
    
    if (failedAttempts.length < SECURITY_CONFIG.MAX_ATTEMPTS) return 0;
    
    const oldestFailedAttempt = failedAttempts[0];
    const lockEndTime = oldestFailedAttempt.timestamp + SECURITY_CONFIG.LOCKOUT_DURATION;
    return Math.max(0, lockEndTime - Date.now());
  }

  clearAttempts(): void {
    localStorage.removeItem('login_attempts');
  }
}

// 6-Digit Code Validator
class CodeValidator {
  static validateCode(code: string): { valid: boolean; reason?: string } {
    // Check length
    if (code.length !== SECURITY_CONFIG.CODE_LENGTH) {
      return { 
        valid: false, 
        reason: `Code must be exactly ${SECURITY_CONFIG.CODE_LENGTH} digits` 
      };
    }

    // Check if all digits
    if (!/^\d+$/.test(code)) {
      return { 
        valid: false, 
        reason: 'Code must contain only numbers' 
      };
    }

    // Check if code matches admin code
    if (code !== ADMIN_CODE) {
      return { 
        valid: false, 
        reason: 'Invalid code' 
      };
    }

    return { valid: true };
  }
}

// Authentication Hook (without navigation)
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: '',
    attempts: 0,
    isLocked: false,
    lockTimeRemaining: 0
  });

  // Initialize auth state
  useEffect(() => {
    const sessionManager = SessionManager.getInstance();
    const attemptTracker = AttemptTracker.getInstance();
    
    // Check existing session
    if (sessionManager.isSessionValid()) {
      const session = sessionManager.getSession()!;
      setAuthState({
        isAuthenticated: true,
        user: session.user,
        isLoading: false,
        error: '',
        attempts: attemptTracker.getFailedAttemptsCount(),
        isLocked: attemptTracker.isLockedOut(),
        lockTimeRemaining: attemptTracker.getLockTimeRemaining()
      });
    } else {
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, []);

  // Update lockout timer
  useEffect(() => {
    if (authState.isLocked && authState.lockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setAuthState(prev => ({
          ...prev,
          isLocked: false,
          lockTimeRemaining: 0,
          attempts: 0,
          error: ''
        }));
      }, authState.lockTimeRemaining);

      return () => clearTimeout(timer);
    }
  }, [authState.isLocked, authState.lockTimeRemaining]);

  const login = async (code: string): Promise<boolean> => {
    const sessionManager = SessionManager.getInstance();
    const attemptTracker = AttemptTracker.getInstance();

    setAuthState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      // Check if locked out
      if (attemptTracker.isLockedOut()) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Account temporarily locked. Please try again later.',
          isLocked: true,
          lockTimeRemaining: attemptTracker.getLockTimeRemaining()
        }));
        return false;
      }

      // Validate code
      const validation = CodeValidator.validateCode(code);
      
      if (!validation.valid) {
        attemptTracker.recordAttempt(false);
        const failedAttempts = attemptTracker.getFailedAttemptsCount();
        
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: validation.reason || 'Invalid code',
          attempts: failedAttempts,
          isLocked: failedAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS,
          lockTimeRemaining: failedAttempts >= SECURITY_CONFIG.MAX_ATTEMPTS ? attemptTracker.getLockTimeRemaining() : 0
        }));
        return false;
      }

      // Success
      attemptTracker.recordAttempt(true);
      attemptTracker.clearAttempts();

      const user: AuthUser = {
        id: 'admin-user',
        email: 'admin@system.local',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      sessionManager.createSession(user);

      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: '',
        attempts: 0,
        isLocked: false,
        lockTimeRemaining: 0
      });

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Authentication failed',
        attempts: prev.attempts + 1
      }));
      return false;
    }
  };

  const logout = () => {
    const sessionManager = SessionManager.getInstance();
    const attemptTracker = AttemptTracker.getInstance();
    
    sessionManager.clearSession();
    attemptTracker.clearAttempts();
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: '',
      attempts: 0,
      isLocked: false,
      lockTimeRemaining: 0
    });
  };

  return {
    ...authState,
    login,
    logout,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user
  };
};

// Authentication Hook with navigation (for components inside Router)
export const useAuth = () => {
  const authState = useAuthState();
  const navigate = useNavigate();

  const logout = () => {
    authState.logout();
    navigate('/login');
  };

  return {
    ...authState,
    logout
  };
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?return=${encodeURIComponent(location.pathname + location.search)}`, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
};

// Public Route Component (redirects authenticated users)
interface PublicRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, fallback = '/admin' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(fallback, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, fallback]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
};

// Admin Route Component (admin-only access)
interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
};

// Route Guard Hook
export const useRouteGuard = (requiredRole?: string) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (requiredRole && user?.role !== requiredRole) {
        navigate('/unauthorized');
      }
    }
  }, [isAuthenticated, user, requiredRole, isLoading, navigate]);

  return {
    canAccess: isAuthenticated && (!requiredRole || user?.role === requiredRole),
    isLoading
  };
};

// Auth Context
interface AuthContextType {
  authState: AuthState;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authHook = useAuthState();

  const contextValue: AuthContextType = {
    authState: authHook,
    login: authHook.login,
    logout: authHook.logout,
    isAuthenticated: authHook.isAuthenticated,
    user: authHook.user
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

// Export constants
export { SECURITY_CONFIG, ADMIN_CODE };
