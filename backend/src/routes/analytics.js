import express from 'express'
import { Issue } from '../models/Issue.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [open, inProgress, closed] = await Promise.all([
      Issue.countDocuments({ status: 'open' }),
      Issue.countDocuments({ status: 'in_progress' }),
      Issue.countDocuments({ status: 'closed' }),
    ])
    // naive average resolution time placeholder: not computed without closed timestamps
    res.json({ open, inProgress, closed, avgResolutionHours: null })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to compute analytics' })
  }
})

export default router
