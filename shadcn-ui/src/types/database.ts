export interface Profile {
  id: string
  name: string
  email: string
  role: 'teacher' | 'student'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description?: string
  duration?: number
  created_by: string
  created_at: string
  updated_at: string
  teacher?: Profile
  enrollment_count?: number
  is_enrolled?: boolean
}

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  enrolled_at: string
  student?: Profile
  course?: Course
}

export interface Assignment {
  id: string
  course_id: string
  title: string
  description?: string
  due_date?: string
  created_by: string
  created_at: string
  updated_at: string
  course?: Course
  teacher?: Profile
  submission?: Submission
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  content?: string
  file_url?: string
  grade?: number
  feedback?: string
  submitted_at: string
  graded_at?: string
  student?: Profile
  assignment?: Assignment
}