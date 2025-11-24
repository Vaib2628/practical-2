import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    photoUrl: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Contact', contactSchema)

