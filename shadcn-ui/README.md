SmartLearn - AI-Powered Learning Platform
A full-stack web application built with React.js and Supabase that provides an intelligent educational platform with user authentication, email verification, and a modern responsive design.

🚀 Features
Core Features
Landing Page: Clean, modern, responsive design with hero section and smooth animations
User Authentication: Complete Supabase authentication system with email + password
Email Verification: Automatic email verification required before dashboard access
Password Reset: Secure password reset functionality via email
Protected Dashboard: User dashboard accessible only after login and verification
Responsive Design: Mobile-first design that works on all devices
Technical Features
React.js with TypeScript for type safety
Supabase for backend authentication and database
shadcn/ui components for consistent, modern UI
Tailwind CSS for styling with soft pastel theme
Framer Motion for smooth animations
React Router v6 for client-side routing
Form Validation with real-time feedback
Error Handling with user-friendly messages
🛠️ Technology Stack
Frontend: React.js, TypeScript, Vite
Backend: Supabase (Authentication, Database)
Styling: Tailwind CSS, shadcn/ui
Animations: Framer Motion
Routing: React Router v6
Build Tool: Vite
Package Manager: pnpm
📦 Installation
Prerequisites
Node.js (v18 or higher)
pnpm (recommended) or npm
Supabase account
1. Clone the Repository
git clone <your-repo-url>
cd smartlearn
2. Install Dependencies
pnpm install
# or
npm install
3. Environment Setup
Create a .env file in the root directory and add your Supabase credentials:

VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
You can find these values in your Supabase project dashboard under Settings > API.

4. Supabase Setup
Create a new project in Supabase
Go to Authentication > Settings
Configure your site URL and redirect URLs
Enable email confirmations in Auth settings
Copy your project URL and anon key to the .env file
5. Run the Development Server
pnpm run dev
# or
npm run dev
The application will be available at http://localhost:5173

🏗️ Project Structure
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Navbar.tsx         # Navigation component
│   ├── Footer.tsx         # Footer component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── pages/
│   ├── Landing.tsx        # Landing page
│   ├── Login.tsx          # Login page
│   ├── Register.tsx       # Registration page
│   ├── Dashboard.tsx      # User dashboard
│   └── NotFound.tsx       # 404 page
├── utils/
│   └── supabase.ts        # Supabase client config
├── App.tsx                # Main app component
└── main.tsx              # App entry point
🎨 Design Features
Soft Pastel Theme: Beautiful gradient backgrounds and modern color scheme
Responsive Layout: Mobile-first design that adapts to all screen sizes
Smooth Animations: Framer Motion animations for enhanced user experience
Modern UI Components: shadcn/ui components with consistent styling
Accessibility: Proper contrast ratios and semantic HTML
🔐 Authentication Flow
Registration: Users create account with email verification
Email Verification: Required before dashboard access
Login: Secure authentication with error handling
Password Reset: Email-based password recovery
Protected Routes: Dashboard accessible only to verified users
📱 Pages Overview
Landing Page
Hero section with SmartLearn branding
Feature highlights with icons and descriptions
Call-to-action buttons for registration and login
Responsive navigation and footer
Registration Page
Form validation with real-time feedback
Password strength indicators
Email format validation
Success message with verification instructions
Login Page
Clean login form with show/hide password
Error handling for unverified emails
Password reset functionality
Redirect to dashboard on success
Dashboard Page
Personalized welcome message
Learning statistics and progress
Course recommendations
Quick action buttons
🚀 Deployment
Build for Production
pnpm run build
# or
npm run build
Deploy to Vercel (Recommended)
Connect your GitHub repository to Vercel
Add environment variables in Vercel dashboard
Deploy automatically on push to main branch
Deploy to Netlify
Build the project locally
Upload the dist folder to Netlify
Configure environment variables
Set up continuous deployment
🔧 Available Scripts
pnpm run dev - Start development server
pnpm run build - Build for production
pnpm run preview - Preview production build
pnpm run lint - Run ESLint
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support
If you encounter any issues or have questions:

Check the Issues page
Create a new issue with detailed description
Contact: support@smartlearn.com
🙏 Acknowledgments
Supabase for the backend infrastructure
shadcn/ui for the beautiful UI components
Tailwind CSS for the styling system
Framer Motion for animations