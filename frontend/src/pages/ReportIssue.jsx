import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api, endpoints } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'

const categories = ['road', 'waste', 'water', 'electricity', 'other']

export default function ReportIssue() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('road')
  const [file, setFile] = useState(null)
  const [coords, setCoords] = useState({ lat: null, lng: null })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
      })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setStatus('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    if (coords.lat && coords.lng) formData.append('lat', coords.lat)
    if (coords.lng && coords.lng) formData.append('lng', coords.lng)
    if (file) formData.append('photo', file)

    try {
      const res = await api.post(`${endpoints.issues}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setStatus('Submitted successfully!')
      setTitle('')
      setDescription('')
      setCategory('road')
      setFile(null)
    } catch (err) {
      console.error(err)
      setStatus('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <motion.span
            className="mr-3"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            📝
          </motion.span>
          Report an Issue
        </h1>
      </motion.div>
      <motion.form 
        className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <motion.input
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all duration-200 bg-white"
            placeholder="Short title (e.g., Pothole on MG Road)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <motion.textarea
            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all duration-200 bg-white resize-none"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            whileFocus={{ scale: 1.02 }}
          />
        </motion.div>
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="text-sm font-medium text-gray-700">Category *</label>
          <motion.select 
            className="border-2 border-gray-200 p-3 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all duration-200 bg-white"
            value={category} 
            onChange={e => setCategory(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'road' && '🛣️'}
                {c === 'waste' && '🗑️'}
                {c === 'water' && '💧'}
                {c === 'electricity' && '⚡'}
                {c === 'other' && '📝'}
                {' '}{c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </motion.select>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo (optional)</label>
          <motion.div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-brand-400 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setFile(e.target.files[0])} 
              className="hidden" 
              id="file-upload"
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center"
            >
              <span className="text-2xl mb-2">📷</span>
              <span className="text-sm text-gray-600">
                {file ? file.name : 'Click to upload a photo'}
              </span>
            </label>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="text-lg">📍</span>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Location: </span>
            {coords.lat && coords.lng ? (
              <span className="text-green-700 font-mono">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </span>
            ) : (
              <span className="text-orange-600 flex items-center gap-1">
                <LoadingSpinner size="sm" />
                Detecting...
              </span>
            )}
          </div>
        </motion.div>
        <motion.button 
          disabled={submitting} 
          className="w-full px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-semibold rounded-lg hover:from-brand-700 hover:to-brand-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              Submitting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>📨</span>
              Submit Report
            </span>
          )}
        </motion.button>
        
        <AnimatePresence>
          {status && (
            <motion.div 
              className={`p-4 rounded-lg text-center font-medium ${
                status.includes('success') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xl mr-2">
                {status.includes('success') ? '✅' : '❌'}
              </span>
              {status}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  )
}
