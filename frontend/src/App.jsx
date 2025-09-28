import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import ReportIssue from './pages/ReportIssue'
import MapDashboard from './pages/MapDashboard'
import IssueDetail from './pages/IssueDetail'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/report" element={<PageTransition><ReportIssue /></PageTransition>} />
            <Route path="/map" element={<PageTransition><MapDashboard /></PageTransition>} />
            <Route path="/issues/:id" element={<PageTransition><IssueDetail /></PageTransition>} />
            <Route
              path="/admin"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route path="*" element={<PageTransition><div>404 Not Found</div></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <motion.footer 
        className="text-center text-sm text-gray-500 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          Built with 
          <motion.span
            className="text-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            ❤️
          </motion.span>
          for civic transparency
        </motion.div>
      </motion.footer>
    </div>
  )
}
