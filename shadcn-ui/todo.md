SmartLearn Full-Stack Application - MVP Todo
Core Files to Create/Modify:
Environment & Configuration

.env.example - Example environment variables for Supabase
package.json - Add required dependencies (framer-motion, @supabase/supabase-js)
Authentication & Context

src/contexts/AuthContext.tsx - Authentication context with Supabase
src/hooks/useAuth.tsx - Custom hook for authentication
src/utils/supabase.ts - Supabase client configuration
Components

src/components/ProtectedRoute.tsx - Route protection component
src/components/Navbar.tsx - Navigation component
src/components/Footer.tsx - Footer component
Pages

src/pages/Landing.tsx - Landing page with hero section
src/pages/Login.tsx - Login page with form
src/pages/Register.tsx - Registration page with validation
src/pages/Dashboard.tsx - Protected dashboard page
Main App Files

src/App.tsx - Main app with routing and auth context
index.html - Update title and meta tags
Implementation Strategy:
Use shadcn-ui components for consistent UI
Implement Supabase authentication with email verification
Add form validation and error handling
Use framer-motion for smooth animations
Ensure responsive design with Tailwind CSS
Implement proper routing with React Router v6