import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Outlet, useActionData, useFetcher, useLoaderData } from "@remix-run/react"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { HoneypotInputs } from "remix-utils/honeypot/react"

import { Button } from "~/components/Atoms/Button/Button"
import Input from "~/components/Atoms/Input/Input"
import { createNote, getAllCustomerNotes } from "~/models/notes.server"
import { fetchUser } from "~/models/user.server"
import { requireSessionUser } from "~/modules/auth/auth-session.server"
import { validateCSRF } from "~/utils/server/csrf.server"
import { checkHoneypot } from "~/utils/server/honeypot.server"

import { VerifyNoteSchema } from "../auth+/Forms/validationUtils"
import { ROUTE_PATH as ACCOUNT_SETUP_PATH } from "../onboarding+/setup"
export const ROUTE_PATH = '/dashboard' as const

const createNewNote = (data: FormData, userID: string) => {
  const title = data.get('title') as string
  const body = data.get('body') as string
  createNote({ body, title, userId: userID })

  return {}
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await fetchUser(request, '')
  if (!user.password) {
    return redirect(ACCOUNT_SETUP_PATH)
  }
  const notes = await getAllCustomerNotes(user.id)

  return { notes, user }
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireSessionUser(request)
  const formData = await request.formData()
  await validateCSRF(formData, request.headers)
  checkHoneypot(formData)
  if (user) {
    return createNewNote(formData, user.id)
  }
  return {}
}
const DashboardLayout = () => {
  const { notes, user } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const inputRef = useRef<HTMLInputElement>(null)
  const actionData = useActionData<{ errors?: { [key: string]: string } }>()
  const { t } = useTranslation()

  const [notesForm, { title, body }] = useForm({
    constraint: getZodConstraint(VerifyNoteSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyNoteSchema })
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput'
  })

  return (
    <div className="bg-slate-200 h-full">
      <div className="mx-auto flex gap-6 h-full">
        <aside className="border-r-2 border-slate-50 pr-6 min-h-full p-6 bg-slate-300 w-1/5">
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <details className="mt-4">
            <summary className="cursor-pointer">Notes</summary>
            {notes.length ? <ul>
              {notes.map(note => (
                <li key={note.id}>{note.title}</li>
              ))}
            </ul> : <p>No notes</p>}
          </details>
          <details className="mt-4">
            <summary className="cursor-pointer">Create A Note</summary>
            <fetcher.Form method="POST" {...getFormProps(notesForm)}>
              <AuthenticityTokenInput />
              <HoneypotInputs />
              <Input action={title} inputType={"text"} inputRef={inputRef} inputId="noteTitle" actionData={actionData} />
              <textarea {...getInputProps(body, {
                ariaAttributes: true,
                type: "text"
              })} />

              <Button type="submit">
                {t("global.login")}
              </Button>
            </fetcher.Form>

          </details>
        </aside>
        <div className="py-6"><Outlet /></div>
      </div>
    </div>
  )
}

export default DashboardLayout
