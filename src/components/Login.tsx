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
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await auth.loginWithCode(code)
      if (user?.id) {
        onLogin({
          id: user.id,
          email: user.email || 'admin@umarmedia.dev',
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
              <Label htmlFor="code">
                {language === 'ur' ? '6 ڈیجٹ کوڈ' : '6 Digit Code'}
              </Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setCode(value)
                }}
                placeholder="123456"
                maxLength={6}
                pattern="\d{6}"
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
              disabled={loading || code.length !== 6}
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
              {language === 'ur' ? 'ڈیفالٹ کوڈ:' : 'Default Code:'}
            </p>
            <p className="font-mono text-xs mt-1">
              123456
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
