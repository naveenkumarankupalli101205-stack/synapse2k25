import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

export const Navbar = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SmartLearn
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {location.pathname !== '/login' && (
                  <Button asChild variant="ghost">
                    <Link to="/login">Sign In</Link>
                  </Button>
                )}
                {location.pathname !== '/register' && (
                  <Button asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}