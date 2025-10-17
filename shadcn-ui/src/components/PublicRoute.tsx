import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface PublicRouteProps {
  children: React.ReactNode
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, profile, loading, profileLoading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Checking session...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated and email is confirmed, redirect to dashboard
  if (user && user.email_confirmed_at && profile) {
    // Redirect based on user role
    const dashboardPath = profile.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'
    return <Navigate to={dashboardPath} replace />
  }

  // User is not authenticated, show the public page
  return <>{children}</>
}
