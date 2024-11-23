import { z } from "zod"

export const CreateAccountSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.')
})

export const LoginSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.')
})

export const onboardAccountSchema = z.object({
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .toLowerCase()
    .trim()
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, 'Password must contain at least one uppercase letter, one number, and one special character.'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long.')
    .toLowerCase()
    .trim()
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, 'Password must contain at least one uppercase letter, one number, and one special character.'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long.')
    .max(32, 'Username must be at most 32 characters long.')
})
