import 'dotenv/config'
import mongoose from 'mongoose'
import { Issue } from '../src/models/Issue.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civic_connect'

async function run() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    await Issue.deleteMany({})

    const samples = [
      {
        title: 'Pothole near Connaught Place',
        description: 'Large pothole causing traffic jams and potential accidents.',
        category: 'road',
        severity: 'urgent',
        department: 'Public Works Department',
        location: { type: 'Point', coordinates: [77.216721, 28.632429] },
        status: 'open',
        upvotes: 5,
        photoUrl: 'https://picsum.photos/seed/pothole/800/500',
      },
      {
        title: 'Overflowing garbage bin in Bandra',
        description: 'Unhygienic condition with foul smell in the area.',
        category: 'waste',
        severity: 'non-urgent',
        department: 'Solid Waste Management',
        location: { type: 'Point', coordinates: [72.8296, 19.0596] },
        status: 'open',
        upvotes: 12,
        photoUrl: 'https://picsum.photos/seed/garbage/800/500',
      },
      {
        title: 'Streetlight not working in Koramangala 4th Block',
        description: 'Dark street, safety issue for pedestrians.',
        category: 'electricity',
        severity: 'urgent',
        department: 'Electricity Board',
        location: { type: 'Point', coordinates: [77.6229, 12.9352] },
        status: 'in_progress',
        upvotes: 8,
        photoUrl: 'https://picsum.photos/seed/streetlight/800/500',
      }
    ]

    await Issue.insertMany(samples)
    console.log(`Inserted ${samples.length} sample issues.`)
  } catch (err) {
    console.error(err)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected')
  }
}

run()
