import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userUid: { type: String },
    userDisplayName: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['road', 'waste', 'water', 'electricity', 'other'], required: true },
    severity: { type: String, enum: ['urgent', 'non-urgent'], required: true },
    department: { type: String },
    status: { type: String, enum: ['open', 'in_progress', 'closed'], default: 'open' },
    photoUrl: { type: String },
    upvotes: { type: Number, default: 0 },
    comments: { type: [CommentSchema], default: [] },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
  },
  { timestamps: true }
)

IssueSchema.index({ location: '2dsphere' })
IssueSchema.index({ category: 1, severity: 1, status: 1 })

export const Issue = mongoose.model('Issue', IssueSchema)
