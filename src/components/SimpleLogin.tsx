import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLanguage } from '@/hooks/useLanguage'
import { AuthUser } from '@/lib/auth'
import { 
  safeSecureStorage, 
  safeValidateLoginAttempt, 
  safeCreateSession, 
  safeInitializeSecureCode
} from '@/lib/safeAuth'
import { type LoginAttempt } from '@/lib/secureAuth'
import { Shield, Lock, RefreshCw, AlertTriangle } from 'lucide-react'

interface SimpleLoginProps {
  onLogin: (user: AuthUser) => void
}

export function SimpleLogin({ onLogin }: SimpleLoginProps) {
  const { language } = useLanguage()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialize secure code on mount
  useEffect(() => {
    safeInitializeSecureCode()
  }, [])

  // Check lockout status with error handling
  const isLockedOut = useMemo(() => {
    try {
      return safeSecureStorage.isLockedOut();
    } catch (error) {
      console.error('Error checking lockout status:', error);
      return false;
    }
  }, []);

  const lockTimeRemaining = useMemo(() => {
    try {
      return safeSecureStorage.getLockoutTime();
    } catch (error) {
      console.error('Error getting lockout time:', error);
      return 0;
    }
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCodeArray = [...code]
    newCodeArray[index] = value
    setCode(newCodeArray)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newCodeArray.every(digit => digit !== '') && index === 5) {
      handleSubmit(newCodeArray.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const digits = pastedData.split('').filter(char => /\d/.test(char))
    
    if (digits.length === 6) {
      setCode(digits)
      handleSubmit(digits.join(''))
    }
  }

  const handleSubmit = async (enteredCode?: string) => {
    const submitCode = enteredCode || code.join('')
    
    // Create login attempt record
    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      ip: 'client', // In production, get real IP
      userAgent: navigator.userAgent,
      success: false
    }

    setLoading(true)
    setError('')

    try {
      // Validate login attempt
      const validation = safeValidateLoginAttempt(submitCode)
      
      if (!validation.valid) {
        attempt.reason = validation.reason
        safeSecureStorage.logAttempt(attempt)
        throw new Error(validation.reason || 'Invalid code')
      }

      // Successful login
      attempt.success = true
      safeSecureStorage.logAttempt(attempt)
      
      const user: AuthUser = {
        id: 'secure-admin-id',
        email: 'admin@secure.dev',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Create secure session
      const session = safeCreateSession({
        id: user.id,
        email: user.email,
        role: user.role || 'admin'
      })
      
      if (session) {
        safeSecureStorage.setSession(session)
      }

      onLogin(user)
      setCode(['', '', '', '', '', '']) // Reset code
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 
        (language === 'ur' ? 'لاگ ان ناکام' : 'Login failed')
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }


  const formatLockTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60000)
    const secs = Math.floor((seconds % 60000) / 1000)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleClearCode = () => {
    setCode(['', '', '', '', '', ''])
    setError('')
    const firstInput = document.getElementById('code-0')
    firstInput?.focus()
  }

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
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-semibold"
                  disabled={isLockedOut || loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant={isLockedOut ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Lockout Timer */}
          {isLockedOut && (
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
              disabled={loading || isLockedOut || code.join('').length !== 6}
            >
              {loading ? (
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
              disabled={loading || isLockedOut}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'ur' ? 'صاف کریں' : 'Clear'}
            </Button>
          </div>

          {/* Security Info */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              {language === 'ur' ? 'سیکیورٹی کی وجہ سے کوڈ نہیں دکھایا جا رہا' : 'Code hidden for security'}
            </p>
            <p className="mt-1">
              {language === 'ur' ? 'صرف ایڈمن کو کوڈ معلوم ہے' : 'Only admin knows the code'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
