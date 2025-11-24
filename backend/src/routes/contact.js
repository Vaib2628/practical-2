import express from 'express'
import multer from 'multer'
import path from 'path'
import auth from '../middleware/auth.js'
import Contact from '../models/Contact.js'
import { contactCreateSchema, contactUpdateSchema } from '../utils/validators.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'backend/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`)
  }
})

const upload = multer({ storage })

router.use(auth)

router.get('/', async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      Contact.find({ userId: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments({ userId: req.user.id })
    ])
    res.json({ items, page, limit, total })
  } catch (err) { next(err) }
})

router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    const parsed = contactCreateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'validation_error', details: parsed.error.flatten() })
    }
    const base = `${req.protocol}://${req.get('host')}`
    const photoUrl = req.file ? `${base}/uploads/${req.file.filename}` : undefined
    const contact = await Contact.create({ ...parsed.data, userId: req.user.id, photoUrl })
    res.status(201).json(contact)
  } catch (err) { next(err) }
})

router.put('/:id', upload.single('photo'), async (req, res, next) => {
  try {
    const parsed = contactUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'validation_error', details: parsed.error.flatten() })
    }
    const update = { ...parsed.data }
    if (req.file) {
      const base = `${req.protocol}://${req.get('host')}`
      update.photoUrl = `${base}/uploads/${req.file.filename}`
    }
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true }
    )
    if (!contact) return res.status(404).json({ error: 'not_found' })
    res.json(contact)
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!contact) return res.status(404).json({ error: 'not_found' })
    res.status(204).send()
  } catch (err) { next(err) }
})

export default router
