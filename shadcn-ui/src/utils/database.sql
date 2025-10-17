-- Enable RLS (Row Level Security)
-- Run this SQL in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- in hours
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(student_id, course_id)
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  file_url TEXT,
  grade INTEGER CHECK (grade >= 0 AND grade <= 100),
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  graded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(assignment_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Teachers can create courses" ON courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers can update own courses" ON courses FOR UPDATE USING (
  created_by = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers can delete own courses" ON courses FOR DELETE USING (
  created_by = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher')
);

-- Enrollments policies
CREATE POLICY "Students can view own enrollments" ON enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Teachers can view enrollments for their courses" ON enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM courses WHERE id = course_id AND created_by = auth.uid())
);
CREATE POLICY "Students can enroll in courses" ON enrollments FOR INSERT WITH CHECK (
  student_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
);
CREATE POLICY "Students can unenroll from courses" ON enrollments FOR DELETE USING (student_id = auth.uid());

-- Assignments policies
CREATE POLICY "Students can view assignments for enrolled courses" ON assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments WHERE course_id = assignments.course_id AND student_id = auth.uid())
  OR 
  EXISTS (SELECT 1 FROM courses WHERE id = assignments.course_id AND created_by = auth.uid())
);
CREATE POLICY "Teachers can create assignments for own courses" ON assignments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM courses WHERE id = course_id AND created_by = auth.uid())
);
CREATE POLICY "Teachers can update own assignments" ON assignments FOR UPDATE USING (
  created_by = auth.uid()
);
CREATE POLICY "Teachers can delete own assignments" ON assignments FOR DELETE USING (
  created_by = auth.uid()
);

-- Submissions policies
CREATE POLICY "Students can view own submissions" ON submissions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Teachers can view submissions for their assignments" ON submissions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM assignments a 
    JOIN courses c ON a.course_id = c.id 
    WHERE a.id = assignment_id AND c.created_by = auth.uid()
  )
);
CREATE POLICY "Students can create submissions" ON submissions FOR INSERT WITH CHECK (
  student_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
);
CREATE POLICY "Students can update own submissions" ON submissions FOR UPDATE USING (student_id = auth.uid());
CREATE POLICY "Teachers can update submissions (for grading)" ON submissions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM assignments a 
    JOIN courses c ON a.course_id = c.id 
    WHERE a.id = assignment_id AND c.created_by = auth.uid()
  )
);

-- Create storage bucket for assignment files
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false);

-- Storage policies
CREATE POLICY "Students can upload assignment files" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'assignments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can view own files" ON storage.objects FOR SELECT USING (
  bucket_id = 'assignments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Teachers can view student files for their courses" ON storage.objects FOR SELECT USING (
  bucket_id = 'assignments'
);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();