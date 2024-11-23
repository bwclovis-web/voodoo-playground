import { getFormProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Form } from "@remix-run/react"

import Input from "~/components/Atoms/Input/Input"
import { fetchSessionUser } from "~/models/user.server"

import { CreateAccountSchema } from "../auth+/Forms/validationUtils"
import { ROUTE_PATH as LOGIN_PATH } from '../auth+/login'

export const ROUTE_PATH = '/onboarding/setup' as const
export const meta: MetaFunction = () => [{ title: 'Remix SaaS - Username' }]

export async function loader({ request }: LoaderFunctionArgs) {
  await fetchSessionUser(request, LOGIN_PATH)
  return {}
}
const AccountSetup = () => {
  const [onboardForm, { email }] = useForm({
    constraint: getZodConstraint(CreateAccountSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateAccountSchema })
    }
  })
  return (
    <Form
      method="POST"
      autoComplete="off"
      {...getFormProps(onboardForm)}
    >
      <fieldset>
        <legend>First, lets create a user name</legend>
        <Input
          label="Username"
          name="username"
          required
          inputType={"text"} />
      </fieldset>
    </Form>
  )
}

export default AccountSetup
