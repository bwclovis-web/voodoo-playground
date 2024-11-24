import { z } from "zod"

export const CreateAccountSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.')
})

export const LoginSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.')
})

export const OnboardAccountSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long.')
    .max(32, 'Username must be at most 32 characters long.')
})

export const VerifyCodeSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters.')
})

export const VerifyNoteSchema = z.object({
  body: z.string().min(10, 'Content must be at least 10 characters.'),
  title: z.string().min(3, 'Title must be at least 3 characters.')
})
