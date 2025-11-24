import jwt from 'jsonwebtoken'

export default function auth(req, res, next) {
  try {
    const hdr = req.headers.authorization || ''
    const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null
    if (!token) return res.status(401).json({ error: 'unauthorized' })
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'server_misconfig' })
    const payload = jwt.verify(token, secret)
    req.user = { id: payload.id }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' })
  }
}

