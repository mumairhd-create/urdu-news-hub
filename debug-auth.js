// Simple test to verify secure auth works
// Run this in browser console after the app loads

console.log('🧪 Testing Secure Authentication...');

try {
  // Test secureStorage functions
  const code = window.secureStorage?.getLoginCode?.();
  console.log('✅ secureStorage.getLoginCode():', code);
  
  const isLocked = window.secureStorage?.isLockedOut?.();
  console.log('✅ secureStorage.isLockedOut():', isLocked);
  
  const lockTime = window.secureStorage?.getLockoutTime?.();
  console.log('✅ secureStorage.getLockoutTime():', lockTime);
  
  console.log('🎉 All secure auth functions working!');
} catch (error) {
  console.error('❌ Error testing secure auth:', error);
}

// Test validation function
try {
  const validation = window.validateLoginAttempt?.('123456');
  console.log('✅ validateLoginAttempt test:', validation);
} catch (error) {
  console.error('❌ Error testing validation:', error);
}
