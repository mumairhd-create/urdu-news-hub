import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/hooks/useLanguage'
import { auth, AuthUser } from '@/lib/auth'

interface LoginProps {
  onLogin: (user: AuthUser) => void
}

export function Login({ onLogin }: LoginProps) {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await auth.login(email, password)
      if (user?.email) {
        onLogin({
          id: user.id,
          email: user.email,
          role: 'admin'
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : (language === 'ur' ? 'لاگ ان ناکام ہوا' : 'Login failed')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {language === 'ur' ? 'ایڈمن لاگ ان' : 'Admin Login'}
          </CardTitle>
          <CardDescription>
            {language === 'ur' ? 'اردو نیوز ہب ایڈمن پینل' : 'Urdu News Hub Admin Panel'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">
                {language === 'ur' ? 'ای میل' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="umarmedia@umar.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">
                {language === 'ur' ? 'پاس ورڈ' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                language === 'ur' ? 'لاگ ان ہو رہا ہے...' : 'Logging in...'
              ) : (
                language === 'ur' ? 'لاگ ان کریں' : 'Login'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              {language === 'ur' ? 'ڈیفالٹ کریڈنشیلز:' : 'Default Credentials:'}
            </p>
            <p className="font-mono text-xs mt-1">
              Email: umarmedia@umar.com
            </p>
            <p className="font-mono text-xs">
              Password: umar4343
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
