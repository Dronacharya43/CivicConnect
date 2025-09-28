import React from 'react'

export default function AdminPanel() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Panel (Prototype)</h1>
      <p className="text-sm text-gray-600">Assign tickets, update statuses, and view basic analytics will appear here.</p>
      <div className="border rounded p-4 bg-white">
        <div className="font-semibold mb-2">Analytics (sample)</div>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          <li>Open: —</li>
          <li>In Progress: —</li>
          <li>Closed: —</li>
          <li>Avg Resolution Time: —</li>
        </ul>
      </div>
    </div>
  )
}
