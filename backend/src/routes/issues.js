import express from 'express'
import multer from 'multer'
import { z } from 'zod'
import path from 'path'
import { fileURLToPath } from 'url'
import { Issue } from '../models/Issue.js'
import { classifyIssue } from '../utils/classifier.js'
import { optionalAuth } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

const uploadDir = path.join(__dirname, '..', '..', 'uploads')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  }
})

const upload = multer({ storage })

const CreateIssueSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().default(''),
  category: z.enum(['road', 'waste', 'water', 'electricity', 'other']).optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
})

router.post('/', optionalAuth, upload.single('photo'), async (req, res) => {
  try {
    const parsed = CreateIssueSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' })

    const { title, description } = parsed.data

    const ai = classifyIssue({ title, description })

    const category = parsed.data.category || ai.category
    const severity = ai.severity
    const department = ai.department

    const lat = parseFloat(parsed.data.lat ?? '0') || 28.6139
    const lng = parseFloat(parsed.data.lng ?? '0') || 77.2090

    let photoUrl
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      severity,
      department,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      status: 'open',
      photoUrl,
    })

    res.status(201).json(issue)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create issue' })
  }
})

router.get('/', async (req, res) => {
  try {
    const { category, severity, status, lng, lat, radiusKm } = req.query
    const q = {}
    if (category) q.category = category
    if (severity) q.severity = severity
    if (status) q.status = status

    if (lng && lat) {
      const radiusMeters = (parseFloat(radiusKm || '5') || 5) * 1000
      q.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusMeters,
        }
      }
    }

    const items = await Issue.find(q).sort({ createdAt: -1 }).limit(200)
    res.json({ items })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch issues' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue) return res.status(404).json({ error: 'Not found' })
    res.json(issue)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch issue' })
  }
})

router.post('/:id/upvote', optionalAuth, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    )
    if (!issue) return res.status(404).json({ error: 'Not found' })
    res.json(issue)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to upvote' })
  }
})

router.post('/:id/comment', optionalAuth, async (req, res) => {
  try {
    const { text, userUid, userDisplayName } = req.body
    if (!text) return res.status(400).json({ error: 'Text required' })
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { text, userUid, userDisplayName, createdAt: new Date() } } },
      { new: true }
    )
    if (!issue) return res.status(404).json({ error: 'Not found' })
    res.json(issue)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to comment' })
  }
})

router.patch('/:id/status', optionalAuth, async (req, res) => {
  try {
    const { status } = req.body
    if (!['open', 'in_progress', 'closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!issue) return res.status(404).json({ error: 'Not found' })
    res.json(issue)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update status' })
  }
})

export default router
