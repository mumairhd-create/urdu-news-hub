// Secure Authentication Utilities
// Enhanced security for admin login system

export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  expiresAt: number;
  createdAt: number;
}

export interface LoginAttempt {
  timestamp: number;
  ip: string;
  userAgent: string;
  success: boolean;
  reason?: string;
}

export interface SecurityConfig {
  maxAttempts: number;
  lockoutDuration: number;
  sessionDuration: number;
  codeLength: number;
}

// Security configuration
export const SECURITY_CONFIG: SecurityConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionDuration: 2 * 60 * 60 * 1000, // 2 hours
  codeLength: 6
};

// Simple encryption for localStorage (basic obfuscation)
const simpleEncrypt = (text: string): string => {
  try {
    // Convert to base64 with proper Unicode handling
    return btoa(unescape(encodeURIComponent(text.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) + i + 1)
    ).join(''))));
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

const simpleDecrypt = (encrypted: string): string => {
  try {
    // Handle Unicode properly in decryption
    const decoded = decodeURIComponent(escape(atob(encrypted)));
    return decoded.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) - i - 1)
    ).join('');
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

// Generate secure random code
export const generateSecureCode = (length: number = 6): string => {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate session token
export const generateSessionToken = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return btoa(timestamp + '|' + random);
};

// Verify session token
export const verifySessionToken = (token: string): boolean => {
  try {
    const decoded = atob(token);
    const parts = decoded.split('|');
    if (parts.length < 1) return false;
    
    const timestamp = parts[0];
    const tokenTime = parseInt(timestamp);
    const now = Date.now();
    
    // Check if token is not expired (2 hours)
    return (now - tokenTime) < SECURITY_CONFIG.sessionDuration;
  } catch {
    return false;
  }
};

// Secure storage utilities
export const secureStorage = {
  setLoginCode: (code: string): void => {
    try {
      const encrypted = simpleEncrypt(code);
      if (encrypted) {
        localStorage.setItem('admin_login_code', encrypted);
        localStorage.setItem('code_updated', Date.now().toString());
      }
    } catch (error) {
      console.error('Failed to encrypt login code:', error);
    }
  },

  getLoginCode: (): string => {
    try {
      const encrypted = localStorage.getItem('admin_login_code');
      if (!encrypted) return '';
      return simpleDecrypt(encrypted);
    } catch (error) {
      console.error('Failed to decrypt login code:', error);
      return '';
    }
  },

  setSession: (session: AuthSession): void => {
    try {
      const sessionData = JSON.stringify(session);
      const encrypted = simpleEncrypt(sessionData);
      if (encrypted) {
        localStorage.setItem('admin_session', encrypted);
      }
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  },

  getSession: (): AuthSession | null => {
    try {
      const encrypted = localStorage.getItem('admin_session');
      if (!encrypted) return null;
      
      const sessionData = simpleDecrypt(encrypted);
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData) as AuthSession;
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        secureStorage.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      secureStorage.clearSession();
      return null;
    }
  },

  clearSession: (): void => {
    localStorage.removeItem('admin_session');
  },

  // Login attempt tracking
  logAttempt: (attempt: LoginAttempt): void => {
    try {
      const attempts = secureStorage.getAttempts();
      attempts.push(attempt);
      
      // Keep only last 50 attempts
      const recentAttempts = attempts.slice(-50);
      localStorage.setItem('login_attempts', JSON.stringify(recentAttempts));
    } catch (error) {
      console.error('Failed to log attempt:', error);
    }
  },

  getAttempts: (): LoginAttempt[] => {
    try {
      const stored = localStorage.getItem('login_attempts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  clearAttempts: (): void => {
    localStorage.removeItem('login_attempts');
  },

  // Check if user is locked out
  isLockedOut: (): boolean => {
    const attempts = secureStorage.getAttempts();
    const failedAttempts = attempts
      .filter((a: LoginAttempt) => !a.success)
      .filter((a: LoginAttempt) => Date.now() - a.timestamp < SECURITY_CONFIG.lockoutDuration);
    
    return failedAttempts.length >= SECURITY_CONFIG.maxAttempts;
  },

  getLockoutTime: (): number => {
    const attempts = secureStorage.getAttempts();
    const failedAttempts = attempts
      .filter((a: LoginAttempt) => !a.success)
      .filter((a: LoginAttempt) => Date.now() - a.timestamp < SECURITY_CONFIG.lockoutDuration);
    
    if (failedAttempts.length < SECURITY_CONFIG.maxAttempts) return 0;
    
    const oldestFailedAttempt = failedAttempts[0];
    if (!oldestFailedAttempt) return 0;
    
    const lockEndTime = oldestFailedAttempt.timestamp + SECURITY_CONFIG.lockoutDuration;
    return Math.max(0, lockEndTime - Date.now());
  }
};

// Initialize secure default code on first run
export const initializeSecureCode = (): void => {
  // Set hardcoded secure code (hidden from console)
  const hardcodedCode = '345341';
  secureStorage.setLoginCode(hardcodedCode);
  localStorage.setItem('code_updated', Date.now().toString());
  // Console log removed for security
};

// Validate login attempt
export const validateLoginAttempt = (code: string): { valid: boolean; reason?: string } => {
  // Check if locked out
  if (secureStorage.isLockedOut()) {
    return { valid: false, reason: 'Account temporarily locked due to too many failed attempts' };
  }

  // Check code format
  if (code.length !== SECURITY_CONFIG.codeLength) {
    return { valid: false, reason: `Code must be exactly ${SECURITY_CONFIG.codeLength} digits` };
  }

  if (!/^\d+$/.test(code)) {
    return { valid: false, reason: 'Code must contain only numbers' };
  }

  const storedCode = secureStorage.getLoginCode();
  if (code !== storedCode) {
    return { valid: false, reason: 'Invalid login code' };
  }

  return { valid: true };
};

// Create authenticated session
export const createSession = (user: { id: string; email: string; role: string }): AuthSession => {
  const now = Date.now();
  return {
    token: generateSessionToken(),
    user,
    createdAt: now,
    expiresAt: now + SECURITY_CONFIG.sessionDuration
  };
};
