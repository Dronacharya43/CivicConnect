import admin from 'firebase-admin'

let initialized = false

function initFirebaseAdmin() {
  if (initialized) return
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) return
  const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  })
  initialized = true
}

export async function optionalAuth(req, res, next) {
  const enabled = String(process.env.ENABLE_FIREBASE_AUTH || '').toLowerCase() === 'true'
  if (!enabled) return next()

  initFirebaseAdmin()
  if (!initialized) return res.status(500).json({ error: 'Firebase admin not configured' })

  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name }
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
