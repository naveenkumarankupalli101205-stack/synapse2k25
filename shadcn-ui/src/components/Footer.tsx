import { motion } from 'framer-motion'

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-50 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">SL</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SmartLearn
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Empowering learners with intelligent educational tools
          </p>
          <div className="text-sm text-gray-500">
            <p>Contact: info@smartlearn.com | Phone: (555) 123-4567</p>
            <p className="mt-2">© 2024 SmartLearn. All rights reserved.</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}