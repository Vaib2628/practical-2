import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine((data) => data.password === data.confirmPassword, {
  message: 'password_mismatch',
  path: ['confirmPassword']
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const contactCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5)
})

export const contactUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).optional()
})

