import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api, endpoints } from '../lib/api'
import { Link } from 'react-router-dom'
import LoadingSpinner, { SkeletonLoader } from '../components/LoadingSpinner'

const defaultCenter = [28.6139, 77.2090] // New Delhi

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function MapDashboard() {
  const [filters, setFilters] = useState({ category: 'all', severity: 'all' })

  const { data, isLoading } = useQuery({
    queryKey: ['issues', filters],
    queryFn: async () => {
      const params = {}
      if (filters.category !== 'all') params.category = filters.category
      if (filters.severity !== 'all') params.severity = filters.severity
      const res = await api.get(endpoints.issues, { params })
      return res.data
    },
  })

  const issues = data?.items || []

  const position = useMemo(() => defaultCenter, [])

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <div className="flex gap-2 items-center">
          <SkeletonLoader lines={1} className="w-32" />
          <SkeletonLoader lines={1} className="w-32" />
        </div>
        <div className="h-[70vh] w-full rounded overflow-hidden border bg-gray-100 flex items-center justify-center">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading map...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <motion.div 
        className="flex gap-2 items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.select 
          className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
          value={filters.category} 
          onChange={e => setFilters(f => ({...f, category: e.target.value}))}
          whileFocus={{ scale: 1.02 }}
        >
          <option value="all">All categories</option>
          <option value="road">🛣️ Road</option>
          <option value="waste">🗑️ Waste</option>
          <option value="water">💧 Water</option>
          <option value="electricity">⚡ Electricity</option>
          <option value="other">📝 Other</option>
        </motion.select>
        <motion.select 
          className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent" 
          value={filters.severity} 
          onChange={e => setFilters(f => ({...f, severity: e.target.value}))}
          whileFocus={{ scale: 1.02 }}
        >
          <option value="all">All severities</option>
          <option value="urgent">🚨 Urgent</option>
          <option value="non-urgent">📋 Non-urgent</option>
        </motion.select>
        <motion.div
          className="ml-auto bg-brand-50 px-3 py-2 rounded-lg text-brand-700 font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {issues.length} issue{issues.length !== 1 ? 's' : ''} found
        </motion.div>
      </motion.div>

      <motion.div 
        className="h-[70vh] w-full rounded-xl overflow-hidden border shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AnimatePresence>
            {issues.map((issue, index) => (
              <Marker 
                key={issue._id} 
                position={[issue.location.coordinates[1], issue.location.coordinates[0]]} 
                icon={icon}
              >
                <Popup>
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="font-semibold text-gray-800">{issue.title}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        issue.severity === 'urgent' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {issue.severity === 'urgent' ? '🚨' : '📋'} {issue.severity}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {issue.category === 'road' && '🛣️'}
                        {issue.category === 'waste' && '🗑️'}
                        {issue.category === 'water' && '💧'}
                        {issue.category === 'electricity' && '⚡'}
                        {issue.category === 'other' && '📝'}
                        {' '}{issue.category}
                      </span>
                    </div>
                    <Link 
                      to={`/issues/${issue._id}`} 
                      className="inline-block mt-2 px-3 py-1 bg-brand-600 text-white text-sm rounded-md hover:bg-brand-700 transition-colors duration-200"
                    >
                      View details →
                    </Link>
                  </motion.div>
                </Popup>
              </Marker>
            ))}
          </AnimatePresence>
        </MapContainer>
      </motion.div>
    </div>
  )
}
