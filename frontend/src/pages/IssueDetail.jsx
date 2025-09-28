import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, endpoints } from '../lib/api'

export default function IssueDetail() {
  const { id } = useParams()
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const res = await api.get(`${endpoints.issues}/${id}`)
      return res.data
    },
  })

  const upvote = useMutation({
    mutationFn: async () => (await api.post(`${endpoints.issues}/${id}/upvote`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['issue', id] })
    }
  })

  if (!data) return <div>Loading...</div>
  const issue = data

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">{issue.title}</h1>
      <div className="text-sm text-gray-600">{issue.category} • {issue.severity} • Status: {issue.status}</div>
      {issue.photoUrl && (
        <img src={issue.photoUrl} alt="Issue" className="w-full max-h-96 object-cover rounded border" />
      )}
      <p>{issue.description}</p>

      <div className="flex items-center gap-2">
        <button onClick={() => upvote.mutate()} className="px-3 py-1.5 bg-brand-600 text-white rounded">
          Upvote ({issue.upvotes || 0})
        </button>
      </div>

      <section>
        <h2 className="font-semibold mb-2">Comments</h2>
        <ul className="space-y-2">
          {(issue.comments || []).map((c, idx) => (
            <li key={idx} className="border rounded p-2">
              <div className="text-sm text-gray-700">{c.text}</div>
              <div className="text-xs text-gray-500">by {c.userDisplayName || 'Anonymous'}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
