/* eslint-disable complexity */
/* eslint-disable max-statements */
import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useSearchParams } from "@remix-run/react"
import { useRef } from "react"

import { commitSession, getSession } from "~/modules/auth/auth-session.server"
import { auth } from "~/modules/auth/auth.server"
import { ROUTE_PATH as CREATE_ACCOUNT_PATH } from '~/routes/auth+/account-create'
import { ROUTE_PATH as DASHBOARD_PATH } from "~/routes/dashboard+/_index"

import { LoginSchema } from "./Forms/validationUtils"

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url)
  const pathname = url.pathname
  await auth.authenticate('form', request, {
    failureRedirect: pathname,
    successRedirect: DASHBOARD_PATH
  })
}

const LoginPage = () => {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const actionData = useActionData<typeof action>()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [loginForm, { email, password }] = useForm({
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema })
    }
  })
  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="POST" className="space-y-6" {...getFormProps(loginForm)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                required
                defaultValue={authEmail ? authEmail : ''}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                autoComplete="email"
                {...getInputProps(email, { type: 'email' })}
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                ref={passwordRef}
                {...getInputProps(password, { type: 'password' })}
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col">
            {!authError && email.errors && (
              <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
                email {email.errors.join(' ')}
              </span>
            )}
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
            Log in
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
              Don&apos;t have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: CREATE_ACCOUNT_PATH,
                  search: searchParams.toString()
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}


export default LoginPage
