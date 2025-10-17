import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, XCircle, GraduationCap, Users } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'teacher' | 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUp, isDemoMode } = useAuth()
  const navigate = useNavigate()

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    return checks
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const passwordChecks = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordChecks).every(check => check)
  const isEmailValid = validateEmail(formData.email)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleRoleChange = (role: 'teacher' | 'student') => {
    setFormData(prev => ({ ...prev, role }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isDemoMode) {
      setError('Demo mode: Please set up Supabase to enable registration.')
      setLoading(false)
      return
    }

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName, formData.role)
      
      if (error) {
        setError(error.message)
        toast.error(error.message)
      } else {
        setSuccess(true)
        toast.success('Registration successful! Please check your email for verification.')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We've sent a verification link to {formData.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Please click the verification link in your email to activate your {formData.role} account.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Back to Sign In</Link>
              </Button>
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
            <CardTitle className="text-2xl">Join SmartLearn</CardTitle>
            <CardDescription>
              Create your account and start your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                />
              </div>

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
                />
                {formData.email && !isEmailValid && (
                  <p className="text-sm text-red-600">Please enter a valid email address</p>
                )}
              </div>

              <div className="space-y-3">
                <Label>I am a:</Label>
                <RadioGroup value={formData.role} onValueChange={handleRoleChange}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Student</div>
                        <div className="text-sm text-gray-600">Learn from courses and complete assignments</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher" className="flex items-center space-x-2 cursor-pointer flex-1">
                      <Users className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium">Teacher</div>
                        <div className="text-sm text-gray-600">Create courses and manage students</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {formData.password && (
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      {passwordChecks.length ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={passwordChecks.length ? 'text-green-600' : 'text-red-600'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordChecks.uppercase ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={passwordChecks.uppercase ? 'text-green-600' : 'text-red-600'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {passwordChecks.number ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={passwordChecks.number ? 'text-green-600' : 'text-red-600'}>
                        One number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="rounded-lg pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full rounded-lg"
                disabled={loading || !isPasswordValid || !isEmailValid || formData.password !== formData.confirmPassword || isDemoMode}
              >
                {loading ? 'Creating Account...' : `Create ${formData.role} Account`}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}