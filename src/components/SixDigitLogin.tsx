// 6-Digit Code Login Component
// Secure login interface with code input

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/lib/authSystem';
import { Shield, Lock, RefreshCw, AlertTriangle } from 'lucide-react';

export const SixDigitLogin: React.FC = () => {
  const { language } = useLanguage();
  const { login, isLoading, error, attempts, isLocked, lockTimeRemaining } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get return URL from search params
  const returnUrl = searchParams.get('return') || '/admin';

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  // Lockout timer
  useEffect(() => {
    if (isLocked && lockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        // Timer will be handled by useAuth hook
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLocked, lockTimeRemaining]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    
    if (digits.length === 6) {
      setCode(digits);
      handleSubmit(digits.join(''));
    }
  };

  const handleSubmit = async (enteredCode?: string) => {
    const submitCode = enteredCode || code.join('');
    
    if (isLocked) {
      setLocalError(language === 'ur' ? 'اکاؤنٹ عارضی طور پر لاک ہے' : 'Account is temporarily locked');
      return;
    }

    if (submitCode.length !== 6) {
      setLocalError(language === 'ur' ? 'تمام 6 ہندسے درج کریں' : 'Please enter all 6 digits');
      return;
    }

    setLocalError('');

    try {
      const success = await login(submitCode);
      if (success) {
        navigate(returnUrl, { replace: true });
      }
    } catch (error) {
      setLocalError(language === 'ur' ? 'لاگ ان ناکام' : 'Login failed');
    }
  };

  const handleClearCode = () => {
    setCode(['', '', '', '', '', '']);
    setLocalError('');
    inputRefs.current[0]?.focus();
  };

  const formatLockTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {language === 'ur' ? 'ایڈمن لاگ ان' : 'Admin Login'}
          </CardTitle>
          <CardDescription>
            {language === 'ur' ? '6 ہندسوں کا کوڈ درج کریں' : 'Enter 6-digit code'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Code Input */}
          <div className="space-y-4">
            <Label className="text-center block">
              {language === 'ur' ? 'لاگ ان کوڈ' : 'Login Code'}
            </Label>
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  disabled={isLocked || isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Error Messages */}
          {(error || localError) && (
            <Alert variant={isLocked ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error || localError}</AlertDescription>
            </Alert>
          )}

          {/* Lockout Timer */}
          {isLocked && (
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                {language === 'ur' ? 'لاک ٹائمر:' : 'Lock Timer:'} {formatLockTime(lockTimeRemaining)}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => handleSubmit()}
              className="w-full" 
              disabled={isLoading || isLocked || code.join('').length !== 6}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {language === 'ur' ? 'تصدیق ہو رہی ہے...' : 'Verifying...'}
                </div>
              ) : (
                language === 'ur' ? 'لاگ ان کریں' : 'Login'
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={handleClearCode}
              className="w-full"
              disabled={isLoading || isLocked}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'ur' ? 'صاف کریں' : 'Clear'}
            </Button>
          </div>

          {/* Security Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              {language === 'ur' ? '6 ہندسوں کا محفوظ کوڈ' : 'Secure 6-digit code'}
            </p>
            <p className="mt-1">
              {language === 'ur' ? 'سیکیورٹی کی وجہ سے کوڈ نہیں دکھایا جا رہا' : 'Code hidden for security'}
            </p>
          </div>

          {/* Attempts Info */}
          {attempts > 0 && !isLocked && (
            <div className="text-center text-xs text-orange-600">
              <p>
                {language === 'ur' ? `کوششیں: ${attempts}/5` : `Attempts: ${attempts}/5`}
              </p>
              <p className="mt-1">
                {language === 'ur' ? '5 غلط کوششوں کے بعد لاک ہو جائے گا' : 'Locked after 5 failed attempts'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
