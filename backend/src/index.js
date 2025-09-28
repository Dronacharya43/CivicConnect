import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import issuesRouter from './routes/issues.js'
import analyticsRouter from './routes/analytics.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
// Static serving for uploaded/photos
app.use('/uploads', express.static(uploadsDir))

app.get('/health', (req, res) => res.json({ ok: true }))
app.use('/api/issues', issuesRouter)
app.use('/api/analytics', analyticsRouter)

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_connect'

mongoose.set('strictQuery', true)

async function start() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
