/* eslint-disable complexity */
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { useRef } from 'react'
import { useTranslation } from "react-i18next"

import Input from '~/components/Atoms/Input/Input'
import { commitSession, getSession } from '~/modules/auth/auth-session.server'
import { auth } from '~/modules/auth/auth.server'
import { ROUTE_PATH as AUTH_VERIFY_PATH } from '~/routes/auth+/VerifyCode'
import { ROUTE_PATH as DASHBOARD_PATH } from '~/routes/dashboard+/_index'

import { CreateAccountSchema } from './Forms/validationUtils'

export const ROUTE_PATH = '/auth/account-create' as const

export const meta: MetaFunction = () => [{ title: `bob - Login` }]

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH
  })

  const cookie = await getSession(request.headers.get('Cookie'))
  const authEmail = cookie.get('auth:email')
  const authError = cookie.get(auth.sessionErrorKey)

  return json({ authEmail, authError } as const, {
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
    successRedirect: AUTH_VERIFY_PATH
  })
}

export default function AccountCreatePage() {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const inputRef = useRef<HTMLInputElement>(null)
  // const isHydrated = useHydrated()
  // const isPending = useIsPending()
  const { t } = useTranslation()

  const [emailForm, { email }] = useForm({
    constraint: getZodConstraint(CreateAccountSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateAccountSchema })
    }
  })

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <h2 className="text-center text-2xl font-medium text-primary">
          {t("createAccount.heading")}
        </h2>
        <p className="text-center text-base font-normal text-primary/60">
          {t("createAccount.subheading")}
        </p>
      </div>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(emailForm)}>
        {/* Security */}
        {/* <AuthenticityTokenInput />
        <HoneypotInputs /> */}
        <Input inputType="email" ref={inputRef} defaultValue={authEmail} action={email} />

        <div className="flex flex-col">
          {!authError && email.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {email.errors.join(' ')}
            </span>
          )}
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
        </div>

        <button type="submit" className="w-full">
          {t("createAccount.continueButton")}
        </button>
      </Form>

      <p className="px-12 text-center text-sm font-normal leading-normal text-primary/60">
        By clicking continue, you agree to our{' '}
        <a href="/" className="underline hover:text-primary">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/" className="underline hover:text-primary">
          Privacy Policy.
        </a>
      </p>
    </div>
  )
}
