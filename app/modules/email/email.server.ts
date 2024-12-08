import { z } from 'zod'

// import { ERRORS } from '#app/utils/constants/errors'

const ResendSuccessSchema = z.object({
  id: z.string()
})
const ResendErrorSchema = z.union([
  z.object({
    message: z.string(),
    name: z.string(),
    statusCode: z.number()
  }),
  z.object({
    cause: z.any(),
    message: z.literal('Unknown Error'),
    name: z.literal('UnknownError'),
    statusCode: z.literal(500)
  })
])

export type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

const sendEmailCheck = async (options: SendEmailOptions) => {
  const from = 'onboarding@resend.dev'
  const email = { from, ...options }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(email)
  }).then(res => handleResponse(res))
}

const handleFailResponse = (data: unknown) => {
  const parsedErrorResult = ResendErrorSchema.safeParse(data)
  if (parsedErrorResult.success) {
    console.error(parsedErrorResult.data)
    throw new Error('hello')
  } else {
    console.error(data)
    throw new Error('hello')
  }
}

const handleResponse = async (res: Response) => {
  const data = await res.json()
  const parsedData = ResendSuccessSchema.safeParse(data)
  if (res.ok && parsedData.success) {
    return { data: parsedData, status: 'success' } as const
  } else {
    handleFailResponse(data)
  }
}

export async function sendEmail(options: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error(`Resend - ${'hello'}`)
  }
  sendEmailCheck(options)
}
