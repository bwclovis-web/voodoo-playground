/* eslint-disable max-statements */
import { getFormProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, data } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useSearchParams } from "@remix-run/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"

import Input from "~/components/Atoms/Input/Input"
import metaUtil, { MetaData } from "~/components/Utility/metaUtil"
import { commitSession, getSession } from "~/modules/auth/auth-session.server"
import { auth } from "~/modules/auth/auth.server"
import i18nServer from "~/modules/i18n/i18n.server"
import { ROUTE_PATH as CREATE_ACCOUNT_PATH } from '~/routes/auth+/account-create'
import { ROUTE_PATH as DASHBOARD_PATH } from "~/routes/dashboard+/_index"
import { validateCSRF } from "~/utils/server/csrf.server"
import { checkHoneypot } from "~/utils/server/honeypot.server"

import { LoginSchema } from "./Forms/validationUtils"

export const ROUTE_PATH = '/auth/login' as const

export const meta: MetaFunction = ({ data }) => (
  metaUtil(data as MetaData)
)

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const t = await i18nServer.getFixedT(request)
  await auth.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH
  })

  const cookie = await getSession(request.headers.get('Cookie'))
  const authEmail = cookie.get('auth:email')
  const authError = cookie.get(auth.sessionErrorKey)

  return data({
    authEmail,
    authError,
    description: t("logIn.meta.description"),
    title: t("logIn.meta.title")
  } as const, {
    headers: {
      'Set-Cookie': await commitSession(cookie)
    }
  })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url)
  const pathname = url.pathname
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, request.headers)
  checkHoneypot(formData)
  await auth.authenticate('form', request, {
    failureRedirect: pathname,
    successRedirect: DASHBOARD_PATH
  })
}

const LoginPage = () => {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const actionData = useActionData<{ errors?: { [key: string]: string } }>()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const [loginForm, { email, password }] = useForm({
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema })
    }
  })
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <h2>{t("logIn.heading")}</h2>
        <p className="pb-4 text-slate-500">{t("logIn.subheading")}</p>
        <Form method="POST" className="space-y-6" {...getFormProps(loginForm)}>
          {/* SECURITY */}
          <AuthenticityTokenInput />
          <HoneypotInputs />
          <Input
            inputType="email"
            inputRef={emailRef}
            defaultValue={authEmail}
            actionData={actionData}
            action={email}
          />
          <Input
            inputType="password"
            inputRef={passwordRef}
            actionData={actionData}
            action={password}
          />
          <div className="flex flex-col">
            {!authEmail && authError && (
              <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
                auth {authError.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            {t("global.login")}
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              <span>{t("logIn.noAccountText")} </span>
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: CREATE_ACCOUNT_PATH,
                  search: searchParams.toString()
                }}
              >
                {t("global.signUp")}
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
