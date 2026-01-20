// Error handling wrapper for secure auth
import { secureStorage, validateLoginAttempt, createSession, initializeSecureCode } from './secureAuth';

export const safeSecureStorage = {
  getLoginCode: (): string => {
    try {
      return secureStorage.getLoginCode();
    } catch (error) {
      console.error('Error getting login code:', error);
      return '';
    }
  },

  setLoginCode: (code: string): void => {
    try {
      secureStorage.setLoginCode(code);
    } catch (error) {
      console.error('Error setting login code:', error);
    }
  },

  getSession: () => {
    try {
      return secureStorage.getSession();
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  setSession: (session: any): void => {
    try {
      secureStorage.setSession(session);
    } catch (error) {
      console.error('Error setting session:', error);
    }
  },

  clearSession: (): void => {
    try {
      secureStorage.clearSession();
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  },

  isLockedOut: (): boolean => {
    try {
      return secureStorage.isLockedOut();
    } catch (error) {
      console.error('Error checking lockout status:', error);
      return false;
    }
  },

  getLockoutTime: (): number => {
    try {
      return secureStorage.getLockoutTime();
    } catch (error) {
      console.error('Error getting lockout time:', error);
      return 0;
    }
  },

  logAttempt: (attempt: any): void => {
    try {
      secureStorage.logAttempt(attempt);
    } catch (error) {
      console.error('Error logging attempt:', error);
    }
  },

  getAttempts: () => {
    try {
      return secureStorage.getAttempts();
    } catch (error) {
      console.error('Error getting attempts:', error);
      return [];
    }
  },

  clearAttempts: (): void => {
    try {
      secureStorage.clearAttempts();
    } catch (error) {
      console.error('Error clearing attempts:', error);
    }
  }
};

export const safeValidateLoginAttempt = (code: string) => {
  try {
    return validateLoginAttempt(code);
  } catch (error) {
    console.error('Error validating login attempt:', error);
    return { valid: false, reason: 'Validation system error' };
  }
};

export const safeCreateSession = (user: any) => {
  try {
    return createSession(user);
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

export const safeInitializeSecureCode = () => {
  try {
    initializeSecureCode();
  } catch (error) {
    console.error('Error initializing secure code:', error);
  }
};
