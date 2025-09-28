import React from 'react'
import { motion } from 'framer-motion'

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  hoverScale = 1.02,
  ...props 
}) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ 
        scale: hoverScale, 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedList({ children, className = '', stagger = 0.1 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedListItem({ children, className = '', ...props }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.4 }
        }
      }}
      whileHover={{ x: 5 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}