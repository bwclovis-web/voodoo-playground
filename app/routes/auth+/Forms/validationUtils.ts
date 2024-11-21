import { z } from "zod"

export const CreateAccountSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.')
})

export const LoginSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.'),
  password: z.string()
})
