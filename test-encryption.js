// Test encryption/decryption fix
// Run this in browser console to test

console.log('🧪 Testing Encryption Fix...');

try {
  // Test simple encryption
  const testText = '345341';
  console.log('Original:', testText);
  
  // Test encryption
  const encrypted = window.simpleEncrypt?.(testText);
  console.log('Encrypted:', encrypted);
  
  // Test decryption
  const decrypted = window.simpleDecrypt?.(encrypted);
  console.log('Decrypted:', decrypted);
  
  // Verify they match
  if (testText === decrypted) {
    console.log('✅ Encryption/Decryption working correctly!');
  } else {
    console.log('❌ Encryption/Decryption failed!');
  }
  
} catch (error) {
  console.error('❌ Test failed:', error);
}

// Test session creation
try {
  const testSession = {
    token: 'test-token-123',
    user: { id: 'test', email: 'test@test.com', role: 'admin' },
    expiresAt: Date.now() + 3600000,
    createdAt: Date.now()
  };
  
  console.log('Testing session storage...');
  const sessionCreated = window.safeSecureStorage?.setSession?.(testSession);
  const sessionRetrieved = window.safeSecureStorage?.getSession?.();
  
  if (sessionRetrieved && sessionRetrieved.user.email === testSession.user.email) {
    console.log('✅ Session storage working!');
  } else {
    console.log('❌ Session storage failed!');
  }
  
} catch (error) {
  console.error('❌ Session test failed:', error);
}
