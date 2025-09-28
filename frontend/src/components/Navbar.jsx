import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, signInWithGoogle, signOutUser } from '../lib/firebase'

export default function Navbar() {
  const [user] = useAuthState(auth)

  return (
    <motion.header 
      className="bg-white border-b backdrop-blur-sm bg-white/95 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="font-semibold text-brand-700 text-xl">
            <motion.span
              className="inline-block"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              🏛️
            </motion.span>
            <span className="ml-2">CivicConnect</span>
          </Link>
        </motion.div>
        <nav className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/map" className="hover:text-brand-600 transition-colors duration-200 relative group">
              Map
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/report" className="hover:text-brand-600 transition-colors duration-200 relative group">
              Report
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </motion.div>
          {user && (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/admin" className="hover:text-brand-600 transition-colors duration-200 relative group">
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {!user ? (
              <button 
                onClick={signInWithGoogle} 
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-md hover:from-brand-700 hover:to-brand-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign in
              </button>
            ) : (
              <button 
                onClick={signOutUser} 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign out
              </button>
            )}
          </motion.div>
        </nav>
      </div>
    </motion.header>
  )
}
