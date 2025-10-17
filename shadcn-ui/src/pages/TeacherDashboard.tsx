import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/utils/supabase'
import { Course, Assignment, Submission } from '@/types/database'
import { motion } from 'framer-motion'
import { BookOpen, Users, ClipboardList, Award, Plus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
  const { profile } = useProfile()
  const [courses, setCourses] = useState<Course[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch teacher's courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments(count)
        `)
        .eq('created_by', profile?.id)
        .order('created_at', { ascending: false })

      if (coursesError) throw coursesError

      // Fetch recent assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          courses(title)
        `)
        .eq('created_by', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (assignmentsError) throw assignmentsError

      // Fetch recent submissions for grading
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          assignments!inner(
            title,
            courses!inner(created_by)
          ),
          profiles(name)
        `)
        .eq('assignments.courses.created_by', profile?.id)
        .is('grade', null)
        .order('submitted_at', { ascending: false })
        .limit(5)

      if (submissionsError) throw submissionsError

      setCourses(coursesData || [])
      setAssignments(assignmentsData || [])
      setSubmissions(submissionsData || [])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data'
      toast.error(errorMessage)
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      icon: BookOpen,
      title: 'My Courses',
      value: courses.length.toString(),
      description: 'Active courses'
    },
    {
      icon: Users,
      title: 'Total Students',
      value: courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0).toString(),
      description: 'Enrolled students'
    },
    {
      icon: ClipboardList,
      title: 'Assignments',
      value: assignments.length.toString(),
      description: 'Created assignments'
    },
    {
      icon: Award,
      title: 'Pending Grades',
      value: submissions.length.toString(),
      description: 'Need grading'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
            Welcome back, {profile?.name}! 👨‍🏫
          </h1>
          <p className="text-lg text-gray-600">
            Manage your courses and help students succeed
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>My Courses</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your courses and content
                  </CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link to="/teacher/courses/new">
                    <Plus className="w-4 h-4 mr-2" />
                    New Course
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No courses yet. Create your first course!</p>
                  </div>
                ) : (
                  courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/teacher/courses/${course.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.description || 'No description'}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{course.enrollment_count || 0} students</span>
                        <span>{course.duration || 0} hours</span>
                      </div>
                    </div>
                  ))
                )}
                {courses.length > 3 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/teacher/courses">View All Courses</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending Submissions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Pending Grades</span>
                </CardTitle>
                <CardDescription>
                  Submissions waiting for your review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No submissions to grade</p>
                  </div>
                ) : (
                  submissions.map((submission) => (
                    <div key={submission.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {submission.assignment?.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            by {submission.student?.name}
                          </p>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/teacher/submissions/${submission.id}`}>
                            Grade
                          </Link>
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
                {submissions.length > 0 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/teacher/submissions">View All Submissions</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}