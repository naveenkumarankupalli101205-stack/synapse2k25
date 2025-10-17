import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Clock, Award, Users, Target } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  const stats = [
    {
      icon: BookOpen,
      title: 'Courses Enrolled',
      value: '12',
      description: 'Active learning paths'
    },
    {
      icon: TrendingUp,
      title: 'Progress',
      value: '68%',
      description: 'Overall completion'
    },
    {
      icon: Clock,
      title: 'Study Time',
      value: '24h',
      description: 'This month'
    },
    {
      icon: Award,
      title: 'Certificates',
      value: '3',
      description: 'Earned this year'
    }
  ]

  const recentCourses = [
    {
      title: 'Advanced React Development',
      progress: 75,
      nextLesson: 'State Management with Redux'
    },
    {
      title: 'Machine Learning Fundamentals',
      progress: 45,
      nextLesson: 'Neural Networks Introduction'
    },
    {
      title: 'UI/UX Design Principles',
      progress: 90,
      nextLesson: 'Final Project Review'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Ready to continue your learning journey?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                      <p className="text-xs text-gray-600">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Continue Learning</span>
                </CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course, index) => (
                  <div key={course.title} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <span className="text-sm text-gray-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Next: {course.nextLesson}
                    </p>
                    <Button size="sm" className="w-full">
                      Continue Course
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Join Study Group
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Award className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Streak</CardTitle>
                <CardDescription>
                  Keep up the great work!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">🔥 7</div>
                  <p className="text-sm text-gray-600">Days in a row</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}