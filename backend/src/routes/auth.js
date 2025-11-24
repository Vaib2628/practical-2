import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { signInSchema, signUpSchema } from '../utils/validators.js'

const router = express.Router()

router.post('/sign-up', async (req, res, next) => {
  try {
    const parsed = signUpSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'validation_error', details: parsed.error.flatten() })
    }
    const { name, email, password } = parsed.data
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'email_exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    res.status(201).json({ id: user._id, name: user.name, email: user.email })
  } catch (err) {
    next(err)
  }
})

router.post('/sign-in', async (req, res, next) => {
  try {
    const parsed = signInSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'validation_error', details: parsed.error.flatten() })
    }
    const { email, password } = parsed.data
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'invalid_credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' })
    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'server_misconfig' })
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    next(err)
  }
})

export default router

