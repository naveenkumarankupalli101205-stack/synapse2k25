import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetEmailSent, setResetEmailSent] = useState(false)
  
  const { signIn, resetPassword, isDemoMode, user, profile, profileLoading } = useAuth()
  const navigate = useNavigate()

  // Handle role-based redirection after login
  useEffect(() => {
    if (user && user.email_confirmed_at && profile && !profileLoading) {
      console.log('Redirecting user with role:', profile.role)
      
      if (profile.role === 'teacher') {
        navigate('/teacher-dashboard', { replace: true })
        toast.success(`Welcome back, ${profile.name}! 👨‍🏫`)
      } else if (profile.role === 'student') {
        navigate('/student-dashboard', { replace: true })
        toast.success(`Welcome back, ${profile.name}! 🎓`)
      } else {
        // Handle invalid role
        setError('Invalid user role. Please contact support.')
        toast.error('Invalid user role detected')
      }
    }
  }, [user, profile, profileLoading, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isDemoMode) {
      setError('Demo mode: Please set up Supabase to enable authentication.')
      setLoading(false)
      return
    }

    try {
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Please verify your email address before signing in. Check your inbox for the verification link.')
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else {
          setError(error.message)
        }
        toast.error('Login failed')
      } else {
        // Don't show success message here - it will be shown after profile is loaded and redirect happens
        console.log('Login successful, waiting for profile data...')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first')
      return
    }

    if (isDemoMode) {
      setError('Demo mode: Please set up Supabase to enable password reset.')
      return
    }

    try {
      const { error } = await resetPassword(formData.email)
      if (error) {
        setError(error.message)
        toast.error('Failed to send reset email')
      } else {
        setResetEmailSent(true)
        toast.success('Password reset email sent!')
      }
    } catch (err) {
      setError('Failed to send reset email')
      toast.error('Failed to send reset email')
    }
  }

  // Show loading state while profile is being fetched after successful login
  if (user && user.email_confirmed_at && profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Loading your dashboard...</h2>
                <p className="text-gray-600">Please wait while we set up your personalized experience.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">SL</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your SmartLearn account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetEmailSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Check Your Email</h3>
                <p className="text-gray-600">
                  We've sent a password reset link to {formData.email}
                </p>
                <Button
                  onClick={() => setResetEmailSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-lg"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="rounded-lg pr-10"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm"
                    onClick={handleResetPassword}
                    disabled={isDemoMode || loading}
                  >
                    Forgot password?
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-lg"
                  disabled={loading || isDemoMode}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            )}

            {!resetEmailSent && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Create one
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}