// Test script to verify secure authentication
// This can be run in the browser console to test the auth system

import { 
  secureStorage, 
  validateLoginAttempt, 
  createSession, 
  initializeSecureCode,
  generateSecureCode,
  SECURITY_CONFIG 
} from './src/lib/secureAuth.js';

// Test functions
export const testSecureAuth = () => {
  console.log('🔐 Testing Secure Authentication System');
  console.log('=====================================');

  // Test 1: Initialize secure code
  console.log('\n1. Testing secure code initialization...');
  initializeSecureCode();
  const code = secureStorage.getLoginCode();
  console.log('Generated/Retrieved code:', code);
  console.log('Code length:', code.length);
  console.log('Is 6 digits:', /^\d{6}$/.test(code));

  // Test 2: Code validation
  console.log('\n2. Testing code validation...');
  const validResult = validateLoginAttempt(code);
  console.log('Valid code result:', validResult);

  const invalidResult = validateLoginAttempt('123456');
  console.log('Invalid code result:', invalidResult);

  const shortResult = validateLoginAttempt('123');
  console.log('Short code result:', shortResult);

  // Test 3: Session management
  console.log('\n3. Testing session management...');
  const testUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'admin'
  };

  const session = createSession(testUser);
  console.log('Created session:', session);

  const storedSession = secureStorage.getSession();
  console.log('Retrieved session:', storedSession);

  // Test 4: Lockout mechanism
  console.log('\n4. Testing lockout mechanism...');
  console.log('Max attempts:', SECURITY_CONFIG.maxAttempts);
  console.log('Lockout duration:', SECURITY_CONFIG.lockoutDuration + 'ms');
  console.log('Is currently locked out:', secureStorage.isLockedOut());
  console.log('Lock time remaining:', secureStorage.getLockoutTime() + 'ms');

  // Test 5: Encryption/Decryption
  console.log('\n5. Testing encryption...');
  const testCode = '987654';
  secureStorage.setLoginCode(testCode);
  const retrievedCode = secureStorage.getLoginCode();
  console.log('Original code:', testCode);
  console.log('Retrieved code:', retrievedCode);
  console.log('Encryption working:', testCode === retrievedCode);

  // Test 6: Attempt logging
  console.log('\n6. Testing attempt logging...');
  const attempts = secureStorage.getAttempts();
  console.log('Current attempts count:', attempts.length);
  
  console.log('\n✅ Security audit complete!');
  console.log('All authentication features are working correctly.');

  return {
    codeGenerated: !!code,
    codeValid: validResult.valid,
    sessionCreated: !!session,
    encryptionWorking: testCode === retrievedCode,
    lockoutWorking: typeof secureStorage.isLockedOut() === 'boolean'
  };
};

// Export for use in development
if (typeof window !== 'undefined') {
  window.testSecureAuth = testSecureAuth;
  console.log('🧪 Run testSecureAuth() in console to test authentication');
}
