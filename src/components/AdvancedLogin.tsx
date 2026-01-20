import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/hooks/useLanguage'
import { auth, AuthUser } from '@/lib/auth'
import { Eye, EyeOff, Shield, Lock, User, AlertTriangle, CheckCircle, Fingerprint, Smartphone, Mail } from 'lucide-react'

interface AdvancedLoginProps {
  onLogin: (user: AuthUser) => void
}

export function AdvancedLogin({ onLogin }: AdvancedLoginProps) {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'biometric'>('email')
  const [rememberMe, setRememberMe] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showTwoFactor] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTime, setLockTime] = useState(0)

  // Lockout timer
  useEffect(() => {
    if (isLocked && lockTime > 0) {
      const timer = setTimeout(() => {
        setLockTime(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (lockTime === 0) {
      setIsLocked(false)
      setAttempts(0)
    }
  }, [isLocked, lockTime])

  // Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('admin_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLockout = () => {
    const lockDuration = Math.min(30 * Math.pow(2, attempts), 300) // Max 5 minutes
    setIsLocked(true)
    setLockTime(lockDuration)
    setError(language === 'ur' 
      ? `زیادہ کوششوں کی وجہ سے ${lockTime} سیکنڈ کے لیے لاک ہو گیا ہے` 
      : `Account locked for ${lockTime} seconds due to too many attempts`
    )
  }

  const validateInput = (): boolean => {
    if (!email || !password) {
      setError(language === 'ur' ? 'تمام فیلڈز ضروری ہیں' : 'All fields are required')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError(language === 'ur' ? 'درست ای میل ایڈریس درج کریں' : 'Please enter a valid email address')
      return false
    }

    if (password.length < 6) {
      setError(language === 'ur' ? 'پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے' : 'Password must be at least 6 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLocked) {
      setError(language === 'ur' ? 'اکاؤنٹ عارضی طور پر لاک ہے' : 'Account is temporarily locked')
      return
    }

    if (!validateInput()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const user = await auth.login(email, password)
      
      if (user?.email) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('admin_email', email)
        } else {
          localStorage.removeItem('admin_email')
        }

        // Reset attempts on successful login
        setAttempts(0)
        
        // Show success message
        setError('')
        
        onLogin({
          id: user.id,
          email: user.email,
          role: user.role || 'admin',
          created_at: user.created_at,
          updated_at: user.updated_at
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 
        (language === 'ur' ? 'لاگ ان ناکام ہوا' : 'Login failed')
      
      setError(errorMessage)
      setAttempts(prev => prev + 1)
      
      // Lock account after 3 failed attempts
      if (attempts >= 2) {
        handleLockout()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (role: 'admin' | 'editor' | 'user') => {
    setLoading(true)
    setError('')
    
    try {
      const demoCredentials = {
        admin: { email: 'admin@umarmedia.dev', password: 'admin123' },
        editor: { email: 'editor@umarmedia.dev', password: 'editor123' },
        user: { email: 'user@umarmedia.dev', password: 'user123' }
      }
      
      const creds = demoCredentials[role]
      const user = await auth.login(creds.email, creds.password)
      
      if (user?.email) {
        onLogin({
          id: user.id,
          email: user.email,
          role: user.role || role,
          created_at: user.created_at,
          updated_at: user.updated_at
        })
      }
    } catch (error) {
      setError(language === 'ur' ? 'فاسٹ لاگ ان ناکام' : 'Quick login failed')
    } finally {
      setLoading(false)
    }
  }

  const formatLockTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Panel - Login Form */}
        <Card className="w-full">
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
              {language === 'ur' ? 'اردو نیوز ہب ایڈمن پینل' : 'Urdu News Hub Admin Panel'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Login Method Tabs */}
            <Tabs value={loginMethod} onValueChange={(value: any) => setLoginMethod(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {language === 'ur' ? 'ای میل' : 'Email'}
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  {language === 'ur' ? 'فون' : 'Phone'}
                </TabsTrigger>
                <TabsTrigger value="biometric" className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4" />
                  {language === 'ur' ? 'بائیو میٹرک' : 'Biometric'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {language === 'ur' ? 'ای میل' : 'Email'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@umarmedia.dev"
                      className="mt-1"
                      disabled={isLocked}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {language === 'ur' ? 'پاس ورڈ' : 'Password'}
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="•••••••••"
                        className="pr-10"
                        disabled={isLocked}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLocked}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Two Factor Authentication */}
                  {showTwoFactor && (
                    <div>
                      <Label htmlFor="twofactor">
                        {language === 'ur' ? 'ٹو فیکٹر کوڈ' : '2FA Code'}
                      </Label>
                      <Input
                        id="twofactor"
                        type="text"
                        value={twoFactorCode}
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        placeholder="000000"
                        maxLength={6}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      disabled={isLocked}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      {language === 'ur' ? 'مجھے یاد رکھیں' : 'Remember me'}
                    </Label>
                  </div>

                  {/* Error/Success Messages */}
                  {error && (
                    <Alert variant={isLocked ? "destructive" : "default"}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Lockout Timer */}
                  {isLocked && (
                    <Alert variant="destructive">
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        {language === 'ur' ? 'لاک ٹائمر:' : 'Lock Timer:'} {formatLockTime(lockTime)}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || isLocked}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {language === 'ur' ? 'لاگ ان ہو رہا ہے...' : 'Logging in...'}
                      </div>
                    ) : (
                      language === 'ur' ? 'لاگ ان کریں' : 'Login'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="text-center py-8">
                  <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'ur' ? 'فون لاگ ان جلد دستیاب ہوگا' : 'Phone login coming soon'}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="biometric" className="space-y-4">
                <div className="text-center py-8">
                  <Fingerprint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'ur' ? 'بائیو میٹرک لاگ ان جلد دستیاب ہوگا' : 'Biometric login coming soon'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Quick Login Options */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {language === 'ur' ? 'فاسٹ لاگ ان:' : 'Quick Login:'}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('admin')}
                    disabled={loading}
                    className="text-xs"
                  >
                    {language === 'ur' ? 'ایڈمن' : 'Admin'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('editor')}
                    disabled={loading}
                    className="text-xs"
                  >
                    {language === 'ur' ? 'ایڈیٹر' : 'Editor'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin('user')}
                    disabled={loading}
                    className="text-xs"
                  >
                    {language === 'ur' ? 'یوزر' : 'User'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Security Features */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {language === 'ur' ? 'سیکیورٹی فیچرز' : 'Security Features'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">
                    {language === 'ur' ? 'ٹو فیکٹر احراز' : '2FA Authentication'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ur' ? 'اضافی سیکیورٹی کے لیے 2FA فعال کریں' : 'Enable 2FA for extra security'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">
                    {language === 'ur' ? 'اکاؤنٹ لاک آؤٹ' : 'Account Lockout'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ur' ? '3 ناکام کوششوں کے بعد اکاؤنٹ لاک ہو جاتا ہے' : 'Account locks after 3 failed attempts'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">
                    {language === 'ur' ? 'محفوظ پاس ورڈ' : 'Secure Password'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ur' ? 'مضبوط پاس ورڈ کی ضرورت' : 'Strong password required'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">
                    {language === 'ur' ? 'سیشن مینجمنٹ' : 'Session Management'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ur' ? 'محفوظ سیشن ہینڈلنگ' : 'Secure session handling'}
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium">
                {language === 'ur' ? 'ڈیمو کریڈنشیلز:' : 'Demo Credentials:'}
              </h4>
              <div className="space-y-1 text-sm font-mono">
                <div>
                  <span className="text-muted-foreground">Admin: </span>
                  admin@umarmedia.dev / admin123
                </div>
                <div>
                  <span className="text-muted-foreground">Editor: </span>
                  editor@umarmedia.dev / editor123
                </div>
                <div>
                  <span className="text-muted-foreground">User: </span>
                  user@umarmedia.dev / user123
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                {language === 'ur' ? 'سیکیورٹی ٹپس:' : 'Security Tips:'}
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• {language === 'ur' ? 'اپنا پاس ورڈ کسی سے شیئر نہ کریں' : 'Never share your password'}</li>
                <li>• {language === 'ur' ? 'ہر بار لاگ آؤٹ کریں' : 'Always logout after use'}</li>
                <li>• {language === 'ur' ? 'مضبوط پاس ورڈ استعمال کریں' : 'Use strong passwords'}</li>
                <li>• {language === 'ur' ? '2FA فعال کریں' : 'Enable 2FA when available'}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
