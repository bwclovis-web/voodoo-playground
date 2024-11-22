import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { ActionFunctionArgs, LoaderFunctionArgs, data } from "@remix-run/node"
import { Form, redirect, useLoaderData } from "@remix-run/react"
import { useRef } from "react"
import { z } from "zod"

import { commitSession, getSession } from "~/modules/auth/auth-session.server"
import { auth } from "~/modules/auth/auth.server"
import { ROUTE_PATH as DASHBOARD_PATH } from '~/routes/dashboard+/_index'
export const ROUTE_PATH = '/auth/verifyCode' as const

export const VerifyLoginSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters.')
})
export async function loader({ request }: LoaderFunctionArgs) {
  await auth.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH
  })

  const cookie = await getSession(request.headers.get('Cookie'))
  const authEmail = cookie.get('auth:email')
  const authError = cookie.get(auth.sessionErrorKey)

  if (!authEmail) {
    return redirect('/auth/login')
  }

  return data({ authEmail, authError } as const, {
    headers: {
      'Set-Cookie': await commitSession(cookie)
    }
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  // await validateCSRF(formData, clonedRequest.headers)
  // checkHoneypot(formData)

  await auth.authenticate('TOTP', request, {
    failureRedirect: pathname,
    successRedirect: pathname
  })
}

const VerifyCodeForm = () => {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const inputRef = useRef<HTMLInputElement>(null)

  const [codeForm, { code }] = useForm({
    constraint: getZodConstraint(VerifyLoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyLoginSchema })
    }
  })
  // const isHydrated = useHydrated()
  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <p className="text-center text-2xl text-primary">Check your inbox!</p>
        <p className="text-center text-base font-normal text-primary/60">
          We've just emailed you a temporary password.
          <br />
          Please enter it below.
        </p>
      </div>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(codeForm)}>
        {/* <AuthenticityTokenInput />
        <HoneypotInputs /> */}

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="code" className="sr-only">
            Code
          </label>
          <input
            placeholder="Code"
            ref={inputRef}
            required
            className={`bg-transparent ${code.errors && 'border-destructive focus-visible:ring-destructive'
              }`}
            {...getInputProps(code, { type: 'text' })}
          />
        </div>

        <div className="flex flex-col">
          {!authError && code.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {code.errors.join(' ')}
            </span>
          )}
          {authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
        </div>

        <button type="submit" className="w-full">
          Continue
        </button>
      </Form>

      {/* Request New Code. */}
      {/* Email is already in session, input it's not required. */}
      <Form method="POST" className="flex w-full flex-col">
        {/* <AuthenticityTokenInput />
        <HoneypotInputs /> */}

        <p className="text-center text-sm font-normal text-primary/60">
          Did not receive the code?
        </p>
        <button type="submit" variant="ghost" className="w-full hover:bg-transparent">
          Request New Code
        </button>
      </Form>
    </div>
  )
}

export default VerifyCodeForm
