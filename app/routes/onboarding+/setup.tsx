/* eslint-disable max-statements */
import { getFormProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, data, redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import bcrypt from "bcryptjs"
import { useRef } from "react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"

import Input from "~/components/Atoms/Input/Input"
import { prisma } from "~/db.server"
import { fetchSessionUser } from "~/models/user.server"
import { ROUTE_PATH as DASHBOARD_PATH } from '~/routes/dashboard+/_index'
import { validateCSRF } from "~/utils/server/csrf.server"
import { checkHoneypot } from "~/utils/server/honeypot.server"

import { OnboardAccountSchema } from "../auth+/Forms/validationUtils"
import { ROUTE_PATH as LOGIN_PATH } from '../auth+/login'

export const ROUTE_PATH = '/onboarding/setup' as const
export const meta: MetaFunction = () => [{ title: 'Remix SaaS - Username' }]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await fetchSessionUser(request, LOGIN_PATH)
  return {}
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const sessionUser = await fetchSessionUser(request, LOGIN_PATH)
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)
  const submission = parseWithZod(formData, { schema: OnboardAccountSchema })

  if (submission.status !== 'success') {
    return data(submission.reply(), { status: submission.status === 'error' ? 400 : 200 })
  }

  const { password, username } = submission.value
  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.update({
    data: {
      username
    },
    where: { id: sessionUser.id }
  })

  await prisma.password.create({
    data: {
      hash: hashedPassword,
      user: { connect: { id: sessionUser.id } }
    }
  })

  return redirect(DASHBOARD_PATH)
}

const AccountSetup = () => {
  const actionData = useActionData<{ errors?: { [key: string]: string } }>()
  const userNameRef = useRef<HTMLInputElement>(null)

  const [onboardForm, { username, password }] = useForm({
    constraint: getZodConstraint(OnboardAccountSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: OnboardAccountSchema })
    }
  })


  return (
    <Form
      method="POST"
      autoComplete="off"
      {...getFormProps(onboardForm)}
    >
      <AuthenticityTokenInput />
      <HoneypotInputs />
      <fieldset>
        <legend>First, lets create a user name</legend>
        <Input
          inputType="text"
          inputRef={userNameRef}
          actionData={actionData}
          action={username}
          inputId="userName"
        />
      </fieldset>
      <fieldset>
        <legend>Next lets create a password</legend>
        <Input
          inputType="password"
          inputRef={userNameRef}
          actionData={actionData}
          action={password}
        />
      </fieldset>
      <button className="w-full" type="submit">
        Continue
      </button>
    </Form>
  )
}

export default AccountSetup
