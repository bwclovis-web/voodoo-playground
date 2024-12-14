import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { ActionFunctionArgs, LoaderFunctionArgs, data } from "@remix-run/node"
import { Form, redirect, useActionData, useLoaderData } from "@remix-run/react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"

import Input from "~/components/Atoms/Input/Input"
import { commitSession, getSession } from "~/modules/auth/auth-session.server"
import { auth } from "~/modules/auth/auth.server"
import { ROUTE_PATH as DASHBOARD_PATH } from '~/routes/dashboard+/_index'
import { validateCSRF } from "~/utils/server/csrf.server"
import { checkHoneypot } from "~/utils/server/honeypot.server"

import { VerifyCodeSchema } from "./Forms/validationUtils"
export const ROUTE_PATH = '/auth/verify' as const

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
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  await auth.authenticate('TOTP', request, {
    failureRedirect: pathname,
    successRedirect: pathname
  })
}

const VerifyCodeForm = () => {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const actionData = useActionData<{ errors?: { [key: string]: string } }>()

  const [codeForm, { code }] = useForm({
    constraint: getZodConstraint(VerifyCodeSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyCodeSchema })
    }
  })
  // const isHydrated = useHydrated()
  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <h2 className="text-center">{t("codeConfirm.heading")}</h2>
        <p className="text-center">
          {t("codeConfirm.subheading")}
        </p>
      </div>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(codeForm)}>
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <div className="flex w-full flex-col gap-1.5">
          <Input inputType={"text"} inputRef={inputRef} action={code} inputId="code" />
        </div>

        <button type="submit" className="w-full">
          {t("codeConfirm.continueButton")}
        </button>
      </Form>

      {/* Request New Code. */}
      {/* Email is already in session, input it's not required. */}
      <Form method="POST" className="flex w-full flex-col">
        {/* <AuthenticityTokenInput />
        <HoneypotInputs /> */}

        <p className="text-center text-sm font-normal text-primary/60">
          {t("codeConfirm.newCode.heading")}
        </p>
        <button type="submit" variant="ghost" className="w-full hover:bg-transparent">
          {t("codeConfirm.newCode.button")}
        </button>
      </Form>
    </div>
  )
}

export default VerifyCodeForm
