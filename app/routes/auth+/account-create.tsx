/* eslint-disable complexity */
import { getFormProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node'
import { data } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { useRef } from 'react'
import { useTranslation } from "react-i18next"
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'

import Input from '~/components/Atoms/Input/Input'
import metaUtil, { MetaData } from '~/components/Utility/metaUtil'
import { commitSession, getSession } from '~/modules/auth/auth-session.server'
import { auth } from '~/modules/auth/auth.server'
import i18nServer from '~/modules/i18n/i18n.server'
import { ROUTE_PATH as AUTH_VERIFY_PATH } from '~/routes/auth+/VerifyCode'
import { ROUTE_PATH as DASHBOARD_PATH } from '~/routes/dashboard+/_index'
import { validateCSRF } from '~/utils/server/csrf.server'
import { checkHoneypot } from '~/utils/server/honeypot.server'


import { CreateAccountSchema } from './Forms/validationUtils'

export const ROUTE_PATH = '/auth/account-create' as const


export const meta: MetaFunction = ({ data }) => (
  metaUtil(data as MetaData)
)

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18nServer.getFixedT(request)
  await auth.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH
  })

  const cookie = await getSession(request.headers.get('Cookie'))
  const authEmail = cookie.get('auth:email')
  const authError = cookie.get(auth.sessionErrorKey)

  return data(
    {
      authEmail,
      authError,
      description: t("createAccount.meta.description"),
      title: t("createAccount.meta.title")
    } as const,
    {
      headers: {
        'Set-Cookie': await commitSession(cookie)
      }
    }
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

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
    <div className="mx-auto flex h-full w-full max-w-96 flex-col justify-center">
      <div className="mb-2">
        <h2>
          {t("createAccount.heading")}
        </h2>
        <p className="pb-4 text-slate-500 text-sm">
          {t("createAccount.subheading")}
        </p>
      </div>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1 mb-4"
        {...getFormProps(emailForm)}>
        <AuthenticityTokenInput />
        <HoneypotInputs />
        {/* Security */}

        <Input inputType="email" inputRef={inputRef} defaultValue={authEmail} action={email} />

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
