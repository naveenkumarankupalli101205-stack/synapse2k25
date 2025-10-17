import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/utils/supabase'
import { Course, Assignment, Submission, Enrollment } from '@/types/database'
import { motion } from 'framer-motion'
import { BookOpen, ClipboardList, Award, TrendingUp, Eye, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { profile } = useProfile()
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch enrolled courses
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses(
            *,
            profiles(name)
          )
        `)
        .eq('student_id', profile?.id)
        .order('enrolled_at', { ascending: false })

      if (enrollmentsError) throw enrollmentsError

      const courses = enrollmentsData?.map(e => ({
        ...e.courses,
        teacher: e.courses?.profiles
      })) || []

      // Fetch assignments for enrolled courses
      const courseIds = courses.map(c => c.id)
      let assignmentsData = []
      
      if (courseIds.length > 0) {
        const { data, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            *,
            courses(title),
            submissions(id, grade, submitted_at)
          `)
          .in('course_id', courseIds)
          .order('due_date', { ascending: true })
          .limit(5)

        if (assignmentsError) throw assignmentsError
        assignmentsData = data || []
      }

      // Fetch recent submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          assignments(
            title,
            courses(title)
          )
        `)
        .eq('student_id', profile?.id)
        .order('submitted_at', { ascending: false })
        .limit(5)

      if (submissionsError) throw submissionsError

      setEnrolledCourses(courses)
      setAssignments(assignmentsData)
      setSubmissions(submissionsData || [])
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data'
      toast.error(errorMessage)
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedAssignments = submissions.filter(s => s.grade !== null).length
  const pendingAssignments = assignments.filter(a => !a.submissions || a.submissions.length === 0).length
  const averageGrade = submissions.length > 0 
    ? Math.round(submissions.filter(s => s.grade !== null).reduce((sum, s) => sum + (s.grade || 0), 0) / submissions.filter(s => s.grade !== null).length)
    : 0

  const stats = [
    {
      icon: BookOpen,
      title: 'Enrolled Courses',
      value: enrolledCourses.length.toString(),
      description: 'Active enrollments'
    },
    {
      icon: ClipboardList,
      title: 'Pending Tasks',
      value: pendingAssignments.toString(),
      description: 'Assignments due'
    },
    {
      icon: Award,
      title: 'Completed',
      value: completedAssignments.toString(),
      description: 'Assignments done'
    },
    {
      icon: TrendingUp,
      title: 'Average Grade',
      value: averageGrade > 0 ? `${averageGrade}%` : 'N/A',
      description: 'Overall performance'
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
            Welcome back, {profile?.name}! 🎓
          </h1>
          <p className="text-lg text-gray-600">
            Continue your learning journey
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
          {/* Enrolled Courses */}
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
                    Continue your learning
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/student/courses">
                    Browse Courses
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No courses enrolled yet. Browse available courses!</p>
                  </div>
                ) : (
                  enrolledCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/student/courses/${course.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.description || 'No description'}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>by {course.teacher?.name}</span>
                        <span>{course.duration || 0} hours</span>
                      </div>
                    </div>
                  ))
                )}
                {enrolledCourses.length > 3 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/student/courses">View All Courses</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Assignments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClipboardList className="w-5 h-5" />
                  <span>Upcoming Assignments</span>
                </CardTitle>
                <CardDescription>
                  Complete your assignments on time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No assignments available</p>
                  </div>
                ) : (
                  assignments.map((assignment) => {
                    const isSubmitted = assignment.submissions && assignment.submissions.length > 0
                    const submission = assignment.submissions?.[0]
                    
                    return (
                      <div key={assignment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-600">{assignment.courses?.title}</p>
                          </div>
                          {isSubmitted ? (
                            <div className="text-right">
                              {submission?.grade !== null ? (
                                <span className="text-sm font-medium text-green-600">
                                  Grade: {submission.grade}%
                                </span>
                              ) : (
                                <span className="text-sm text-blue-600">Submitted</span>
                              )}
                            </div>
                          ) : (
                            <Button asChild size="sm">
                              <Link to={`/student/assignments/${assignment.id}`}>
                                <Upload className="w-4 h-4 mr-2" />
                                Submit
                              </Link>
                            </Button>
                          )}
                        </div>
                        {assignment.due_date && (
                          <p className="text-xs text-gray-500">
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )
                  })
                )}
                {assignments.length > 0 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/student/assignments">View All Assignments</Link>
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