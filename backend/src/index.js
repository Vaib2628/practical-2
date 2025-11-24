import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRouter from './routes/auth.js'
import contactRouter from './routes/contact.js'
import errorHandler from './middleware/error.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('backend/uploads'))

app.use('/api', authRouter)
app.use('/api/contact', contactRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

async function start() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not configured')
    }
    await mongoose.connect(MONGODB_URI)
    app.listen(PORT, () => {
      console.log(`server: http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('startup_error', err.message)
    process.exit(1)
  }
}

start()
